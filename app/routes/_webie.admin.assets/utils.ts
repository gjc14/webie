import {
    FileUploaded,
    PresignRequest,
    PresignResponseSchema,
} from '~/routes/_webie.admin.api.object-storage/schema'

async function generateChecksum(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}

/**
 * Fetch the api to get presigned URLs for the files
 * @param files
 * @returns files with presigned URLs
 */
export const fetchPresignedUrls = async (
    files: FileUploaded[]
): Promise<(FileUploaded & { presignedUrl: string })[]> => {
    try {
        const fileMetadataPromise = files.map(async file => {
            const fileChecksum = await generateChecksum(file.file)
            return {
                id: file.id,
                name: file.name,
                type: file.file.type,
                size: file.file.size,
                checksum: fileChecksum,
                description: file.description,
            }
        })

        const fileMetadata: PresignRequest = await Promise.all(
            fileMetadataPromise
        )

        const res = await fetch('/admin/api/object-storage', {
            method: 'POST',
            body: JSON.stringify(fileMetadata),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        const responsePayload = await res.json()
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
 * Hook to get upload function progress for files
 */
import { useState } from 'react'

// Types for upload progress tracking
type UploadProgress = {
    id: string
    progress: number
    status: 'pending' | 'uploading' | 'completed' | 'error'
    error?: string
}

type UploadState = Record<string, UploadProgress>

export const useFileUpload = () => {
    const [uploadProgress, setUploadProgress] = useState<UploadState>({})

    const uploadSingleFile = async (
        file: FileUploaded & { presignedUrl: string }
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
        file: FileUploaded & { presignedUrl: string },
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
        files: (FileUploaded & { presignedUrl: string })[]
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
