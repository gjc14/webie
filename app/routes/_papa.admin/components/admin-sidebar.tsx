import { Building, Command, Database, LifeBuoy, Send } from 'lucide-react'
import * as React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '~/components/ui/sidebar'
import { NavMain } from '~/routes/_papa.admin/components/nav/nav-main'
import { NavPlugins } from '~/routes/_papa.admin/components/nav/nav-plugins'
import {
    NavSecondary,
    NavSecondaryItem,
} from '~/routes/_papa.admin/components/nav/nav-secondary'
import { NavUser } from '~/routes/_papa.admin/components/nav/nav-user'
import { PapaAdminMenuItem } from '~/routes/plugins/utils/get-plugin-configs.server'
import { ServiceSwicher, ServiceSwicherProps } from './service-swicher'

const services: ServiceSwicherProps['services'] = [
    {
        name: 'Papa CMS',
        logo: () => <Command className="size-4" />,
        plan: 'Startup',
        url: '/admin',
    },
    {
        name: 'Papa DB',
        logo: Database,
        plan: 'Startup',
        url: '/admin/database',
    },
]

const MainNavItems: PapaAdminMenuItem[] = [
    {
        iconName: 'user-round',
        title: 'Users',
        url: '/admin/users',
        sub: [{ title: 'Admin', url: 'admins' }],
    },
    {
        iconName: 'pen',
        title: 'Blog',
        url: '/admin/blog',
        sub: [
            { title: 'Taxonomies', url: 'taxonomy' },
            { title: 'Generative AI', url: 'generative' },
        ],
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
    {
        title: 'Company',
        url: '/admin/company',
        icon: Building,
    },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    pluginRoutes: PapaAdminMenuItem[]
    user: {
        name: string
        email: string
        avatar: string
    }
}

export function AdminSidebar({
    user,
    pluginRoutes,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <ServiceSwicher services={services} />
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
