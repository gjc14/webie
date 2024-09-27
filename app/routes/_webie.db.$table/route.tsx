import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { DataGrid } from '../_webie.db/components/data-grid'
import { getTableConfig, getTableData } from '../_webie.db/lib/db/table.server'
import { generateSchema } from '../_webie.db/lib/utils'
import {
	webieRowDataSchema,
	webieTableConfigSchema,
} from '../_webie.db/schema/table'

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()

	const tableConfigString = formData.get('tableConfig')
	const rowsString = formData.get('rows')

	if (!tableConfigString || typeof tableConfigString !== 'string') {
		throw new Error('Invalid tableConfig')
	}

	if (!rowsString || typeof rowsString !== 'string') {
		throw new Error('Invalid rows')
	}

	let tableConfig
	let rows
	try {
		tableConfig = JSON.parse(tableConfigString)
		rows = JSON.parse(rowsString)
	} catch (e) {
		throw new Error('Invalid JSON')
	}

	// Validate the tableConfig and rows
	const tableConfigResult = webieTableConfigSchema.safeParse(tableConfig)
	const dataRowsResult = z.array(webieRowDataSchema).safeParse(rows)

	if (!tableConfigResult.success) {
		console.log('error:', tableConfigResult.error)
		throw new Error('')
	}

	if (!dataRowsResult.success) {
		console.log('error:', dataRowsResult.error)
		throw new Error('')
	}

	const dynamicSchema = generateSchema(tableConfigResult.data.columnMeta)

	try {
		dataRowsResult.data.forEach(row => {
			dynamicSchema.parse(row)
		})
		console.log('Validation passed!')
	} catch (e: any) {
		console.log('Validation failed:', e.errors)
		return json({ msg: 'Validation failed' }, { status: 400 })
	}
	return json({ msg: 'Saved' })
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	if (!params.table) {
		throw new Response('Bad Request', { status: 400 })
	}

	const tableConfig = await getTableConfig(params.table)
	const rows = await getTableData(params.table)

	return json({
		rows,
		tableConfig,
	})
}

export default function DBTable() {
	const { tableConfig, rows } = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	return (
		<div className="h-full">
			{/* TODO: page */}
			<fetcher.Form
				className="h-full"
				onSubmit={e => {
					e.preventDefault()

					const formData = new FormData(e.currentTarget)
					formData.set('tableConfig', JSON.stringify(tableConfig))
					formData.set('rows', JSON.stringify(rows))

					fetcher.submit(formData, {
						method: 'POST',
					})
				}}
			>
				<Button>Save</Button>
				<DataGrid tableConfig={tableConfig} rows={rows} />
			</fetcher.Form>
		</div>
	)
}
