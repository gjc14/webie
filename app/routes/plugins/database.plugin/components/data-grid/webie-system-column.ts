import { ColDef } from 'ag-grid-community'

import { webieRowData } from '../../schema/table'

export type webieDefinedColumns = '_id' | '_actions' | '_addColumn'

export const getWebieDefinedColumns = ({
    settingMode,
}: {
    settingMode: boolean
}): {
    [key in webieDefinedColumns]: ColDef<webieRowData>
} => {
    const webieProvidedColumns: {
        [key in webieDefinedColumns]: ColDef<webieRowData>
    } = {
        _id: {
            field: '_id',
            headerName: 'ID',
            editable: settingMode && false,
            filter: settingMode && false,
            sortable: settingMode && false,
        },
        _actions: {
            field: '_actions',
            headerName: 'Actions',
            editable: false,
            filter: false,
            sortable: false,
        },
        _addColumn: {
            field: '_addColumn',
            headerName: 'Add Column',
            editable: false,
            filter: false,
            sortable: false,
            width: 60,
            resizable: false,
        },
    }
    return webieProvidedColumns
}
