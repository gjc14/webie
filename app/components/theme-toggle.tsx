import { setCustomTheme, useTheme } from '~/hooks/theme-provider'

export function ThemeToggle({
    size,
    className,
}: {
    size?: 'sm'
    className?: string
}) {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <NormalDarkModeToggle size={size} />
        </div>
    )
}

// NormalDarkModeToggle
import { Moon, Sun } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

const NormalDarkModeToggle = ({ size }: { size?: 'sm' }) => {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={`${
                        size === 'sm' ? 'h-6 w-6' : 'h-9 w-9'
                    } p-1 relative bg-transparent duration-75`}
                >
                    <Sun
                        className={`${
                            size === 'sm' ? 'scale-[.7]' : 'scale-90'
                        } absolute rotate-0 w-min h-min transition-transform dark:-rotate-90 dark:scale-0`}
                    />
                    <Moon
                        className={`${
                            size === 'sm' ? 'dark:scale-[.7]' : 'dark:scale-90'
                        } absolute w-min h-min rotate-90 scale-0 transition-transform dark:rotate-0`}
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
