import { ActionFunctionArgs, json } from '@remix-run/node'

import { prisma, S3 } from '~/lib/db/_db.server'
import { deleteFile, getUploadUrl } from '~/lib/db/asset.server'
import { userIs } from '~/lib/db/auth.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
import { PresignRequestSchema, PresignResponseSchema } from './schema'

// Presign url for uploading assets, and delete function
export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'PUT' && request.method !== 'DELETE') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    if (!S3) {
        return json<ConventionalError>({
            err: 'Object storage not configured',
        })
    }

    const { user: admin } = await userIs(request, 'ADMIN', '/admin/signin')

    const jsonData = await request.json()

    // Validate delete request data
    if (request.method === 'DELETE') {
        const { key } = jsonData
        if (!key || typeof key !== 'string') {
            return new Response('Bad Request', { status: 400 })
        }

        try {
            // Delete file from ObjectStorage and DB
            await deleteFile(key)
            await prisma.objectStorage.delete({
                where: { key },
            })

            return json<ConventionalSuccess>({
                msg: 'Files deleted successfully',
                options: { preventAlert: true },
            })
        } catch (error) {
            console.log('Error deleting files', error)
            return json<ConventionalError>({
                err: 'Failed to delete files',
            })
        }
    }

    // Validate put request data
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
                const presignedUrl = await getUploadUrl({
                    key: file.id,
                    size: file.size,
                    type: file.type,
                    checksum: file.checksum,
                })
                return {
                    id: file.id,
                    presignedUrl,
                }
            })
        )

        const validatedResponse = PresignResponseSchema.parse({
            urls: presignedUrls,
        })

        // Store file metadata in DB
        await prisma.$transaction(
            fileMetadata.map(file =>
                prisma.objectStorage.create({
                    data: {
                        key: file.id,
                        name: file.name,
                        description: file.description,
                        userId: admin.id,
                        type: file.type,
                        size: file.size,
                    },
                })
            )
        )

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
