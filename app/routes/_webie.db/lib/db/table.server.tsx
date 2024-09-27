import { webieDataGridProps } from '../../components/data-grid'

export const getTable = async (table: string): Promise<webieDataGridProps> => {
	const columnMeta: webieDataGridProps['columnMeta'] = [
		{
			id1: {
				type: 'string',
				headerName: 'Make',
				editable: true,
				filter: true,
				sortable: true,
			},
		},
		{
			id2: {
				type: 'string',
				headerName: 'Model',
				editable: true,
				filter: true,
				sortable: true,
			},
		},
		{
			id3: {
				type: 'number',
				headerName: 'Price',
				editable: true,
				filter: true,
				sortable: true,
			},
		},
		{
			id4: {
				type: 'boolean',
				headerName: 'In Stock',
				editable: false,
				filter: true,
				sortable: true,
			},
		},
	]

	const data: webieDataGridProps['data'] = [
		{ id1: 'Tesla', id2: 'Model Y', id3: 64950, id4: true },
		{ id1: 'Ford', id2: 'F-Series', id3: 33850, id4: false },
		{ id1: 'Toyota', id2: 'Corolla', id3: 29600, id4: false },
	]

	return { columnMeta, data }
}
