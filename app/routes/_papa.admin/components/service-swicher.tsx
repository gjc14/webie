import { Link, useLocation } from '@remix-run/react'
import { ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '~/components/ui/sidebar'

export interface ServiceSwicherProps {
    services: {
        name: string
        logo: React.ElementType
        plan: string
        url: string
    }[]
}

export function ServiceSwicher({ services }: ServiceSwicherProps) {
    const currentUrl = useLocation().pathname
    const currentActiveService = services.find(service => {
        return service.url !== '/admin' && !!currentUrl.startsWith(service.url)
    })
    const { isMobile } = useSidebar()
    const [activeService, setActiveService] = useState(
        currentActiveService || services[0]
    )

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <activeService.logo className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeService.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeService.plan}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Services
                        </DropdownMenuLabel>
                        {services.map(service => (
                            <Link key={service.name} to={service.url}>
                                <DropdownMenuItem
                                    onClick={() => setActiveService(service)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        <service.logo className="size-4 shrink-0" />
                                    </div>
                                    {service.name}
                                    {/* <DropdownMenuShortcut>
                                    ⌘{index + 1}
                                </DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                Add service
                            </div>
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
