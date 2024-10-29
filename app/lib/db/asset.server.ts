/**
 * @see https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
 */
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '~/lib/db/_db.server'

export const getUploadUrl = async ({
    bucket = 'webie',
    key,
    size,
    type,
    checksum,
    Metadata,
}: {
    bucket?: string
    key: string
    size: number
    type: string
    checksum: string
    Metadata?: Record<string, any>
}) => {
    if (!S3) return null

    try {
        // https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity.html
        const presignedUrl = await getSignedUrl(
            S3,
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentLength: size,
                ContentType: type,
                ChecksumSHA256: checksum,
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

export const getDownloadUrl = async (key: string) => {
    if (!S3) return null

    try {
        const presignedUrl = await getSignedUrl(
            S3,
            new GetObjectCommand({
                Bucket: 'webie',
                Key: key,
            }),
            { expiresIn: 300 }
        )
        return presignedUrl
    } catch (error) {
        console.error('Presign url error', error)
        return null
    }
}
