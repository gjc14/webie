import { ActionFunctionArgs, json } from '@remix-run/node'
import { userIs } from '~/lib/db/auth.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
import { deletePost } from '../lib/db/post.server'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    await userIs(request.headers.get('Cookie'), 'ADMIN', '/admin/signin')

    if (request.method !== 'DELETE') {
        throw new Response('Method not allowd', { status: 405 })
    }

    const postId = params.postId

    if (!postId) {
        throw new Response('Invalid argument', { status: 400 })
    }

    try {
        const { post } = await deletePost(postId)
        return json<ConventionalSuccess>({
            msg: `${post.title} deleted successfully`,
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { err: 'Failed to delete post' },
            { status: 500 }
        )
    }
}
