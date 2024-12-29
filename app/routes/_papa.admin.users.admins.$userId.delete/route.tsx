import { ActionFunctionArgs } from '@remix-run/node'

import { userIs } from '~/lib/db/auth.server'
import { deleteUser } from '~/lib/db/user.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    await userIs(request, ['ADMIN'])

    if (request.method !== 'DELETE') {
        throw new Response('Method not allowd', { status: 405 })
    }

    const userId = params.userId

    if (!userId) {
        throw new Response('Invalid argument', { status: 400 })
    }

    try {
        const { user } = await deleteUser({ id: userId })
        return {
            msg: `${user.email} deleted successfully`,
        } satisfies ConventionalActionResponse
    } catch (error) {
        console.error(error)
        return {
            err: 'Failed to delete user',
        } satisfies ConventionalActionResponse
    }
}
