import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Nav } from '~/components/web/Nav'
import { Footer } from '~/components/web/Footer'
import { CTA } from '~/components/web/CTA'
import { getSEO } from '~/lib/db/seo.server'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return data?.seo ? [{ title: data.seo.title }, { name: 'description', content: data.seo.description }] : []
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)

	try {
		return json({ seo })
	} catch (error) {
		console.error(error)
		return json({ seo })
	}
}

export default function Blog() {
	const { seo } = useLoaderData<typeof loader>()
	return (
		<>
			<Nav />
			<main className="w-full h-full min-h-screen flex flex-col items-center">
				<Outlet />
				<CTA />
				<Footer />
			</main>
		</>
	)
}
