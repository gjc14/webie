import { Post } from '@prisma/client'
import { Link } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { DataTable } from '~/components/web/blog/post-data-table'
import { Input } from '~/components/ui/input'

export type DisplayPost = Post & {
    author: { email: string; name: string | null }
} & {
    seo: { title: string | null; description: string | null }
}

export const LatestPosts = ({ posts }: { posts: DisplayPost[] }) => {
    return (
        <div
            id="latest-post"
            className="mx-auto max-w-5xl px-5 py-8 text-primary md:px-9"
        >
            <div className="flex flex-wrap justify-between items-end mb-12 gap-5">
                <motion.h2
                    initial={{ y: 48, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="text-4xl font-black uppercase text-primary"
                >
                    Latest Posts
                </motion.h2>
                <Link to={'/blog'} aria-label="link to blog">
                    <motion.button
                        initial={{ y: 48, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ ease: 'easeInOut', duration: 0.5 }}
                        className="flex items-center gap-1.5 underline-offset-4 cursor-pointer hover:underline"
                    >
                        See more posts
                        <ExternalLink size={16} />
                    </motion.button>
                </Link>
            </div>

            <Posts posts={posts} hidePagination hideSearch />
        </div>
    )
}

export const PostCollection = ({
    title,
    posts,
}: {
    title: string
    posts: DisplayPost[]
}) => {
    return (
        <div
            id="category-post"
            className="mx-auto max-w-5xl px-5 py-8 text-primary md:px-9"
        >
            <div className="flex flex-wrap justify-between items-end mb-12 gap-5">
                <motion.h2
                    initial={{ y: 48, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="text-4xl font-black uppercase text-primary"
                >
                    {title}
                </motion.h2>
            </div>

            <Posts posts={posts} />
        </div>
    )
}

const Posts = ({
    posts,
    hidePagination,
    hideSearch,
}: {
    posts: DisplayPost[]
    hidePagination?: boolean
    hideSearch?: boolean
}) => {
    return (
        <>
            <DataTable
                columns={columns}
                data={posts}
                hidePagination={hidePagination}
            >
                {table => (
                    <>
                        {!hideSearch && (
                            <Input
                                placeholder="I'm looking for..."
                                value={
                                    (table
                                        .getColumn('title')
                                        ?.getFilterValue() as string) ?? ''
                                }
                                onChange={event =>
                                    table
                                        .getColumn('title')
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                                aria-label="search for post"
                            />
                        )}
                    </>
                )}
            </DataTable>
        </>
    )
}

export const columns: ColumnDef<DisplayPost>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return 'Title'
        },
        cell: ({ row }) => {
            const title = row.original.title
            const url = `/blog/${row.original.slug}`
            const description = row.original.seo.description
            return (
                <h3 className="text-lg">
                    <Link to={url}>{title}</Link>
                </h3>
            )
        },
    },
    {
        accessorKey: 'meta',
        header: 'Meta',
        cell: ({ row }) => {
            const author = row.original.author.name ?? row.original.author.email
            const updatedAt = row.original.updatedAt
            return (
                <div className="text-end space-y-1">
                    <p className="text-xs">
                        <span className="font-semibold">Written by</span>{' '}
                        {author}
                    </p>
                    <p className="text-xs">
                        <span className="font-semibold">Date</span>{' '}
                        {updatedAt.toLocaleDateString('zh-TW')}
                    </p>
                </div>
            )
        },
    },
]
