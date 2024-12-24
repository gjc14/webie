import { json, SerializeFrom } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'
import { getUsers } from '~/lib/db/user.server'

export { action } from '~/routes/_papa.admin.users.admins/route'

export const loader = async () => {
    const { users } = await getUsers()

    return json({ users })
}

export default function AdminAllUsers() {
    const context = useLoaderData<typeof loader>()

    return <Outlet context={context} />
}

export const useUsersContext = () => {
    return useOutletContext<SerializeFrom<typeof loader>>()
}
