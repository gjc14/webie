import { SerializeFrom } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'

import { getCategories, getTags } from '~/lib/db/blog-taxonomy.server'
import { getPosts } from '~/lib/db/post.server'
import { useAdminContext } from '~/routes/_papa.admin/route'

export const loader = async () => {
    try {
        const { posts } = await getPosts()
        const { tags } = await getTags()
        const { categories } = await getCategories()
        return { posts, tags, categories }
    } catch (error) {
        console.error(error)
        return { posts: [], categories: [], tags: [] }
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
