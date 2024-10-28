/**
 * @see https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
 */
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as getSignedUrlAWS } from '@aws-sdk/s3-request-presigner'
import { S3 } from '~/lib/db/_db.server'

export const getSignedUrl = async ({
    bucket = 'webie',
    key,
}: {
    bucket?: string
    key: string
}) => {
    if (!S3) return null

    try {
        const presignedUrl = await getSignedUrlAWS(
            S3,
            new PutObjectCommand({ Bucket: bucket, Key: key }),
            { expiresIn: 10 }
        )
        return presignedUrl
    } catch (error) {
        console.error('Presign url error', error)
        return null
    }
}
