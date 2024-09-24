import '~/tailwind.css'

import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { Settings } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { authCookie } from '~/lib/db/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const cookieString = request.headers.get('Cookie')
	if (!cookieString) return json({ user: null })

	const cookie = await authCookie.parse(cookieString)
	if (cookie) {
		return json({ user: cookie })
	} else {
		return json({ user: null })
	}
}

export default function WebFront() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<>
			{user && (
				<Link to={'/admin'}>
					<Button
						variant="ghost"
						size={'icon'}
						className="fixed right-1 bottom-1"
						aria-label="go to admin page"
					>
						<Settings />
					</Button>
				</Link>
			)}
			<Outlet />
		</>
	)
}
