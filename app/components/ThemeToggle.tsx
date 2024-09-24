import { setCustomTheme, useTheme } from '~/lib/hooks/theme-provider'

export function ThemeToggle({ variant, size }: { variant?: 'fancy' | 'normal'; size?: 'sm' }) {
	return (
		<div className="flex items-center justify-center">
			<NormalDarkModeToggle size={size} />
		</div>
	)
}

// NormalDarkModeToggle
import { Moon, Sun } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

const NormalDarkModeToggle = ({ size }: { size?: 'sm' }) => {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={`${size === 'sm' ? 'h-6 w-6' : 'h-9 w-9'} p-1`}>
					<Sun
						className={`${
							size === 'sm' ? 'scale-[.7]' : 'scale-90'
						} absolute rotate-0 w-min h-min  transition-all dark:-rotate-90 dark:scale-0`}
					/>
					<Moon
						className={`${
							size === 'sm' ? 'dark:scale-[.7]' : 'dark:scale-90'
						} absolute w-min h-min rotate-90 scale-0 transition-all dark:rotate-0`}
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
