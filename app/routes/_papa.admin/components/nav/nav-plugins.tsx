import { NavLink, useLocation } from '@remix-run/react'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

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
import { PapaAdminMenuItem } from '~/routes/plugins/utils/get-plugin-configs.server'

export function NavPlugins({ plugins }: { plugins: PapaAdminMenuItem[] }) {
    const location = useLocation()
    const currentPath = location.pathname

    const checkActive = (item: PapaAdminMenuItem) => {
        return (
            currentPath.endsWith(item.url) ||
            item.sub?.some(subItem =>
                currentPath.endsWith(`${item.url}${subItem.url}`)
            )
        )
    }

    if (plugins.length <= 0) {
        return (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>You have no plugin</SidebarGroupLabel>
            </SidebarGroup>
        )
    }
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Plugins</SidebarGroupLabel>
            <SidebarMenu>
                {plugins.map(item => {
                    const [isActive, setIsActive] = useState(checkActive(item))

                    useEffect(() => {
                        setIsActive(checkActive(item))
                    }, [currentPath])

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={isActive}
                            onOpenChange={setIsActive}
                        >
                            <SidebarMenuItem>
                                <NavLink to={'/admin' + item.url} end>
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
                                                                '/admin' +
                                                                item.url +
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
