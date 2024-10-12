import { ColDef } from 'ag-grid-community'

import { webieRowData } from '../../schema/table'

export type webieDefinedColumns = '_id' | '_actions' | '_addColumn'

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
        _actions: {
            field: '_openRow',
            headerName: 'Open',
            editable: false,
            filter: false,
            sortable: false,
            width: 60,
            // cellRenderer: 'openRowRenderer',
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
