import { ActionFunctionArgs, json } from '@remix-run/node'
import { userIs } from '~/lib/db/auth.server'
import { deleteUser } from '~/lib/db/user.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    await userIs(request.headers.get('Cookie'), 'ADMIN', '/admin/signin')

    if (request.method !== 'DELETE') {
        throw new Response('Method not allowd', { status: 405 })
    }

    const userId = params.userId

    if (!userId) {
        throw new Response('Invalid argument', { status: 400 })
    }

    try {
        const { user } = await deleteUser({ id: userId })
        return json<ConventionalSuccess>({
            msg: `${user.email} deleted successfully`,
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { err: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
