import {
    json,
    LoaderFunctionArgs,
    SerializeFrom,
    type MetaFunction,
} from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { SectionWrapper } from '../components/max-width-wrapper'
import { PostCollection } from '../components/posts'

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

let cache: SerializeFrom<typeof loader>
export const clientLoader = async ({
    serverLoader,
}: ClientLoaderFunctionArgs) => {
    if (cache) {
        return cache
    }

    cache = await serverLoader()
    return cache
}

clientLoader.hydrate = true

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
