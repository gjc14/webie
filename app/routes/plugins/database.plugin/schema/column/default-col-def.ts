import { ColDef } from 'ag-grid-community'

import { webieColDef, webieColType } from '.'
import { webieRowData } from '../table'

type DefaultColDef = Omit<webieColDef, '_id' | 'type'>

const webieDefaultColDef = (
    type: webieColType
): ColDef<webieRowData> & DefaultColDef => {
    return {
        headerName: `New ${type}`,
        editable: true,
        filter: true,
        sortable: true,
    }
}

export const colDefMap: Record<
    webieColType,
    ColDef<webieRowData> & DefaultColDef
> = {
    string: {
        ...webieDefaultColDef('string'),
    },
    number: {
        ...webieDefaultColDef('number'),
    },
    boolean: {
        ...webieDefaultColDef('boolean'),
    },
    date: {
        ...webieDefaultColDef('date'),
    },
    email: {
        ...webieDefaultColDef('email'),
    },
    // any: {
    //     ...webieDefaultColDef('any'),
    // },
    api: {
        ...webieDefaultColDef('api'),
    },
    select: {
        ...webieDefaultColDef('select'),
    },
    multipleSelect: {
        ...webieDefaultColDef('multipleSelect'),
    },
    url: {
        ...webieDefaultColDef('url'),
    },
    ip: {
        ...webieDefaultColDef('ip'),
    },
    uuid: {
        ...webieDefaultColDef('uuid'),
    },
    cuid: {
        ...webieDefaultColDef('cuid'),
    },
    nanoid: {
        ...webieDefaultColDef('nanoid'),
    },
    json: {
        ...webieDefaultColDef('json'),
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
            rows: 15,
            cols: 50,
        },
    },
    calc: {
        ...webieDefaultColDef('calc'),
    },
    table: {
        ...webieDefaultColDef('table'),
    },
    tableLookup: {
        ...webieDefaultColDef('tableLookup'),
    },
    longText: {
        ...webieDefaultColDef('longText'),
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
            rows: 15,
            cols: 50,
        },
    },
    percentage: {
        ...webieDefaultColDef('percentage'),
    },
    image: {
        ...webieDefaultColDef('image'),
    },
    file: {
        ...webieDefaultColDef('file'),
    },
}
