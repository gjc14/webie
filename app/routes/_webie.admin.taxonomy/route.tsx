import { json, SerializeFrom } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { AdminActions, AdminHeader, AdminSectionWrapper, AdminTitle } from '~/components/admin/AdminWrapper'
import { DataTable } from '~/components/admin/DataTable'
import { SeoContent } from '~/components/admin/SeoContent'
import { TaxonomyDialog } from '~/components/admin/Taxonomy'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { getCategories, getTags } from '~/lib/db/blog-taxonomy.server'
import { Intents } from '~/routes/_webie.admin.posts.action.taxonomy/route'

export const loader = async () => {
	try {
		const { tags } = await getTags()
		const { categories } = await getCategories()

		return json({ tags, categories })
	} catch (error) {
		console.error(error)
		return json({ tags: [], categories: [] })
	}
}

export type SerializedTaxonomies = SerializeFrom<typeof loader>

export default function AdminTaxonomy() {
	const { tags, categories } = useLoaderData<typeof loader>()
	const [open, setOpen] = useState(false)

	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle description="SEO data is connect to post or route. You could set in either here or in post or route.">
					Taxonomy
				</AdminTitle>
				<AdminActions>
					<TaxonomyDialog tags={tags} categories={categories}>
						<Button className="space-x-1.5" size={'sm'} onClick={() => setOpen(true)}>
							<PlusCircle size={16} />
							<p className="text-xs">Create Taxonomy</p>
						</Button>
					</TaxonomyDialog>
				</AdminActions>
			</AdminHeader>
			<Separator />
			<h3>Tags</h3>
			<DataTable columns={tagColumns} data={tags}>
				{table => (
					<Input
						placeholder="Filter tags..."
						value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				)}
			</DataTable>
			<Separator />
			<h3>Categories</h3>
			<DataTable columns={categoryColumns} data={categories}>
				{table => (
					<Input
						placeholder="Filter category..."
						value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				)}
			</DataTable>
		</AdminSectionWrapper>
	)
}

const DeleteTaxonomy = ({ id, actionRoute, intent }: { id: string; actionRoute: string; intent: Intents }) => {
	const fetcher = useFetcher()

	return (
		<fetcher.Form method="DELETE" action={actionRoute}>
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="intent" value={intent} />
			<Button variant={'destructive'}>Delete</Button>
		</fetcher.Form>
	)
}

export const tagColumns: ColumnDef<SerializedTaxonomies['tags'][number]>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'postIDs',
		header: 'Posts',
		cell: ({ row }) => {
			// TODO: Open a dialog to show posts
			return row.original.postIDs.length
		},
	},
	{
		accessorKey: 'id',
		header: 'Action',
		cell: ({ row }) => (
			<DeleteTaxonomy id={row.original.id} actionRoute={'/admin/posts/action/taxonomy'} intent={'tag'} />
		),
	},
]

export const categoryColumns: ColumnDef<SerializedTaxonomies['categories'][number]>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'postIDs',
		header: 'Posts',
		cell: ({ row }) => {
			// TODO: Open a dialog to show posts
			return row.original.postIDs.length
		},
	},
	{
		accessorKey: 'subCategories',
		header: 'Subcategories',
		cell: ({ row }) => {
			// TODO: Open a dialog to show subcategories
			return row.original.subCategories.length
		},
	},
	{
		accessorKey: 'id',
		header: 'Action',
		cell: ({ row }) => (
			<DeleteTaxonomy id={row.original.id} actionRoute={'/admin/posts/action/taxonomy'} intent={'category'} />
		),
		meta: {
			// Define your own meta and use it in <DataTable>
			className: 'ml-auth',
		},
	},
]
