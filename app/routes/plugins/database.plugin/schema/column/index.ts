import { ValueFormatterFunc } from 'ag-grid-community'
import { UUID } from 'bson'
import cuid from 'cuid'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { idTypes, TypeMetaFor } from './type-meta'
/**
 * Define supporting type for column of the data grid.
 * It could be directly selected by end user
 * Workflow:
 * -> Add a new type
 * -> update rest of this file
 * -> expose select button in components/table/type-selector.tsx
 * -> update components/data-grid/column-settings component
 */
export const webieColTypesSchema = z.enum([
    // primitive values
    'string',
    'number',
    'boolean',
    'date',
    'email',

    // 'void', // accepts undefined

    'any',

    // complex or nested types
    'api',
    'select',
    'multipleSelect',

    'url',
    'ip',

    'uuid',
    'cuid',
    'nanoid',

    'json',

    // connetions
    'calc',

    // Cross table connections
    'table',
    'tableLookup',

    // Others
    // [!!!] Type could be a explicit type feature or a column feature.
    'longText',
    // Now percentage it's not a type feature, it's a number column feature.
    // Just add to type selector to be explicit and able to add directly in the column.
    'percentage',
    'image',
    'file',
])
export type webieColType = z.infer<typeof webieColTypesSchema>

/**
 * Default value generater for unique id (nanoid)
 * Webie only explicitly open option Unique ID (default nanoID), user could set typeMeta to type UUID or CUID.
 */
export const generateID = (type: (typeof idTypes)[number]) => {
    switch (type) {
        case 'uuid':
            return new UUID(UUID.generate()).toString()
        case 'cuid':
            return cuid()
        case 'nanoid':
            return nanoid()
        default:
            throw new Error(`Unsupported ID type: ${type}`)
    }
}

/**
 * Define the default values for the column types.
 */
export const typeDefaultValuesMap = {
    string: null,
    number: null,
    boolean: true,
    date: new Date(),
    email: null,

    // void: `print("void")`,
    any: null,

    // No cell value, should be cellRenderer
    api: undefined,
    select: null,
    multipleSelect: null,

    url: null,
    ip: null,

    uuid: () => generateID('uuid'),
    cuid: () => generateID('cuid'),
    nanoid: () => generateID('nanoid'),

    json: null,

    // No cell value, should be valueGetter
    calc: undefined,

    table: null,
    tableLookup: null,

    longText: null,
    percentage: null,
    image: null,
    file: null,
} as const

/**
 * Map webieColType to the corresponding Zod types.
 * AG-Grid only supports 'text', 'number', 'boolean', 'date', 'dateString' and 'object'.
 * @see https://www.ag-grid.com/react-data-grid/cell-data-types/
 */
export const zodTypeMap = {
    string: z.string().nullable(),
    number: z.number().nullable(),
    boolean: z.boolean(),
    date: z.date().nullable(),
    email: z.string().email().nullable(),

    // void: z.void(),
    any: z.any(),

    api: z.undefined(),
    select: z.string().nullable(),
    multipleSelect: z.string().nullable(),

    url: z.string().url().nullable(),
    ip: z.string().ip().nullable(),

    uuid: z.string().uuid().nullable(),
    cuid: z.string().cuid().nullable(),
    nanoid: z.string().nanoid().nullable(),

    json: z.string().nullable(),

    calc: z.undefined(),

    table: z.string().nullable(),
    tableLookup: z.string().nullable(),

    longText: z.string().nullable(),
    percentage: z.number().nullable(),
    image: z.string().nullable(),
    file: z.string().nullable(),
} as const
// type ZodTypeMap = typeof zodTypeMap
// type ZodTypeOf<K extends keyof ZodTypeMap> = ZodTypeMap[K]

/**
 * Define the schema for the column definition.
 */
export const webieColDefSchema = z.object({
    _id: z.string(),
    type: webieColTypesSchema,
    // type meta data
    typeMeta: z.any().optional(),

    // AG-Grid ColDef properties
    headerName: z.string().optional(),
    editable: z.boolean().optional(),
    filter: z.boolean().optional(),
    sortable: z.boolean().optional(),
    width: z.number().optional(),
    valueGetterCustomLogic: z.string().optional(),

    // Meta data, used for storing additional information
    meta: z.any().optional(),
})
export type webieColDef = z.infer<typeof webieColDefSchema> & {
    valueFormatter?: string | ValueFormatterFunc
}

/**
 * Generic webieColDef
 * @example type uuidTypeMeta = webieColDefGeneric<'uuid'>['typeMeta']
 */
export interface webieColDefGeneric<T extends webieColType>
    extends z.infer<typeof webieColDefSchema> {
    type: T
    typeMeta: TypeMetaFor<T>
    valueFormatter?: string | ValueFormatterFunc
}

/**
 * Define the schema for the table columns.
 */
export const webieColumnsSchema = z.array(webieColDefSchema)
export type webieColumns = z.infer<typeof webieColumnsSchema>
