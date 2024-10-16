import { DataTypeDefinition } from 'ag-grid-community'
import { webieColType } from '../../schema/column'

export type webieTypeIsNotPredefined = Exclude<
    webieColType,
    // AG-Grid predefined types
    'text' | 'number' | 'boolean' | 'date' | 'dateString' | 'object'
>

export const webieDataTypeDefinitions: Record<
    webieTypeIsNotPredefined,
    DataTypeDefinition
> = {
    string: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    email: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    // any: {
    //     extendsDataType: 'text',
    //     baseDataType: 'text',
    // },
    api: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    select: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    multipleSelect: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    url: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    ip: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    uuid: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    cuid: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    nanoid: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    json: {
        extendsDataType: 'object',
        baseDataType: 'object',
    },
    calc: {
        extendsDataType: 'text',
        baseDataType: 'text',
        dataTypeMatcher(value) {
            return String(value).startsWith('=')
        },
    },
    table: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    tableLookup: {
        extendsDataType: 'object',
        baseDataType: 'object',
    },
    longText: {
        extendsDataType: 'text',
        baseDataType: 'text',
    },
    percentage: {
        extendsDataType: 'number',
        baseDataType: 'number',
        valueFormatter: params =>
            params.value == null ? '' : `${Math.round(params.value * 100)}%`,
    },
    image: {
        extendsDataType: 'object',
        baseDataType: 'object',
    },
    file: {
        extendsDataType: 'object',
        baseDataType: 'object',
    },
}
