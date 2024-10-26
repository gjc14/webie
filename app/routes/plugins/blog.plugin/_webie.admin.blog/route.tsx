import { json, SerializeFrom } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'

import { useAdminContext } from '~/routes/_webie.admin/route'
import { getCategories, getTags } from '../lib/db/blog-taxonomy.server'
import { getPosts } from '../lib/db/post.server'

export const loader = async () => {
    try {
        const { posts } = await getPosts()
        const { tags } = await getTags()
        const { categories } = await getCategories()
        return json({ posts, tags, categories })
    } catch (error) {
        console.error(error)
        return json({ posts: [], categories: [], tags: [] })
    }
}

export type SerializedPost = SerializeFrom<typeof loader>

export default function AdminBlog() {
    const loaderDate = useLoaderData<typeof loader>()
    const adminContext = useAdminContext()

    return <Outlet context={{ ...loaderDate, ...adminContext }} />
}

export const useAdminBlogContext = () => {
    return useOutletContext<SerializedPost>()
}
