import { z, ZodTypeAny } from 'zod'

/**
 * Define supporting type for column of the data grid.
 * It could be directly selected by end user
 * Workflow:
 * -> Add a new type
 * -> update rest of this file
 * -> expose select button in components/table/type-selector.tsx
 * -> update table_.edit/components/column-settings.tsx SettingCard component
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
    'nanoId',

    'json',

    // connetions
    'calc',

    // Cross table connections
    'table',
    'tableLookup',
])
export type webieColType = z.infer<typeof webieColTypesSchema>

/**
 * Define the default values for the column types.
 */
export const typeDefaultValuesMap: { [key in webieColType]: any } = {
    string: '',
    number: 0,
    boolean: true,
    date: new Date().toLocaleString(),
    email: '',

    // void: `print("void")`,
    any: null,

    api: undefined,
    select: '',
    multipleSelect: [],

    url: 'https://webie.dev',
    ip: '',

    uuid: '',
    cuid: '',
    nanoId: '',

    json: '{}',

    calc: undefined,

    table: '',
    tableLookup: '',
}

/**
 * Map webieColType to the corresponding Zod types.
 */
export const zodTypeMap: Record<webieColType, ZodTypeAny> = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
    date: z.date(),
    email: z.string().email(),

    // void: z.void(),
    any: z.any(),

    api: z.undefined(),
    select: z.string(),
    multipleSelect: z.array(z.string()),

    url: z.string().url(),
    ip: z.string().ip(),

    uuid: z.string().uuid(),
    cuid: z.string().cuid(),
    nanoId: z.string().nanoid(),

    json: z.string(),

    calc: z.undefined(),

    table: z.string(),
    tableLookup: z.string(),
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

/**
 * Define the schema for the table settings.
 */
export const webieTableSettingsSchema = z.object({
    autoSave: z.boolean().default(false),
})
export type webieTableSettings = z.infer<typeof webieTableSettingsSchema>

/**
 * Define the schema for the table configuration.
 */
export const webieTableConfigSchema = z.object({
    _id: z.string(),
    table: z.string(),
    settings: webieTableSettingsSchema,
    columns: webieColumnsSchema,
})
export type webieTableConfig = z.infer<typeof webieTableConfigSchema>

/**
 * Define the schema for the row data.
 */
export const webieRowDataSchema = z
    .object({
        _id: z.string(),
    })
    .catchall(z.any())

export type webieRowData = z.infer<typeof webieRowDataSchema>
