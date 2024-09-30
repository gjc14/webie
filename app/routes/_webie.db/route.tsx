import '~/tailwind.css'
import './db.css'

import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { decodedAdminToken } from '~/lib/db/auth.server'
import { getUserById } from '~/lib/db/user.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // const admin = await decodedAdminToken(request.headers.get('Cookie'))

    // const existingUser = await getUserById(admin.id)

    // return json({ admin: existingUser.user })
    return null
}

export default function DbRoute() {
    return (
        <>
            <nav></nav>
            <main className="h-screen">
                <Outlet />
                <footer></footer>
            </main>
        </>
    )
}
