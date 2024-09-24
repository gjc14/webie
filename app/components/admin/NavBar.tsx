import { Form, NavLink, useNavigation } from '@remix-run/react'
import {
	ArrowLeftFromLine,
	LayoutDashboard,
	LogOut,
	Menu,
	PenBoxIcon,
	Tag,
	TextSearch,
	User2,
	UserRoundCog,
} from 'lucide-react'
import { useState } from 'react'
import { FullScreenLoading } from '~/components/Loading'
import { ThemeToggle } from '~/components/ThemeToggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { cn } from '~/lib/utils'

export const NavBar = () => {
	const [open, setOpen] = useState(false)

	return (
		<>
			{/* Desktop */}
			<NavContent className="hidden sm:block" />

			{/* Mobile */}
			<header className="h-fit w-full flex items-center gap-3 px-3 py-2.5 border-b sm:hidden">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant={'outline'} size={'icon'}>
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent side={'left'} className="w-full p-0 m-0 border-0 sm:hidden">
						<SheetTitle></SheetTitle>
						<SheetDescription></SheetDescription>
						<NavContent className="w-full" setOpen={setOpen} />
					</SheetContent>
				</Sheet>
			</header>
		</>
	)
}

const NavContent = ({
	className,
	setOpen,
}: {
	className?: string
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const navigation = useNavigation()

	const isSubmitting = navigation.formAction === '/admin/signout'

	return (
		<nav className={cn('w-52', className)}>
			{isSubmitting && <FullScreenLoading />}
			<aside className="h-screen w-full flex flex-col top-0 left-0 z-10 py-5 px-3 border-r">
				<div className="mx-2.5 flex justify-between items-center">
					<NavLink to="/admin" className="w-fit">
						<LayoutDashboard />
					</NavLink>
					<ThemeToggle />
				</div>

				<ul className="space-y-3 my-6">
					<li className="w-full">
						<NavLink
							onClick={() => setOpen && setOpen(false)}
							to="/"
							className="flex h-fit w-full items-center justify-start px-2.5 py-2.5 gap-2 rounded-lg transition-colors hover:text-foreground sm:py-1.5 text-muted-foreground "
						>
							<ArrowLeftFromLine size={18} />
							<p>Website</p>
						</NavLink>
					</li>

					<Separator />

					<li className="w-full">
						<NavLink
							onClick={() => setOpen && setOpen(false)}
							to="/admin/posts"
							className={({ isActive }) =>
								'flex h-fit w-full items-center justify-start px-2.5 py-2.5 gap-2 rounded-lg transition-colors hover:text-foreground sm:py-1.5 ' +
								(isActive ? 'bg-accent text-foreground ' : 'text-muted-foreground')
							}
						>
							<PenBoxIcon size={18} />
							<p>Posts</p>
						</NavLink>
					</li>
					<li className="w-full">
						<NavLink
							onClick={() => setOpen && setOpen(false)}
							to="/admin/users"
							className={({ isActive }) =>
								'flex h-fit w-full items-center justify-start px-2.5 py-2.5 gap-2 rounded-lg transition-colors hover:text-foreground sm:py-1.5 ' +
								(isActive ? 'bg-accent text-foreground ' : 'text-muted-foreground')
							}
						>
							<User2 size={18} />
							<p>Users</p>
						</NavLink>
					</li>
					<li className="w-full">
						<NavLink
							onClick={() => setOpen && setOpen(false)}
							to="/admin/seo"
							className={({ isActive }) =>
								'flex h-fit w-full items-center justify-start px-2.5 py-2.5 gap-2 rounded-lg transition-colors hover:text-foreground sm:py-1.5 ' +
								(isActive ? 'bg-accent text-foreground ' : 'text-muted-foreground')
							}
						>
							<TextSearch size={18} />
							<p>SEO</p>
						</NavLink>
					</li>
					<li className="w-full">
						<NavLink
							onClick={() => setOpen && setOpen(false)}
							to="/admin/admins"
							className={({ isActive }) =>
								'flex h-fit w-full items-center justify-start px-2.5 py-2.5 gap-2 rounded-lg transition-colors hover:text-foreground sm:py-1.5 ' +
								(isActive ? 'bg-accent text-foreground ' : 'text-muted-foreground')
							}
						>
							<UserRoundCog size={18} />
							<p>Admin</p>
						</NavLink>
					</li>
					<li className="w-full">
						<NavLink
							onClick={() => setOpen && setOpen(false)}
							to="/admin/taxonomy"
							className={({ isActive }) =>
								'flex h-fit w-full items-center justify-start px-2.5 py-2.5 gap-2 rounded-lg transition-colors hover:text-foreground sm:py-1.5 ' +
								(isActive ? 'bg-accent text-foreground ' : 'text-muted-foreground')
							}
						>
							<Tag size={18} />
							<p>Taxonomies</p>
						</NavLink>
					</li>
					<Separator />
					<li className="p-1 text-xs text-muted-foreground">You have no plugins</li>
				</ul>

				<Form action="/admin/signout" method="POST" className="mt-auto mx-2 flex flex-col items-start gap-5">
					<button className="flex items-center gap-1.5">
						<LogOut size={16} />
						<p className="text-sm">Sign Out</p>
					</button>
				</Form>
			</aside>
		</nav>
	)
}
