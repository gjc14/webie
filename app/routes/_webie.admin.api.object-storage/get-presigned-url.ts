/**
 * @see https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
 */
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '~/lib/db/_db.server'

export const getUploadUrl = async ({
    bucket = 'webie',
    key,
    size,
    type,
    Metadata,
}: {
    bucket?: string
    key: string
    size: number
    type: string
    Metadata?: Record<string, any>
}) => {
    if (!S3) return null

    try {
        const presignedUrl = await getSignedUrl(
            S3,
            new PutObjectCommand({
                // TODO: Add checksum
                Bucket: bucket,
                Key: key,
                ContentLength: size,
                ContentType: type,
                Metadata: Metadata,
            }),
            { expiresIn: 300 }
        )
        return presignedUrl
    } catch (error) {
        console.error('Presign url error', error)
        return null
    }
}

export const getDownloadUrl = async ({}) => {
    // TODO: Implement download url and auth
}
