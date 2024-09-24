import { json, SerializeFrom } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, PlusCircle } from 'lucide-react'
import { AdminActions, AdminHeader, AdminSectionWrapper, AdminTitle } from '~/components/admin/admin-wrapper'
import { AdminDataTableMoreMenu, DataTable } from '~/components/admin/data-table'
import { TaxonomyDialog } from '~/components/admin/taxonomy'
import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { getCategories, getTags } from '~/lib/db/blog-taxonomy.server'
import { getPosts } from '~/lib/db/post.server'

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

type SerializedPost = SerializeFrom<typeof loader>['posts'][number]

export default function AdminPost() {
	const { posts, tags, categories } = useLoaderData<typeof loader>()

	return (
		<AdminSectionWrapper hideReturnButton>
			<AdminHeader>
				<AdminTitle>Posts</AdminTitle>
				<AdminActions>
					<TaxonomyDialog tags={tags} categories={categories} />
					<Link to="/admin/posts/new">
						<Button className="space-x-1.5">
							<PlusCircle height={16} width={16} />
							<p className="text-xs">Create new post</p>
						</Button>
					</Link>
				</AdminActions>
			</AdminHeader>
			<DataTable columns={columns} data={posts} hideColumnFilter>
				{table => (
					<Input
						placeholder="Filter title..."
						value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn('title')?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				)}
			</DataTable>
		</AdminSectionWrapper>
	)
}

export const columns: ColumnDef<SerializedPost>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'excerpt',
		header: 'Excerpt',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'author',
		header: 'Author',
		accessorFn: row => row.author.name || 'author',
	},
	{
		accessorKey: 'updatedAt',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Last Update
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		accessorFn: row => new Date(row.updatedAt).toLocaleString('zh-TW'),
	},
	{
		accessorKey: 'id',
		header: 'Edit',
		cell: ({ row }) => {
			const id = row.original.id

			return (
				<AdminDataTableMoreMenu route="posts" id={id}>
					<Link to={`/admin/posts/${id}`}>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</Link>
				</AdminDataTableMoreMenu>
			)
		},
	},
]
