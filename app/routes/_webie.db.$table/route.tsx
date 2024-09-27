import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DataGrid, DataGridProps } from '../_webie.db/components/data-grid'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const columnMeta: DataGridProps['columnMeta'] = {
		id1: {
			headerName: 'Make',
			editable: true,
			filter: true,
			sortable: true,
		},
		id2: {
			headerName: 'Model',
			editable: true,
			filter: true,
			sortable: true,
		},
		id3: {
			headerName: 'Price',
			editable: true,
			filter: true,
			sortable: true,
		},
		id4: {
			headerName: 'In Stock',
			editable: false,
			filter: true,
			sortable: true,
		},
	}

	const data = [
		{ id1: 'Tesla', id2: 'Model Y', id3: 64950, id4: true },
		{ id1: 'Ford', id2: 'F-Series', id3: 33850, id4: false },
		{ id1: 'Toyota', id2: 'Corolla', id3: 29600, id4: false },
	]

	return json({ columnMeta, data })
}

export default function DBTable() {
	const { columnMeta, data } = useLoaderData<typeof loader>()

	return (
		<div className="h-full">
			{/* TODO: page */}
			<DataGrid columnMeta={columnMeta} data={data} />
		</div>
	)
}
