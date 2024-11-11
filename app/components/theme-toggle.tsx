import { setCustomTheme, useTheme } from '~/hooks/theme-provider'

import { Moon, Sun, SunMoon } from 'lucide-react'
import { forwardRef, ReactNode } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import { Button } from './ui/button'

type ThemeToggleProps = {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
    ({ size = 'sm', className }, ref) => {
        const { setTheme } = useTheme()

        const buttonSizes = {
            sm: 'size-7',
            md: 'size-9',
            lg: 'size-11',
        }

        const iconSizes = {
            sm: 'size-4',
            md: 'size-5',
            lg: 'size-6',
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        size="icon"
                        className={cn(buttonSizes[size], className)}
                    >
                        <Sun
                            className={`${iconSizes[size]} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`}
                        />
                        <Moon
                            className={`absolute ${iconSizes[size]} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`}
                        />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            setTheme('light')
                            setCustomTheme('light')
                        }}
                    >
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setTheme('dark')
                            setCustomTheme('dark')
                        }}
                    >
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setTheme(undefined)
                            setCustomTheme(undefined)
                        }}
                    >
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
)

// DropdownMenu
export const ThemeDropDownMenu = ({
    children,
    asChild = false,
    className,
}: {
    children: ReactNode
    asChild?: boolean
    className?: string
}) => {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={asChild}>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className={cn('bg-secondary', className)}
            >
                <DropdownMenuItem
                    onClick={() => {
                        setTheme('light')
                        setCustomTheme('light')
                    }}
                >
                    <Sun size={16} className="mr-2" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setTheme('dark')
                        setCustomTheme('dark')
                    }}
                >
                    <Moon size={16} className="mr-2" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setTheme(undefined)
                        setCustomTheme(undefined)
                    }}
                >
                    <SunMoon size={16} className="mr-2" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
