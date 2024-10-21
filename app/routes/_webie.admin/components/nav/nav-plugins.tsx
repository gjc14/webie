import { NavLink } from '@remix-run/react'
import { type LucideIcon } from 'lucide-react'

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '~/components/ui/sidebar'

export type NavPluginsItem =
    | {
          title: string
          url: string
          lucideIcon: LucideIcon
          jsxIcon?: never
      }
    | {
          title: string
          url: string
          lucideIcon?: never
          jsxIcon: JSX.Element
      }

export function NavPlugins({ plugins }: { plugins: NavPluginsItem[] }) {
    if (plugins.length <= 0)
        return (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>You have no plugin</SidebarGroupLabel>
            </SidebarGroup>
        )
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Plugins</SidebarGroupLabel>
            <SidebarMenu>
                {plugins.map(item => (
                    <SidebarMenuItem key={item.title}>
                        <NavLink to={item.url} end>
                            {({ isActive }) => (
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    className={
                                        isActive
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                            : ''
                                    }
                                >
                                    {item.lucideIcon ? (
                                        <item.lucideIcon />
                                    ) : (
                                        item.jsxIcon
                                    )}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            )}
                        </NavLink>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
