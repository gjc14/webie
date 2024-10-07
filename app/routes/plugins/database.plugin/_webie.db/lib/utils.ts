import { z, ZodTypeAny } from 'zod'
import { webieColumns, zodTypeMap } from '../schema/table'

/**
 * Generate a schema based on the columns.
 * @param columns
 * @returns zod schema
 */
export const generateSchema = (columns: webieColumns) => {
    const schemaShape: Record<string, ZodTypeAny> = {}

    columns.forEach(column => {
        const zodType = zodTypeMap[column.type]
        if (!zodType) {
            throw new Error(`Unsupported type: ${column.type}`)
        }
        schemaShape[column._id] = zodType
    })

    return z.object(schemaShape)
}
