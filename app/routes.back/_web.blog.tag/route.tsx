import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Footer } from '~/components/web/Footer'
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

export default function Tag() {
	const { seo } = useLoaderData<typeof loader>()

	return (
		<section className="w-full h-full flex flex-col">
			<div className="flex flex-col items-center justify-center grow">
				<h1 className="visually-hidden">{seo?.title}</h1>
				<img src="/placeholders/20101.svg" alt="busy working on the page" className="mb-4" />
				<h3>Under construction</h3>
				<p>This is tag page</p>
			</div>
			<Footer />
		</section>
	)
}
