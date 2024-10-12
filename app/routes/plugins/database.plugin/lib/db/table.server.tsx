import {
    webieColumns,
    webieRowData,
    webieTableConfig,
} from '../../schema/table'

export const getTableConfig = async (
    table: string
): Promise<webieTableConfig> => {
    const columns: webieColumns = [
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
            type: 'api',
            headerName: 'Api',
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
        {
            _id: 'columnId5',
            type: 'void',
            headerName: 'Func',
            editable: true,
            filter: false,
            sortable: true,
        },
        {
            _id: 'columnId6',
            type: 'string',
            headerName: 'Read columnId1',
            editable: true,
            filter: true,
            sortable: true,
            width: 300,
            valueGetter: {
                func: 'sameAsColumn',
                params: { columnId: 'columnId3' },
            },
        },
    ]

    return { _id: 'tableId', settings: { autoSave: false }, table, columns }
}

export const getTableData = async (table: string): Promise<webieRowData[]> => {
    const data: webieRowData[] = [
        {
            _id: '211',
            columnId1: 'Tesla',
            columnId2: undefined,
            columnId3: 64950,
            columnId4: true,
        },
        {
            _id: '213',
            columnId1: 'Ford',
            columnId2: undefined,
            columnId3: 33850,
            columnId4: false,
        },
        {
            _id: '212',
            columnId1: 'Toyota',
            columnId2: undefined,
            columnId3: 29600,
            columnId4: false,
        },
    ]

    return data
}
