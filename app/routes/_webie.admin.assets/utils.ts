import {
    FileUploaded,
    PresignRequest,
    PresignResponseSchema,
} from '~/routes/_webie.admin.api.object-storage/schema'

/**
 * Fetch the api to get presigned URLs for the files
 * @param files
 * @returns files with presigned URLs
 */
export const fetchPresignedUrls = async (
    files: FileUploaded[]
): Promise<(FileUploaded & { presignedUrl: string })[]> => {
    try {
        // Prepare file metadata
        const fileMetadata: PresignRequest = files.map(file => ({
            id: file.id,
            name: file.name,
            type: file.file.type,
            size: file.file.size,
        }))

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
 * Upload files to presigned URL
 */
export const uploadToPresignUrl = async () => {}
