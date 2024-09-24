import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { SectionWrapper } from '~/components/web/blog/max-width-wrapper'
import { PostCollection } from '~/components/web/blog/posts'
import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return data?.seo ? [{ title: data.seo.title }, { name: 'description', content: data.seo.description }] : []
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	let { searchParams } = new URL(request.url)
	let query = searchParams.getAll('q')
	query = query.filter(q => q !== '')

	try {
		const { posts } = await getPosts({ status: 'PUBLISHED', tagFilter: query })
		return json({ seo, posts, query })
	} catch (error) {
		console.error(error)
		return json({ seo, posts: [], query })
	}
}

export default function Tag() {
	const { seo, posts, query } = useLoaderData<typeof loader>()

	return (
		<>
			<h1 className="visually-hidden">{seo?.title}</h1>
			<SectionWrapper className="mt-28">
				<PostCollection
					title={`Looking for ${query.length === 0 ? 'all posts' : query.join(', ')}`}
					posts={posts.map(post => {
						return { ...post, createdAt: new Date(post.createdAt), updatedAt: new Date(post.updatedAt) }
					})}
				/>
			</SectionWrapper>
		</>
	)
}
