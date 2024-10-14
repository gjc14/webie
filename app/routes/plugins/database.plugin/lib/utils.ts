import { ObjectId } from 'bson'
import { z, ZodTypeAny } from 'zod'

import { typeDefaultColumnMetaValueMap } from '../schema/column'
import {
    typeDefaultValuesMap,
    webieColDef,
    webieColType,
    webieColumns,
    webieRowData,
    webieTableConfig,
    zodTypeMap,
} from '../schema/table'

/**
 * Generate a schema based on columns for table validation.
 * @param columns
 * @returns zod object schema containing all columns
 */
export const generateTableSchema = (columns: webieColumns) => {
    const tableSchemaShape: Record<string, ZodTypeAny> = {}

    columns.forEach(column => {
        const zodType = zodTypeMap[column.type]
        if (!zodType) {
            throw new Error(`Unsupported type: ${column.type}`)
        }
        tableSchemaShape[column._id] = zodType
    })

    return z.object(tableSchemaShape)
}

/**
 * Generate a schema based on a column for column validation.
 * @param column
 * @returns zod schema for a single column
 */
export const generateColumnSchema = (column: webieColDef) => {
    const schema = zodTypeMap[column.type]
    return schema
}

export const generateNewColumn = (type: webieColType): webieColDef => {
    const defaultTypeColumnMeta = typeDefaultColumnMetaValueMap[type]
    return {
        _id: new ObjectId().toString(),
        type: type,
        typeMeta: defaultTypeColumnMeta,
        headerName: `New ${type}`,
        editable: true,
        filter: true,
        sortable: true,
    }
}

export const generateNewRow = (tableConfig: webieTableConfig): webieRowData => {
    const newRow: webieRowData = {
        _id: new ObjectId().toString(),
        ...tableConfig.columns.reduce(
            (acc: { [columnId: string]: any }, column) => {
                const customedDefaultValue = column.typeMeta?.defaultValue

                if (customedDefaultValue) {
                    acc[column._id] = customedDefaultValue
                    return acc
                }

                const syetemDefaultValue = typeDefaultValuesMap[column.type]
                acc[column._id] = syetemDefaultValue
                return acc
            },
            {}
        ),
    }
    return newRow
}

/**
 * Generate a Json type schema.
 * @see https://zod.dev/?id=json-type
 */
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
export type Json = Literal | { [key: string]: Json } | Json[]
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
)
