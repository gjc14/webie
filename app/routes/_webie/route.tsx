import '~/tailwind.css'

import {
	isRouteErrorResponse,
	Link,
	Outlet,
	useRouteError,
} from '@remix-run/react'
import { Undo2 } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function WebBack() {
	return <Outlet />
}

export function ErrorBoundary() {
	const error = useRouteError()

	// throw new Response()
	if (isRouteErrorResponse(error)) {
		console.error('Error response:', error.data)
		return (
			<main className="w-screen h-screen flex flex-col items-center justify-center">
				<div className="fixed flex items-center">
					<h1 className="inline-block mr-5 pr-5 text-3xl font-normal border-r">
						{error.status}
					</h1>
					<Link
						to={'/admin'}
						className="flex items-center space-x-2 text-base font-light"
					>
						<h2 className="text-base font-light">
							{error.statusText}
						</h2>
						<Undo2 size={16} />
					</Link>
				</div>

				<div className="fixed bottom-8 flex items-center font-open-sans">
					<p className="inline-block mr-3 pr-5 text-lg font-normal border-r">
						mimiu.fyi
					</p>
					<div className="inline-block">
						<p className="text-xs font-light">
							© 2024 CHIU YIN CHEN @Taipei
						</p>
					</div>
				</div>
			</main>
		)
	} else if (error instanceof Error) {
		// throw new Error('message')
		return (
			<main className="w-full min-h-screen h-auto flex flex-col items-center justify-center gap-9">
				<div>
					<h1 className="w-full text-center text-3xl font-semibold">
						500
					</h1>
					<p>Internal Error</p>
				</div>
				<div>
					<Link to={'/admin'}>
						<Button
							variant={'outline'}
							className="underline underline-offset-2"
						>
							Let's go back to safe place
						</Button>
					</Link>
				</div>
			</main>
		)
	}

	return (
		<main className="w-full min-h-screen h-auto flex flex-col items-center justify-center gap-9">
			<div>
				<h1 className="w-full text-center text-3xl font-semibold">
					Unknown Error
				</h1>
			</div>
			<div>
				<Link to={'/admin'}>
					<Button
						variant={'outline'}
						className="underline underline-offset-2"
					>
						Let's go back to safe place
					</Button>
				</Link>
			</div>
		</main>
	)
}
