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
            _id: 'A1',
            type: 'string',
            typeMeta: {},
            headerName: 'Make',
            editable: true,
            filter: true,
            sortable: true,
        },
        {
            _id: 'B1',
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
            _id: 'C1',
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
            _id: 'D1',
            type: 'boolean',
            typeMeta: {
                defaultValue: false,
            },
            headerName: 'In Stock',
            editable: true,
            filter: true,
            sortable: true,
        },
        {
            _id: 'E1',
            type: 'calc',
            typeMeta: {},
            headerName: 'col1 + col3',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: "row.A1 + ' ' + row.C1;",
        },
        {
            _id: 'F1',
            type: 'calc',
            typeMeta: {},
            headerName: 'col3 * 3',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: 'row.C1 * 3;',
        },
        {
            _id: 'G1',
            type: 'calc',
            typeMeta: {},
            headerName: 'same col6',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: '',
        },
        {
            _id: 'H1',
            type: 'calc',
            typeMeta: {},
            headerName: 'col6 * col9',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: 'row.F1 * row.I1;',
        },
        {
            _id: 'I1',
            type: 'calc',
            typeMeta: {},
            headerName: 'same col6',
            editable: true,
            filter: true,
            sortable: true,
            valueGetterCustomLogic: 'row.H1;',
        },
    ]

    return { _id: 'tableId', settings: { autoSave: false }, table, columns }
}

export const getTableData = async (table: string): Promise<webieRowData[]> => {
    const data: webieRowData[] = [
        {
            _id: '211',
            A1: 'Tesla',
            B1: undefined,
            C1: 64950,
            D1: true,
        },
        {
            _id: '213',
            A1: 'Ford',
            B1: undefined,
            C1: 33850,
            D1: false,
        },
        {
            _id: '212',
            A1: 'Toyota',
            B1: undefined,
            C1: 29600,
            D1: false,
        },
    ]

    return data
}
