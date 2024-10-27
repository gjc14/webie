import { Link } from '@remix-run/react'
import { Command, LifeBuoy, Send } from 'lucide-react'
import * as React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '~/components/ui/sidebar'
import { NavMain } from '~/routes/_webie.admin/components/nav/nav-main'
import { NavPlugins } from '~/routes/_webie.admin/components/nav/nav-plugins'
import {
    NavSecondary,
    NavSecondaryItem,
} from '~/routes/_webie.admin/components/nav/nav-secondary'
import { NavUser } from '~/routes/_webie.admin/components/nav/nav-user'
import { WebieAdminMenuItem } from '~/routes/plugins/utils/get-plugin-configs.server'

const MainNavItems: WebieAdminMenuItem[] = [
    {
        iconName: 'user-round',
        title: 'Users',
        url: '/admin/users',
        sub: [{ title: 'Admin', url: 'admins' }],
    },
    { iconName: 'text-search', title: 'SEO', url: '/admin/seo' },
    { iconName: 'database', title: 'Assets', url: '/admin/assets' },
]

const SecondaryNavItems: NavSecondaryItem[] = [
    {
        title: 'Support',
        action: () => {
            alert('Support')
        },
        icon: LifeBuoy,
    },
    {
        title: 'Feedback',
        action: () => {
            alert('Feedback')
        },
        icon: Send,
    },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    pluginRoutes: WebieAdminMenuItem[]
    user: {
        name: string
        email: string
        avatar: string
    }
}

export function AppSidebar({ pluginRoutes, user, ...props }: AppSidebarProps) {
    return (
        // TODO: Close sidebar on click menu button
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Webie
                                    </span>
                                    <span className="truncate text-xs">
                                        Startup
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={MainNavItems} />
                <NavPlugins plugins={pluginRoutes} />
                <NavSecondary items={SecondaryNavItems} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}
