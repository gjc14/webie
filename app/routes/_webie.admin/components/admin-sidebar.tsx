import { Link } from '@remix-run/react'
import { Command, LifeBuoy, Send, TextSearch, UserRound } from 'lucide-react'
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
import {
    NavMain,
    NavMainItem,
} from '~/routes/_webie.admin/components/nav/nav-main'
import {
    NavPlugins,
    NavPluginsItem,
} from '~/routes/_webie.admin/components/nav/nav-plugins'
import {
    NavSecondary,
    NavSecondaryItem,
} from '~/routes/_webie.admin/components/nav/nav-secondary'
import { NavUser } from '~/routes/_webie.admin/components/nav/nav-user'

const MainNavItems: NavMainItem[] = [
    {
        icon: UserRound,
        title: 'Users',
        url: '/admin/users',
        items: [{ title: 'Admin', url: '/admin/admins' }],
    },
    { icon: TextSearch, title: 'SEO', url: '/admin/seo' },
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
    pluginRoutes: NavPluginsItem[]
    user: {
        name: string
        email: string
        avatar: string
    }
}

export function AppSidebar({ pluginRoutes, user, ...props }: AppSidebarProps) {
    return (
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
