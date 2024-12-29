import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node'

import { MainWrapper } from '~/components/wrappers'
import { authCookie, getToken, sendMagicLink } from '~/lib/db/auth.server'
import { getUser, getUserById } from '~/lib/db/user.server'
import { SignInForm } from './auth'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const email = formData.get('email')

    if (!email || typeof email !== 'string') {
        throw new Response('Invalid email', { status: 400 })
    }

    const { user: existingUser } = await getUser(email)

    if (
        !existingUser ||
        existingUser.role !== 'ADMIN' ||
        existingUser.status !== 'ACTIVE'
    ) {
        throw new Response('Unauthorized', { status: 401 })
    }

    const token = await getToken(existingUser.id, existingUser.email)
    await sendMagicLink(token, existingUser.email, new URL(request.url).origin)

    return redirect('/admin/magic')
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const cookie = await authCookie.parse(request.headers.get('Cookie'))
    if (cookie && typeof cookie === 'object' && 'id' in cookie) {
        const { user } = await getUserById(cookie.id)
        if (user && user.status === 'ACTIVE' && user.role === 'ADMIN') {
            return redirect('/admin')
        }
    }

    return null
}

export default function AdminAuth() {
    return (
        <MainWrapper className="justify-center">
            <SignInForm />
        </MainWrapper>
    )
}
