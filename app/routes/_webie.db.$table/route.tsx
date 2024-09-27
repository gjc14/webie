import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { DataGrid } from '../_webie.db/components/data-grid'
import { getTable } from '../_webie.db/lib/db/table.server'
import { generateSchema, webieColumns } from '../_webie.db/lib/utils'

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()

	const columnMeta = formData.get('columnMeta') as webieColumns | null
	if (!columnMeta) {
		throw new Response('Bad Request', { status: 400 })
	}

	const dynamicSchema = generateSchema(columnMeta)
	// Test the schema
	const inputData = {
		id1: 'Alice',
		id2: 'Model S',
		id3: 30,
		id4: true,
	}

	try {
		dynamicSchema.parse(inputData) // Passes
		console.log('Validation passed!')
	} catch (e: any) {
		console.log('Validation failed:', e.errors)
	}
	return null
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	if (!params.table) {
		throw new Response('Bad Request', { status: 400 })
	}

	const { columnMeta, data } = await getTable(params.table)

	return json({ columnMeta, data })
}

export default function DBTable() {
	const { columnMeta, data } = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	return (
		<div className="h-full">
			{/* TODO: page */}
			<fetcher.Form method="POST" className="h-full">
				<DataGrid columnMeta={columnMeta} data={data} />
			</fetcher.Form>
		</div>
	)
}
