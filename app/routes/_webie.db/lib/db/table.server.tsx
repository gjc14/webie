import {
	webieColumns,
	webieRowData,
	webieTableConfig,
} from '../../schema/table'

export const getTableConfig = async (
	table: string
): Promise<webieTableConfig> => {
	const columnMeta: webieColumns = [
		{
			_id: 'columnId1',
			type: 'string',
			headerName: 'Make',
			editable: true,
			filter: true,
			sortable: true,
		},
		{
			_id: 'columnId2',
			type: 'string',
			headerName: 'Model',
			editable: true,
			filter: true,
			sortable: true,
		},
		{
			_id: 'columnId3',
			type: 'number',
			headerName: 'Price',
			editable: true,
			filter: true,
			sortable: true,
		},
		{
			_id: 'columnId4',
			type: 'boolean',
			headerName: 'In Stock',
			editable: false,
			filter: true,
			sortable: true,
		},
	]

	return { _id: 'tableId', settings: { autoSave: false }, table, columnMeta }
}

export const getTableData = async (table: string): Promise<webieRowData[]> => {
	const data: webieRowData[] = [
		{
			_id: '211',
			columnId1: 'Tesla',
			columnId2: 'Model Y',
			columnId3: 64950,
			columnId4: true,
		},
		{
			_id: '213',
			columnId1: 'Ford',
			columnId2: 'F-Series',
			columnId3: 33850,
			columnId4: false,
		},
		{
			_id: '212',
			columnId1: 'Toyota',
			columnId2: 'Corolla',
			columnId3: 29600,
			columnId4: false,
		},
	]

	return data
}
