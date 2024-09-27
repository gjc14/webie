import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'

import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'
import { webieRowData, webieTableConfig } from '../../schema/table'

export interface webieDataGridProps {
	tableConfig: webieTableConfig
	rows: webieRowData[]
}

export const DataGrid = (props: webieDataGridProps) => {
	const { tableConfig, rows } = props
	const [rowData, setRowData] = useState<webieRowData[]>(rows)

	// TODO: Add buttons to CUD rows

	// Column Definitions: Defines the columns to be displayed.
	// keyof webieRowData will map to the field (column ID)
	const mappedColumns: ColDef<webieRowData>[] = tableConfig.columnMeta.map(
		column => {
			return {
				headerName: column.headerName,
				field: column._id,
				editable: column.editable,
				filter: column.filter,
				sortable: column.sortable,
				onCellValueChanged: e => {
					const updatedRow = e.data
					console.log(updatedRow)

					// updatedRow[colId] = e.newValue
					// setRowData([...rowData])
				},
			}
		}
	)
	const [colDefs, setColDefs] = useState<ColDef<webieRowData>[]>([
		...mappedColumns,
		{ headerName: 'ID', field: '_id' },
	])

	return (
		<div className="ag-theme-quartz-auto-dark h-full">
			<AgGridReact rowData={rowData} columnDefs={colDefs} />
		</div>
	)
}
