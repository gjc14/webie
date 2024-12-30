import { ActionFunctionArgs } from '@remix-run/node'

import { userIs } from '~/lib/db/auth.server'
import { deletePost } from '~/lib/db/post.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    await userIs(request, ['ADMIN'])
    if (request.method !== 'DELETE') {
        throw new Response('Method not allowd', { status: 405 })
    }

    const postId = params.postId

    if (!postId) {
        throw new Response('Invalid argument', { status: 400 })
    }

    try {
        const { post } = await deletePost(postId)
        return Response.json({
            msg: `${post.title} deleted successfully`,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        console.error(error)
        return Response.json({
            err: 'Failed to delete post',
        } satisfies ConventionalActionResponse)
    }
}
