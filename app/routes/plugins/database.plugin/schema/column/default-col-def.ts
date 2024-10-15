import { webieColDef, webieColType } from '.'

type DefaultColDef = Omit<webieColDef, '_id' | 'type'>

const defaultColDef = (type: webieColType): DefaultColDef => {
    return {
        headerName: `New ${type}`,
        editable: true,
        filter: true,
        sortable: true,
        valueFormatter: undefined,
    }
}

export const colDefMap: Record<webieColType, DefaultColDef> = {
    string: {
        ...defaultColDef('string'),
    },
    number: {
        ...defaultColDef('number'),
    },
    boolean: {
        ...defaultColDef('boolean'),
    },
    date: {
        ...defaultColDef('date'),
    },
    email: {
        ...defaultColDef('email'),
    },
    any: {
        ...defaultColDef('any'),
    },
    api: {
        ...defaultColDef('api'),
    },
    select: {
        ...defaultColDef('select'),
    },
    multipleSelect: {
        ...defaultColDef('multipleSelect'),
    },
    url: {
        ...defaultColDef('url'),
    },
    ip: {
        ...defaultColDef('ip'),
    },
    uuid: {
        ...defaultColDef('uuid'),
    },
    cuid: {
        ...defaultColDef('cuid'),
    },
    nanoid: {
        ...defaultColDef('nanoid'),
    },
    json: {
        ...defaultColDef('json'),
    },
    calc: {
        ...defaultColDef('calc'),
    },
    table: {
        ...defaultColDef('table'),
    },
    tableLookup: {
        ...defaultColDef('tableLookup'),
    },
    longText: {
        ...defaultColDef('longText'),
    },
    percentage: {
        ...defaultColDef('percentage'),
    },
    image: {
        ...defaultColDef('image'),
    },
    file: {
        ...defaultColDef('file'),
    },
}
