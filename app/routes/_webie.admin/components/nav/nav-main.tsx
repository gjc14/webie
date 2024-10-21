import { NavLink } from '@remix-run/react'
import { ChevronRight, type LucideIcon } from 'lucide-react'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '~/components/ui/sidebar'

export type NavMainItem = {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

export function NavMain({ items }: { items: NavMainItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                    >
                        <SidebarMenuItem>
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
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                )}
                            </NavLink>
                            {item.items?.length ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                            <ChevronRight />
                                            <span className="sr-only">
                                                Toggle
                                            </span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map(subItem => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <NavLink
                                                        to={subItem.url}
                                                        end
                                                    >
                                                        {({ isActive }) => (
                                                            <SidebarMenuSubButton
                                                                className={
                                                                    isActive
                                                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                                        : ''
                                                                }
                                                                asChild
                                                            >
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </SidebarMenuSubButton>
                                                        )}
                                                    </NavLink>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : null}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
