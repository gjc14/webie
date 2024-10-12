import { ColDef } from 'ag-grid-community'
import { CustomCellRendererProps } from 'ag-grid-react'
import { Maximize2 } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { webieRowData } from '../../schema/table'
import { DBToolTip } from '../db-tooltip'

export type webieDefinedColumns = '_id' | '_openRow' | '_addColumn'

export const getWebieDefinedColumns = (): {
    [key in webieDefinedColumns]: ColDef<webieRowData>
} => {
    const webieProvidedColumns: {
        [key in webieDefinedColumns]: ColDef<webieRowData>
    } = {
        _id: {
            field: '_id',
            headerName: 'ID',
            editable: false,
            filter: true,
            sortable: true,
        },
        _openRow: {
            field: '_openRow',
            headerName: 'Open',
            editable: false,
            filter: false,
            sortable: false,
            width: 60,
            cellRenderer: openRowRenderer,
        },
        _addColumn: {
            field: '_addColumn',
            headerName: 'Add Column',
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

const openRowRenderer = (params: CustomCellRendererProps) => {
    return (
        <Dialog>
            <DBToolTip asChild message="Open your row">
                <DialogTrigger className="w-full h-full flex items-center justify-center">
                    <Maximize2 size={16} />
                </DialogTrigger>
            </DBToolTip>
            <DialogContent className="md:h-[90vh] md:w-[50vw]">
                <DialogHeader>
                    <DialogTitle>
                        This is your data for {params.data._id}
                    </DialogTitle>
                    <DialogDescription>
                        {JSON.stringify(params.data)}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
