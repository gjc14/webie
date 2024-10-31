/**
 * Proxy requests to the presigned URL of the asset
 */
import { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/react'
import { getFileUrl } from '~/lib/db/asset.server'

// Usage: webie.dev/assets/my-file-key?visibility=public
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { searchParams } = new URL(request.url)

    const visibility = params.visibility
    const key = searchParams.get('key')

    if (!key || !visibility) {
        console.log('Key or visibility not found', key, visibility)
        return json(null)
    }

    if (visibility !== 'public') {
        // Handle the case where the file is private
    }

    const presignedUrl = await getFileUrl(key)

    if (!presignedUrl) {
        return json(null)
    }

    const response = await fetch(presignedUrl)

    // Proxy the request to the presigned URL
    return response
}
