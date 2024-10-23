import { NavLink, useLocation } from '@remix-run/react'
import { ChevronRight } from 'lucide-react'

import Icon from '~/components/dynamic-icon'
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
import { type WebieAdminMenuItem } from '~/routes/plugins/utils/get-plugin-configs.server'

export function NavMain({ items }: { items: WebieAdminMenuItem[] }) {
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => {
                    const isActive =
                        currentPath.endsWith(item.url) ||
                        item.sub?.some(subItem =>
                            currentPath.endsWith(`${item.url}/${subItem.url}`)
                        )

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isActive}
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
                                            <Icon name={item.iconName} />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    )}
                                </NavLink>
                                {item.sub?.length ? (
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
                                                {item.sub?.map(subItem => (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <NavLink
                                                            to={
                                                                item.url +
                                                                '/' +
                                                                subItem.url
                                                            }
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
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
