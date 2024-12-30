import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { LoaderFunctionArgs } from '@remix-run/node'

import { prisma, S3 } from '~/lib/db/_db.server'
import { FileMeta } from '../_papa.admin.api.object-storage/schema'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)

    const objects = await S3?.send(new ListObjectsV2Command({ Bucket: 'papa' }))
    if (!objects || !objects.Contents) return { files: [] as FileMeta[] }

    const { Contents } = objects

    const files = await Promise.all(
        Contents.map(async ({ Key, ETag, StorageClass }) => {
            if (!Key) return null
            const fileMetadata = await prisma.objectStorage.findUnique({
                where: { key: Key },
            })
            if (!fileMetadata) return null
            return {
                ...fileMetadata,
                url: url.origin + `/assets/private?key=${Key}`,
                eTag: ETag,
                storageClass: StorageClass,
            }
        })
    )
    const filteredFiles = files.filter(file => file !== null)

    return {
        files: filteredFiles,
    }
}
