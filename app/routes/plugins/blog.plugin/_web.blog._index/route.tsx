import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getSEO } from '~/lib/db/seo.server'
import { SectionWrapper } from '../_web.blog/components/max-width-wrapper'
import { PostCollection } from '../_web.blog/components/posts'
import { getPosts } from '../lib/db/post.server'

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

    try {
        const { posts } = await getPosts({ status: 'PUBLISHED' })
        return json({ seo, posts })
    } catch (error) {
        console.error(error)
        return json({ seo, posts: [] })
    }
}

export default function Index() {
    const { seo, posts } = useLoaderData<typeof loader>()

    return (
        <>
            <h1 className="visually-hidden">{seo?.title}</h1>
            <SectionWrapper className="mt-28">
                <PostCollection
                    title="All posts"
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
