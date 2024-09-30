import { ActionFunctionArgs, json } from '@remix-run/node'
import { decodedAdminToken } from '~/lib/db/auth.server'
import { deleteUser } from '~/lib/db/user.server'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    await decodedAdminToken(request.headers.get('Cookie'))

    if (request.method !== 'DELETE') {
        throw new Response('Method not allowd', { status: 405 })
    }

    const userId = params.userId

    if (!userId) {
        throw new Response('Invalid argument', { status: 400 })
    }

    try {
        const { user } = await deleteUser({ id: userId })
        return json({ msg: `${user.email} deleted successfully` })
    } catch (error) {
        console.error(error)
        return json({ err: 'Failed to delete user' }, { status: 500 })
    }
}
