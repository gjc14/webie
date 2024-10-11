import { ObjectId } from 'bson'
import { z, ZodTypeAny } from 'zod'
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

export const generateNewColumn = (type: webieColType): webieColDef => {
    return {
        _id: new ObjectId().toString(),
        type: type,
        headerName: `New ${type}`,
        editable: true,
        filter: true,
        sortable: true,
    }
}

export const generateNewRow = (tableConfig: webieTableConfig) => {
    const newRow: webieRowData = {
        _id: new ObjectId().toString(),
        ...tableConfig.columns.reduce(
            (acc: { [columnId: string]: any }, column) => {
                acc[column._id] = typeDefaultValuesMap[column.type]
                return acc
            },
            {}
        ),
    }
    return newRow
}
