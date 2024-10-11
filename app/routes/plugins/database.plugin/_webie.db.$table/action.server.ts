import { z } from 'zod'
import { webieRowDataSchema, webieTableConfigSchema } from '../schema/table'

/**
 * @param tableConfigForm - FormDataEntryValue of tableConfig
 * @param rowsForm - FormDataEntryValue of rows
 * @returns zod safeParse results for tableConfig and rows
 */
export const processFormData = async (
    tableConfigForm: FormDataEntryValue | null,
    rowsForm: FormDataEntryValue | null
) => {
    if (!tableConfigForm || typeof tableConfigForm !== 'string') {
        throw new Error('Invalid tableConfig')
    }

    if (!rowsForm || typeof rowsForm !== 'string') {
        throw new Error('Invalid rows')
    }

    let tableConfig
    let rows
    try {
        tableConfig = JSON.parse(tableConfigForm)
        rows = JSON.parse(rowsForm)
    } catch (e) {
        throw new Error('Invalid JSON')
    }

    // Validate the tableConfig and rows
    const tableConfigResult = webieTableConfigSchema.safeParse(tableConfig)
    const rowsResult = z.array(webieRowDataSchema).safeParse(rows)

    if (!tableConfigResult.success) {
        console.log('error:', tableConfigResult.error)
        throw new Error('Invalid table config')
    }

    if (!rowsResult.success) {
        console.log('error:', rowsResult.error)
        throw new Error('Invalid rows')
    }

    return { tableConfigResult, rowsResult }
}
