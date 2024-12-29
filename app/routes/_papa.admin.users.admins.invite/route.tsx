import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ActionFunctionArgs } from '@remix-run/node'

import { getToken, sendMagicLink } from '~/lib/db/auth.server'
import { createUser } from '~/lib/db/user.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return {
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse
    }

    const formData = await request.formData()
    const email = formData.get('email')

    if (!email || typeof email !== 'string') {
        return { err: 'Invalid email' } satisfies ConventionalActionResponse
    }

    try {
        const { user } = await createUser(email, 'ADMIN', 'INACTIVE')

        const token = await getToken(user.id, user.email)
        await sendMagicLink(token, user.email, new URL(request.url).origin, {
            searchParams: { role: user.role },
        })

        return {
            msg: `Success invite ${email}`,
        } satisfies ConventionalActionResponse
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return {
                    err: 'Email already exists',
                } satisfies ConventionalActionResponse
            }
        } else {
            console.error('Error creating user:', error)
            return {
                err: 'Failed to invite',
            } satisfies ConventionalActionResponse
        }
    }
}
