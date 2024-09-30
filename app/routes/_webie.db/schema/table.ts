import { z, ZodTypeAny } from 'zod'

/**
 * Define supporting type for columns of the data grid.
 */
export const webieColTypesSchema = z.enum([
    'string',
    'number',
    'boolean',
    'email',
    'date',
    'bigint',
])
export type webieColType = z.infer<typeof webieColTypesSchema>

/**
 * Map webieColType to the corresponding Zod types.
 */
export const zodTypeMap: Record<webieColType, ZodTypeAny> = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
    email: z.string().email(),
    date: z.date(),
    bigint: z.bigint(),
}

/**
 * Define the schema for the column definition.
 */
export const webieColDefSchema = z.object({
    _id: z.string(),
    type: webieColTypesSchema,
    headerName: z.string(),
    editable: z.boolean().optional(),
    filter: z.boolean().optional(),
    sortable: z.boolean().optional(),
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
    columnMeta: webieColumnsSchema,
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
