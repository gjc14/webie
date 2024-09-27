import { z, ZodTypeAny } from 'zod'

/**
 * Define supporting type for columns of the data grid.
 */
const webieColTypesSchema = z.enum([
	'string',
	'number',
	'boolean',
	'email',
	'date',
	'bigint',
])
type webieColType = z.infer<typeof webieColTypesSchema>

/**
 * Map webieColType to the corresponding Zod types.
 */
const zodTypeMap: Record<webieColType, ZodTypeAny> = {
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
const webieColDefSchema = z.object({
	type: webieColTypesSchema,
	headerName: z.string(),
	editable: z.boolean().optional(),
	filter: z.boolean().optional(),
	sortable: z.boolean().optional(),
})
type webieColDef = z.infer<typeof webieColDefSchema>

/**
 * Define the schema for the table columns.
 */
export type webieColumns = Array<{
	[id: string]: webieColDef
}>

/**
 * Generate a schema based on the columns.
 * @param columns
 * @returns zod schema
 */
export const generateSchema = (columns: webieColumns) => {
	const schemaShape: Record<string, ZodTypeAny> = {}

	columns.forEach(column => {
		const [columnId, columnDef] = Object.entries(column)[0]
		const zodType = zodTypeMap[columnDef.type]
		if (!zodType) {
			throw new Error(`Unsupported type: ${columnDef.type}`)
		}
		schemaShape[columnId] = zodType
	})

	return z.object(schemaShape)
}
