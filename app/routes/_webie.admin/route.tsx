import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { ScrollArea } from '~/components/ui/scroll-area'
import { userIs } from '~/lib/db/auth.server'
import { getUserById } from '~/lib/db/user.server'
import { Nav } from '~/routes/_webie.admin/components/nav'
import { getPluginConfigs } from '~/routes/plugins/utils/get-plugin-configs.server'

export const meta: MetaFunction = () => {
    return [{ title: 'Admin' }, { name: 'description', content: 'Admin page' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const admin = await userIs(
        request.headers.get('Cookie'),
        'ADMIN',
        '/admin/signin'
    )

    const existingUser = await getUserById(admin.id)

    const pluginConfigs = await getPluginConfigs()
    const pluginRoutes = pluginConfigs
        .flatMap(config => config.adminRoutes)
        .filter(route => !!route)

    return json({ admin: existingUser.user, pluginRoutes: pluginRoutes })
}

export default function Admin() {
    const { pluginRoutes } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col sm:flex-row">
            <Nav pluginRoutes={pluginRoutes} />

            <main className="grow w-full max-w-full h-auto flex flex-col items-center sm:h-screen sm:overflow-scroll">
                <ScrollArea className="w-full overflow-x-auto">
                    <Outlet />
                </ScrollArea>
            </main>
        </div>
    )
}
