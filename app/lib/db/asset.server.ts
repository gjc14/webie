/**
 * @see https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
 */
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '~/lib/db/_db.server'

export const getUploadUrl = async ({
    bucket = 'webie',
    key,
    size,
    type,
    checksum,
    metadata,
}: {
    bucket?: string
    key: string
    size: number
    type: string
    checksum: string
    metadata?: Record<string, any>
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
                Metadata: metadata,
            }),
            { expiresIn: 300 }
        )
        return presignedUrl
    } catch (error) {
        console.error('Presign url error', error)
        return null
    }
}

export const getFileUrl = async (key: string) => {
    if (!S3) return null

    try {
        const command = new GetObjectCommand({
            Bucket: 'webie',
            Key: key,
        })
        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 300 })
        return presignedUrl
    } catch (error) {
        console.error('Presign url error', error)
        return null
    }
}

/**
 * Please handle the error in the caller function
 * @param key
 * @returns void
 */
export const deleteFile = async (key: string) => {
    if (!S3) return null

    await S3.send(
        new DeleteObjectCommand({
            Bucket: 'webie',
            Key: key,
        })
    )
}
