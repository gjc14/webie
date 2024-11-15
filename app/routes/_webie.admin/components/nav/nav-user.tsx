import { Form, Link, useNavigation } from '@remix-run/react'
import {
    BadgeCheck,
    Bell,
    ChevronRight,
    CreditCard,
    LogOut,
    LucideIcon,
    Moon,
    Shield,
    Sparkles,
    Sun,
} from 'lucide-react'

import { FullScreenLoading } from '~/components/loading'
import { ThemeDropDownMenu } from '~/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '~/components/ui/sidebar'

interface NavUserProps {
    user: {
        name: string
        email: string
        avatar: string
    }
}

export const NavUser = ({ user }: NavUserProps) => {
    const { isMobile } = useSidebar()
    const navigation = useNavigation()

    const isSubmitting = navigation.formAction === '/admin/signout'

    return (
        <SidebarMenu>
            {isSubmitting && <FullScreenLoading />}
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    WB
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronRight className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        WB
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <ActionButton
                                icon={Sparkles}
                                title="Upgrade to Pro"
                                route="/admin/account/upgrade"
                            />
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {DefaultUserOptions.map(option => (
                                <ActionButton key={option.title} {...option} />
                            ))}

                            <ThemeDropDownMenu asChild>
                                <DropdownMenuItem
                                    className="group flex items-center gap-2"
                                    onClick={() => {}}
                                >
                                    <div className="relative size-4">
                                        <Sun
                                            size={16}
                                            className="absolute transition-transform group-hover:rotate-[25deg] scale-100 rotate-0 dark:scale-0 dark:rotate-90"
                                        />
                                        <Moon
                                            size={16}
                                            className="absolute transition-transform group-hover:rotate-[25deg] scale-0 rotate-90 dark:scale-100 dark:rotate-0"
                                        />
                                    </div>
                                    <p className="text-sm">Change theme</p>
                                </DropdownMenuItem>
                            </ThemeDropDownMenu>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <Form action="/admin/signout" method="POST">
                            <DropdownMenuItem className="group" asChild>
                                <button className="w-full flex items-center gap-2">
                                    <LogOut
                                        size={16}
                                        className="transition-transform group-hover:translate-x-0.5"
                                    />
                                    <p className="text-sm">Sign Out</p>
                                </button>
                            </DropdownMenuItem>
                        </Form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

const DefaultUserOptions: ActionButtonProps[] = [
    {
        title: 'Account',
        icon: BadgeCheck,
        route: '/admin/account',
    },
    {
        title: 'Security',
        icon: Shield,
        route: '/admin/account/security',
    },
    {
        title: 'Billing',
        icon: CreditCard,
        route: '/admin/account/billing',
    },
    {
        title: 'Notification',
        icon: Bell,
        route: '/admin/account/notification',
    },
]

interface ActionButtonProps {
    icon: LucideIcon
    title: string
    route?: string
}

const ActionButton = (props: ActionButtonProps) => {
    if (props.route) {
        return (
            <Link to={props.route}>
                <DropdownMenuItem className="group flex items-center gap-2">
                    <props.icon
                        size={16}
                        className="transition-transform group-hover:rotate-[25deg]"
                    />
                    <p className="text-sm">{props.title}</p>
                </DropdownMenuItem>
            </Link>
        )
    }
    return (
        <DropdownMenuItem
            className="group flex items-center gap-2"
            onClick={() => alert(props.title + ' not implemented')}
        >
            <props.icon
                size={16}
                className="transition-transform group-hover:rotate-[25deg]"
            />
            <p className="text-sm">{props.title}</p>
        </DropdownMenuItem>
    )
}
