import { Form, NavLink, useNavigation } from '@remix-run/react'
import { motion } from 'framer-motion'
import {
    ChevronLeft,
    Eye,
    LayoutDashboard,
    LogOut,
    TextSearch,
    User2,
    UserRoundCog,
} from 'lucide-react'
import { useState } from 'react'

import Icon from '~/components/dynamic-icon'
import { FullScreenLoading } from '~/components/loading'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import { WebieConfig } from '~/lib/webie/get-plugin-configs.server'

const NavOptions: Omit<NavButtonProps, 'desktopShrink'>[] = [
    { Icon: <TextSearch size={18} />, label: 'SEO', to: '/admin/seo' },
    { Icon: <User2 size={18} />, label: 'Users', to: '/admin/users' },
    { Icon: <UserRoundCog size={18} />, label: 'Admin', to: '/admin/admins' },
]

export const NavContent = ({
    className,
    isDesktop,
    onClick,
    pluginRoutes,
}: {
    className?: string
    isDesktop: boolean
    onClick?: () => void
    pluginRoutes: WebieConfig['adminRoutes']
}) => {
    const navigation = useNavigation()
    const [open, setOpen] = useState(!isDesktop)
    const desktopShrink = isDesktop && !open

    const isSubmitting = navigation.formAction === '/admin/signout'

    return (
        <nav
            className={cn(
                `${
                    desktopShrink ? 'w-[calc(auto)]' : 'w-56'
                } relative z-10 shrink-0 ease-out transition-all duration-1000`,
                className
            )}
        >
            {isSubmitting && <FullScreenLoading />}
            <aside className="h-screen w-full flex flex-col top-0 left-0 z-10 py-5 px-3 border-r overflow-y-scroll">
                <Button
                    variant={'outline'}
                    className="absolute -right-2.5 w-fit h-auto px-0.5 py-1"
                    onClick={() => setOpen(!open)}
                >
                    <ChevronLeft
                        size={16}
                        className={`transition-transform ${
                            open ? '' : 'rotate-180'
                        }`}
                    />
                </Button>

                <div className="ml-2.5 flex justify-between items-center">
                    <NavLink to="/admin" className="w-fit">
                        <LayoutDashboard />
                    </NavLink>
                </div>

                <ul className="space-y-2 my-6">
                    <NavButton
                        Icon={<Eye size={18} />}
                        label="Website"
                        to="/"
                        onClick={onClick}
                        desktopShrink={desktopShrink}
                    />

                    <Separator />

                    {NavOptions.map((option, index) => (
                        <NavButton
                            key={index}
                            {...option}
                            onClick={onClick}
                            desktopShrink={desktopShrink}
                        />
                    ))}

                    <Separator />

                    {!desktopShrink ? (
                        <li className="p-1 text-xs text-muted-foreground">
                            You have no plugins
                        </li>
                    ) : (
                        pluginRoutes.map((route, index) => (
                            <NavButton
                                key={index}
                                Icon={<Icon name={route.iconName} size={18} />}
                                label={route.label}
                                to={route.to}
                                onClick={onClick}
                                desktopShrink={desktopShrink}
                            />
                        ))
                    )}
                </ul>

                <div
                    className={`mt-auto flex justify-between items-center ${
                        desktopShrink ? 'flex-col-reverse gap-5' : ''
                    }`}
                >
                    <Form
                        action="/admin/signout"
                        method="POST"
                        className="group mx-2 flex flex-col items-start gap-5"
                    >
                        <button className="flex items-center gap-2">
                            <LogOut
                                size={desktopShrink ? 20 : 16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                            {!desktopShrink && (
                                <p className="text-sm">Sign Out</p>
                            )}
                        </button>
                    </Form>
                    <ThemeToggle className="scale-90" />
                </div>
            </aside>
        </nav>
    )
}

type NavButtonProps = {
    Icon: JSX.Element
    label: string
    to: string
    onClick?: () => void
    desktopShrink: boolean
}

export const NavButton = (props: NavButtonProps) => {
    const { Icon, label, to, onClick, desktopShrink } = props

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <li className="w-full">
                        <NavLink
                            onClick={onClick}
                            to={to}
                            className={({ isActive }) =>
                                `group flex h-auto items-center justify-start py-2.5 px-2 gap-2
                    rounded-lg transition-colors hover:bg-accent hover:text-foreground sm:py-1.5
                    ${desktopShrink ? 'w-fit' : 'w-full'}
                    ${
                        isActive
                            ? 'bg-accent text-foreground '
                            : 'text-muted-foreground'
                    }
                `
                            }
                        >
                            <span className="p-1 group-hover:rotate-12">
                                {Icon}
                            </span>
                            {!desktopShrink && (
                                <motion.p
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {label}
                                </motion.p>
                            )}
                        </NavLink>
                    </li>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
