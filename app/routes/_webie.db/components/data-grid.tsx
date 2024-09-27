import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'

interface columnDef {
	headerName: string
	editable?: boolean
	filter?: boolean
	sortable?: boolean
}

interface RowData {
	[key: string]: string
}

export interface DataGridProps {
	columnMeta: { [id: string]: columnDef }
	data: { [key: string]: any }[]
}

export const DataGrid = (props: DataGridProps) => {
	const { columnMeta, data } = props
	const [rowData, setRowData] = useState(data)

	// Column Definitions: Defines the columns to be displayed.
	const [colDefs, setColDefs] = useState<ColDef<RowData>[]>(
		Object.keys(columnMeta).map(id => {
			return {
				field: id,
				headerName: columnMeta[id].headerName,
				sortable: columnMeta[id].sortable,
				filter: columnMeta[id].filter,
				editable: columnMeta[id].editable,
				onCellValueChanged(event) {
					const updatedRow = event.data
					console.log(updatedRow)
					// The format is great to update to db
				},
			}
		})
	)

	return (
		<div className="ag-theme-quartz-auto-dark h-full">
			<AgGridReact rowData={rowData} columnDefs={colDefs} />
		</div>
	)
}
