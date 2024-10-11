import { z } from 'zod'
import { generateSchema } from '../lib/utils'
import { webieRowDataSchema, webieTableConfig } from '../schema/table'

/**
 *
 * @param rowsFormString
 * @param tableConfig
 * @returns
 */
export const validateRows = async (
    rowsFormString: FormDataEntryValue | null,
    tableConfig: webieTableConfig
) => {
    if (!rowsFormString || typeof rowsFormString !== 'string') {
        throw new Error('Invalid rows form')
    }

    let rowsForm
    try {
        rowsForm = JSON.parse(rowsFormString)
    } catch (e) {
        throw new Error('Invalid JSON')
    }

    // Validate the rowsFrom
    const rowsResult = z.array(webieRowDataSchema).safeParse(rowsForm)

    if (!rowsResult.success) {
        console.log('error:', rowsResult.error)
        throw new Error('Invalid rows')
    }

    // Validate rowsForm with the tableConfig
    const dynamicSchema = generateSchema(tableConfig.columns)

    // Validate the rows
    rowsResult.data.forEach(row => {
        dynamicSchema.parse(row)
    })
}
