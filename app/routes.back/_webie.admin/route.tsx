import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Nav } from '~/components/admin/Nav'
import { ScrollArea } from '~/components/ui/scroll-area'
import { decodedAdminToken } from '~/lib/db/auth.server'
import { getUserById } from '~/lib/db/user.server'

export const meta: MetaFunction = () => {
	return [{ title: 'Admin' }, { name: 'description', content: 'Admin page' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const admin = await decodedAdminToken(request.headers.get('Cookie'))

	const existingUser = await getUserById(admin.id)

	return json({ admin: existingUser.user })
}

export default function Admin() {
	return (
		<div className="flex flex-col sm:flex-row">
			<Nav />

			<main className="grow w-full max-w-full h-auto flex flex-col items-center sm:h-screen sm:overflow-scroll">
				<ScrollArea className="w-full overflow-x-auto">
					<Outlet />
				</ScrollArea>
			</main>
		</div>
	)
}
