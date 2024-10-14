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
            typeMeta: {},
            headerName: 'Make',
            editable: true,
            filter: true,
            sortable: true,
        },
        {
            _id: 'columnId2',
            type: 'api',
            typeMeta: {
                url: '',
                method: 'POST',
                body: '',
                header: {},
            },
            headerName: 'Api',
            editable: true,
            filter: true,
            sortable: true,
        },
        {
            _id: 'columnId3',
            type: 'number',
            typeMeta: {
                defaultValue: 999,
            },
            headerName: 'Price',
            editable: true,
            filter: true,
            sortable: true,
        },
        {
            _id: 'columnId4',
            type: 'boolean',
            typeMeta: {},
            headerName: 'In Stock',
            editable: true,
            filter: true,
            sortable: true,
        },
        {
            _id: 'columnId5',
            type: 'calc',
            typeMeta: {},
            headerName: 'col1 + col3',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: "row.columnId1 + ' ' + row.columnId3;",
        },
        {
            _id: 'columnId6',
            type: 'calc',
            typeMeta: {},
            headerName: 'col3 * 3',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: 'row.columnId3 * 3;',
        },
        {
            _id: 'columnId7',
            type: 'calc',
            typeMeta: {},
            headerName: 'same col6',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: '',
        },
        {
            _id: 'columnId8',
            type: 'calc',
            typeMeta: {},
            headerName: 'col6 * col9',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: 'row.columnId6 * row.columnId9;',
        },
        {
            _id: 'columnId9',
            type: 'calc',
            typeMeta: {},
            headerName: 'same col6',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: 'row.columnId8;',
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
