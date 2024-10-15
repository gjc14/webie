import { z } from 'zod'
import { webieColumnsSchema } from './column'

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
