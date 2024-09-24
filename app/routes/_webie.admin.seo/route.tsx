import { ActionFunctionArgs, json, SerializeFrom } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { AdminActions, AdminHeader, AdminSectionWrapper, AdminTitle } from '~/components/admin/admin-wrapper'
import { AdminDataTableMoreMenu, DataTable } from '~/components/admin/data-table'
import { SeoContent } from '~/components/admin/seo-content'
import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { decodedAdminToken } from '~/lib/db/auth.server'
import { getSEOs, updateSEO } from '~/lib/db/seo.server'

export const SeoUpdateSchmea = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== 'PUT') {
		return json({ err: 'Method not allowed' }, { status: 405 })
	}

	await decodedAdminToken(request.headers.get('Cookie'))

	const formData = await request.formData()
	const updateSeoData = Object.fromEntries(formData)

	const zResult = SeoUpdateSchmea.safeParse(updateSeoData)

	if (!zResult.success || !zResult.data) {
		const message = zResult.error.issues.map(issue => `${issue.message} ${issue.path[0]}`).join(' & ')
		return json({ err: message }, { status: 400 })
	}

	try {
		const { seo } = await updateSEO({
			id: zResult.data.id,
			title: zResult.data.title,
			description: zResult.data.description,
		})
		return json({ msg: `SEO for ${seo.route || seo.title || 'unknown'} updated` })
	} catch (error) {
		console.error(error)
		return json({ err: 'Failed to update SEO' }, { status: 500 })
	}
}

export const loader = async () => {
	const { seo } = await getSEOs()

	return json({ seo })
}

export type SerializedSeo = SerializeFrom<typeof loader>['seo'][number]

export default function AdminSEO() {
	const { seo } = useLoaderData<typeof loader>()
	const [open, setOpen] = useState(false)

	return (
		<AdminSectionWrapper hideReturnButton>
			<AdminHeader>
				<AdminTitle description="SEO data is connect to post or route. You could set in either here or in post or route.">
					SEO
				</AdminTitle>
				<AdminActions>
					<Button className="space-x-1.5" size={'sm'} onClick={() => setOpen(true)}>
						<PlusCircle size={16} />
						<p className="text-xs">Create seo</p>
					</Button>
					<SeoContent method="POST" action={`/admin/seo/create`} open={open} setOpen={setOpen} />
				</AdminActions>
			</AdminHeader>
			<DataTable columns={columns} data={seo}>
				{table => (
					<Input
						placeholder="Filter route..."
						value={(table.getColumn('route')?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn('route')?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				)}
			</DataTable>
		</AdminSectionWrapper>
	)
}

export const columns: ColumnDef<SerializedSeo>[] = [
	{
		accessorKey: 'route',
		header: 'Route',
		accessorFn: row => row.route ?? `/blog/${row.Post?.slug}`,
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) => {
			return <span className="block w-28 md:w-60 truncate">{row.original.description}</span>
		},
	},
	{
		accessorKey: 'autoGenerated',
		header: 'System',
		accessorFn: row => (row.autoGenerated ? 'Yes' : 'No'),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created at',
		accessorFn: row => new Date(row.createdAt).toLocaleString('zh-TW'),
	},
	{
		accessorKey: 'updatedAt',
		header: 'Last update',
		accessorFn: row => new Date(row.updatedAt).toLocaleString('zh-TW'),
	},
	{
		accessorKey: 'id',
		header: 'Edit',
		cell: ({ row }) => {
			const [open, setOpen] = useState(false)
			const id = row.original.id

			return (
				<>
					<AdminDataTableMoreMenu route="seo" id={id}>
						<DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
					</AdminDataTableMoreMenu>
					<SeoContent method="PUT" action={`/admin/seo`} seo={row.original} open={open} setOpen={setOpen} />
				</>
			)
		},
	},
]
