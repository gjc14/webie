import { ColDef } from 'ag-grid-community'
import { CustomCellRendererProps } from 'ag-grid-react'
import { Maximize2 } from 'lucide-react'

import { useCallback, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { webieRowData } from '../../schema/table'

export type webieDefinedColumns = '_id' | '_openRow' | '_addColumn'

export const getWebieDefinedColumns = (): {
    [key in webieDefinedColumns]: ColDef<webieRowData>
} => {
    const webieProvidedColumns: {
        [key in webieDefinedColumns]: ColDef<webieRowData>
    } = {
        _id: {
            colId: '_id',
            field: '_id',
            headerName: 'ID',
            headerTooltip: 'Unique identifier for the row',
            editable: false,
            filter: true,
            sortable: true,
        },
        _openRow: {
            colId: '_openRow',
            field: '_openRow',
            headerName: 'Open',
            headerTooltip: 'Open in a popup for clearer view',
            tooltipField: undefined,
            tooltipValueGetter() {
                return 'Open this row in a popup'
            },
            editable: false,
            filter: false,
            sortable: false,
            width: 60,
            cellRenderer: openRowRenderer,
        },
        _addColumn: {
            colId: '_addColumn',
            field: '_addColumn',
            headerName: 'Add Column',
            headerTooltip: 'Add a new column',
            editable: false,
            filter: false,
            sortable: false,
            width: 60,
            resizable: false,
            suppressMovable: true,
        },
    }
    return webieProvidedColumns
}

const openRowRenderer = (params: CustomCellRendererProps<webieRowData>) => {
    const [thisRowData, setThisRowData] = useState<webieRowData | null>(null)
    const rowIndex = params.node.rowIndex

    const getRowData = useCallback(() => {
        if (rowIndex === null) return null
        const rowNode = params.api.getDisplayedRowAtIndex(rowIndex)
        if (!rowNode || !rowNode.data?._id) return null

        const columns = params.api.getColumns()

        let rowData: webieRowData = { _id: rowNode.data._id }
        columns?.forEach(col => {
            const key = col.getColId()
            const value = params.api.getCellValue({ rowNode, colKey: key })
            rowData[key] = value
        })
        setThisRowData(rowData)
        return
    }, [])

    return (
        <Dialog>
            <DialogTrigger
                className="w-full h-full flex items-center justify-center"
                onClick={() => getRowData()}
            >
                <div className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-accent">
                    <Maximize2 size={16} />
                </div>
            </DialogTrigger>

            <DialogContent className="flex flex-col md:h-[90vh] md:w-[40vw] max-h-[90vh] max-w-[40vw] overflow-auto ">
                <DialogHeader>
                    <DialogTitle>
                        This is your data for row {params.data?._id}
                    </DialogTitle>
                    <DialogDescription>Index: {rowIndex}</DialogDescription>
                </DialogHeader>
                <div className="w-full grow rounded-lg">
                    <h5
                        onClick={() => {
                            console.log('Row index:', rowIndex)
                            console.log(
                                params.api.getDisplayedRowAtIndex(rowIndex || 0)
                            )
                        }}
                    >
                        Row displayed:
                    </h5>
                    <p className="text-wrap break-all whitespace-break-spaces">
                        {JSON.stringify(thisRowData)}
                    </p>
                    <h5>Column def:</h5>
                    <p className="text-wrap break-all whitespace-break-spaces">
                        {JSON.stringify(params.api.getColumnDefs(), null, 2)}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
