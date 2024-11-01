import { useState } from 'react'

import { isConventionalError } from '~/lib/utils'
import {
    FileMetaWithFile,
    PresignRequest,
    PresignResponseSchema,
} from '~/routes/_webie.admin.api.object-storage/schema'

/**
 * Generate a role and type based storage key for the file, for example:
 * asset/private/image/webie@1234567890-ABCD-ddd0bbb-88ee-1234-8abc-c098765b1b1b
 * @param file pass in file type and file name
 * @param access role based authentication
 * @returns the key (path) of the file
 */
export const generateStorageKey = (
    file: { type: string; name: string },
    access: 'private' | 'public'
) => {
    const fileType = file.type.split('/')[0]
    const timestamp = Date.now()
    const randomRef = Math.random().toString(36).substring(2, 6).toUpperCase()
    const randomUUID = crypto.randomUUID()
    return `asset/${access}/${fileType}/webie@${timestamp}-${randomRef}-${randomUUID}`
}

// Generate SHA-256 checksum for a file
async function generateChecksum(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}

const objectStorageAPI = '/admin/api/object-storage'

/**
 * Fetch the api to get presigned Put URLs for the files
 * @param files
 * @returns files with presigned Put URLs and key as new id
 */
export const fetchPresignedPutUrls = async (
    files: FileMetaWithFile[]
): Promise<(FileMetaWithFile & { presignedUrl: string })[]> => {
    try {
        const fileDataPromise = files.map(async file => {
            const fileChecksum = await generateChecksum(file.file)
            const fileData: PresignRequest[number] = {
                id: file.id,
                name: file.name,
                type: file.file.type,
                size: file.file.size,
                checksum: fileChecksum,
                description: file.description ?? '',
            }
            return fileData
        })

        const fileData: PresignRequest = await Promise.all(fileDataPromise)

        const putPresignedUrlsres = await fetch(objectStorageAPI, {
            method: 'PUT',
            body: JSON.stringify(fileData),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!putPresignedUrlsres.ok) {
            throw new Error(`HTTP error! status: ${putPresignedUrlsres.status}`)
        }

        const responsePayload = await putPresignedUrlsres.json()

        if (isConventionalError(responsePayload)) {
            throw new Error(responsePayload.err)
        }

        const validatedData = PresignResponseSchema.parse(responsePayload.data)

        // Update files with presigned URLs
        const updatedFiles = files.map(file => {
            const presignData = validatedData.urls.find(
                url => url.id === file.id
            )
            if (!presignData) throw new Error('Presigned URL not found')
            return {
                ...file,
                presignedUrl: presignData.presignedUrl,
            }
        })
        return updatedFiles
    } catch (error) {
        throw error
    }
}

/**
 * Delete file from object storage
 * @param key
 * @returns void
 */
export const deleteFile = async (key: string) => {
    try {
        const res = await fetch(objectStorageAPI, {
            method: 'DELETE',
            body: JSON.stringify({ key }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            throw new Error(`Failed to delete key: ${key}`)
        }
    } catch (error) {
        throw error
    }
}

// Types for upload progress tracking
type UploadProgress = {
    id: string
    progress: number
    status: 'pending' | 'uploading' | 'completed' | 'error'
    error?: string
}
type UploadState = Record<string, UploadProgress>

/**
 * Hook to get upload function progress for files
 */
export const useFileUpload = () => {
    const [uploadProgress, setUploadProgress] = useState<UploadState>({})

    const uploadSingleFile = async (
        file: FileMetaWithFile & { presignedUrl: string }
    ) => {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            // Track upload progress
            xhr.upload.onprogress = event => {
                if (event.lengthComputable) {
                    const progress = Math.round(
                        (event.loaded / event.total) * 98
                    )
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.id]: {
                            ...prev[file.id],
                            progress,
                            status: 'uploading',
                        },
                    }))
                }
            }

            // Handle successful upload
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.id]: {
                            ...prev[file.id],
                            progress: 100,
                            status: 'completed',
                        },
                    }))
                    resolve()
                } else {
                    const error = `Upload failed with status ${xhr.status}`
                    setUploadProgress(prev => ({
                        ...prev,
                        [file.id]: {
                            ...prev[file.id],
                            status: 'error',
                            error,
                        },
                    }))
                    deleteFile(file.id)
                    reject(new Error(error))
                }
            }

            // Handle network errors
            xhr.onerror = () => {
                const error = 'Network error occurred'
                setUploadProgress(prev => ({
                    ...prev,
                    [file.id]: {
                        ...prev[file.id],
                        status: 'error',
                        error,
                    },
                }))
                deleteFile(file.id)
                reject(new Error(error))
            }

            // Open connection
            xhr.open('PUT', file.presignedUrl)

            // Set headers for CORS and content
            xhr.setRequestHeader('Content-Type', file.file.type)

            // Important: Set withCredentials to false for CORS with presigned URLs
            xhr.withCredentials = false

            xhr.send(file.file)
        })
    }

    const uploadSingleFileWithRetry = async (
        file: FileMetaWithFile & { presignedUrl: string },
        retries = 3
    ): Promise<void> => {
        try {
            await uploadSingleFile(file)
        } catch (error) {
            if (retries > 0) {
                console.log(
                    `Retrying upload for ${file.name}, attempts left: ${retries}`
                )
                return uploadSingleFileWithRetry(file, retries - 1)
            } else {
                console.error(`Upload failed for ${file.name} after retries`)
                throw error
            }
        }
    }

    const uploadToPresignedUrl = async (
        files: (FileMetaWithFile & { presignedUrl: string })[]
    ) => {
        // Initialize progress state for all files
        setUploadProgress(prev => {
            const initial = files.reduce(
                (acc, file) => ({
                    ...acc,
                    [file.id]: {
                        id: file.id,
                        progress: 0,
                        status: 'pending' as const,
                    },
                }),
                {}
            )
            return { ...prev, ...initial }
        })

        try {
            // Upload all files simultaneously
            const uploadPromises = files.map(file =>
                uploadSingleFileWithRetry(file)
            )
            await Promise.allSettled(uploadPromises)
        } catch (error) {
            console.error('Upload failed:', error)
            throw error
        }
    }

    return {
        uploadProgress,
        uploadToPresignedUrl,
    }
}
