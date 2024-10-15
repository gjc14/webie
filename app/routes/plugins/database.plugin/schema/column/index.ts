import { z, ZodTypeAny } from 'zod'
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
    'longText',
    'image',
    'file',
])
export type webieColType = z.infer<typeof webieColTypesSchema>

/**
 * Define the default values for the column types.
 */
export const typeDefaultValuesMap: { [key in webieColType]: any } = {
    string: null,
    number: null,
    boolean: true,
    date: new Date().toLocaleString(),
    email: null,

    // void: `print("void")`,
    any: null,

    api: undefined,
    select: '',
    multipleSelect: [],

    url: null,
    ip: null,

    uuid: null,
    cuid: null,
    nanoid: null,

    json: '{}',

    calc: undefined,

    table: '',
    tableLookup: '',

    longText: null,
    image: null,
    file: null,
}

/**
 * Map webieColType to the corresponding Zod types.
 * AG-Grid only supports 'text', 'number', 'boolean', 'date', 'dateString' and 'object'.
 * @see https://www.ag-grid.com/react-data-grid/cell-data-types/
 */
export const zodTypeMap: Record<webieColType, ZodTypeAny> = {
    string: z.string().nullable(),
    number: z.number().nullable(),
    boolean: z.boolean(),
    date: z.date(),
    email: z.string().email().nullable(),

    // void: z.void(),
    any: z.any(),

    api: z.undefined(),
    select: z.string(),
    multipleSelect: z.string(),

    url: z.string().url().nullable(),
    ip: z.string().ip().nullable(),

    uuid: z.string().uuid().nullable(),
    cuid: z.string().cuid().nullable(),
    nanoid: z.string().nanoid().nullable(),

    json: z.string(),

    calc: z.undefined(),

    table: z.string().nullable(),
    tableLookup: z.string().nullable(),

    longText: z.string().nullable(),
    image: z.string().nullable(),
    file: z.string().nullable(),
}

/**
 * Define the schema for the column definition.
 */
export const webieColDefSchema = z.object({
    _id: z.string(),
    type: webieColTypesSchema,
    // type meta data
    typeMeta: z.any().optional(),

    // AG-Grid ColDef properties
    headerName: z.string(),
    editable: z.boolean().optional(),
    filter: z.boolean().optional(),
    sortable: z.boolean().optional(),
    width: z.number().optional(),
    valueGetterCustomLogic: z.string().optional(),

    // Meta data, used for storing additional information
    meta: z.any().optional(),
})
export type webieColDef = z.infer<typeof webieColDefSchema>

/**
 * Define the schema for the table columns.
 */
export const webieColumnsSchema = z.array(webieColDefSchema)
export type webieColumns = z.infer<typeof webieColumnsSchema>
