import { ActionFunctionArgs, json } from '@remix-run/node'
import { userIs } from '~/lib/db/auth.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
import { getUploadUrl } from './get-presigned-url'
import { PresignRequestSchema, PresignResponseSchema } from './schema'

// Presign url for uploading assets
export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    const jsonData = await request.json()

    // Validate request data
    const {
        data: fileMetadata,
        success,
        error,
    } = PresignRequestSchema.safeParse(jsonData)
    if (!success) {
        console.error('Invalidate request data', error)
        return new Response('Bad Request', { status: 400 })
    }

    try {
        // Get presigned URLs for all files
        const presignedUrls = await Promise.all(
            fileMetadata.map(async file => {
                const key = generateStorageKey(file)
                const presignedUrl = await getUploadUrl({
                    key,
                    size: file.size,
                    type: file.type,
                    checksum: file.checksum,
                    Metadata: {
                        userId: admin.id,
                        description: file.description,
                    },
                })
                return {
                    id: file.id,
                    presignedUrl,
                    key,
                }
            })
        )

        const validatedResponse = PresignResponseSchema.parse({
            urls: presignedUrls,
        })

        return json<ConventionalSuccess>({
            msg: 'Presign urls generated successfully',
            data: validatedResponse,
            options: { preventAlert: true },
        })
    } catch (error) {
        console.log('Error generating presigned URLs', error)
        return json<ConventionalError>({
            err: 'Failed to generate presigned URLs',
        })
    }
}

const generateStorageKey = (file: { type: string; name: string }) => {
    // TODO: Authenticate user and generate key based on user id
    const fileType = file.type.split('/')[0]
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `asset/${fileType}/Webie@${timestamp}$${random}-${file.name}`
}
