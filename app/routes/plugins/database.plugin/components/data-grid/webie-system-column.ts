import { ColDef } from 'ag-grid-community'

import { webieRowData } from '../../schema/table'

export const getWebieDefinedColumns = ({
    settingMode,
}: {
    settingMode: boolean
}): {
    [columnName: string]: ColDef<webieRowData>
} => {
    const webieProvidedColumns = {
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
    }
    return webieProvidedColumns
}
