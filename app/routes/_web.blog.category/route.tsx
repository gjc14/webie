import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { SectionWrapper } from '~/components/web/blog/max-width-wrapper'
import { PostCollection } from '~/components/web/blog/posts'
import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return data?.seo
		? [
				{ title: data.seo.title },
				{ name: 'description', content: data.seo.description },
		  ]
		: []
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	let { searchParams } = new URL(request.url)
	let query = searchParams.getAll('q')
	query = query.filter(q => q !== '')
	let subCatequery = searchParams.getAll('sub')
	subCatequery = subCatequery.filter(q => q !== '')

	try {
		const { posts } = await getPosts({
			status: 'PUBLISHED',
			categoryFilter: query,
			subCategoryFilter: subCatequery,
		})
		return json({ seo, posts, query, subCatequery })
	} catch (error) {
		console.error(error)
		return json({ seo, posts: [], query, subCatequery })
	}
}

export default function Category() {
	const { seo, posts, query, subCatequery } = useLoaderData<typeof loader>()

	return (
		<>
			<h1 className="visually-hidden">{seo?.title}</h1>
			<SectionWrapper className="mt-28">
				<PostCollection
					title={`Listing ${
						query.length !== 0
							? (subCatequery.length !== 0
									? `${subCatequery} in`
									: '') +
							  ' ' +
							  query.join(', ')
							: subCatequery.length !== 0
							? subCatequery.join(', ')
							: 'all posts'
					}`}
					posts={posts.map(post => {
						return {
							...post,
							createdAt: new Date(post.createdAt),
							updatedAt: new Date(post.updatedAt),
						}
					})}
				/>
			</SectionWrapper>
		</>
	)
}
