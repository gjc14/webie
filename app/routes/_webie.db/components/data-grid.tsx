import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'
import { webieColumns } from '../lib/utils'

interface RowData {
	[id: string]: any
}

export interface webieDataGridProps {
	columnMeta: webieColumns
	data: RowData[]
}

export const DataGrid = (props: webieDataGridProps) => {
	const { columnMeta, data } = props
	const [rowData, setRowData] = useState<RowData[]>(data)

	// TODO: Add buttons to CUD rows

	// Column Definitions: Defines the columns to be displayed.
	const [colDefs, setColDefs] = useState<ColDef<RowData>[]>(
		columnMeta.map(col => {
			const [colId, colDef] = Object.entries(col)[0]
			return {
				headerName: colDef.headerName,
				field: colId,
				editable: colDef.editable,
				filter: colDef.filter,
				sortable: colDef.sortable,
				onCellValueChanged: e => {
					const updatedRow = e.data
					console.log(updatedRow)
					// updatedRow[colId] = e.newValue
					// setRowData([...rowData])
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
