import {
    json,
    LoaderFunctionArgs,
    MetaFunction,
    redirect,
    SerializeFrom,
} from '@remix-run/node'
import {
    Outlet,
    useLoaderData,
    useLocation,
    useOutletContext,
} from '@remix-run/react'

import { Breadcrumb, BreadcrumbList } from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '~/components/ui/sidebar'
import { userIs } from '~/lib/db/auth.server'
import { getUserById } from '~/lib/db/user.server'
import { generateBreadcrumbs } from '~/lib/utils'
import { AppSidebar } from '~/routes/_webie.admin/components/admin-sidebar'
import { getPluginConfigs } from '~/routes/plugins/utils/get-plugin-configs.server'

export const meta: MetaFunction = () => {
    return [{ title: 'Admin' }, { name: 'description', content: 'Admin page' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    const existingUser = await getUserById(admin.id)
    if (!existingUser || !existingUser.user) {
        throw redirect('/admin/signin')
    }

    const pluginConfigs = await getPluginConfigs()
    const pluginRoutes = pluginConfigs
        .flatMap(config => config.adminRoutes)
        .filter(routeItem => !!routeItem)

    return json({
        admin: existingUser.user,
        pluginRoutes: pluginRoutes,
    })
}

export default function Admin() {
    const { admin, pluginRoutes } = useLoaderData<typeof loader>()
    const location = useLocation()
    const breadcrumbPaths = generateBreadcrumbs(location.pathname)

    return (
        <SidebarProvider>
            <AppSidebar
                pluginRoutes={pluginRoutes}
                user={{
                    name: admin.name ?? 'webie-pro',
                    email: admin.email,
                    avatar: admin.imageUri ?? '/placeholders/avatar.png',
                }}
            />
            <SidebarInset className="h-[calc(100svh-theme(spacing.4))]">
                <header className="flex my-3 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>{breadcrumbPaths}</BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}

export const useAdminContext = () => {
    return useOutletContext<SerializeFrom<typeof loader>>()
}
