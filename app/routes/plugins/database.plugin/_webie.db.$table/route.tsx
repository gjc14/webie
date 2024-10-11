import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    SerializeFrom,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ObjectId } from 'bson'
import { useEffect } from 'react'

import { DataGrid } from '../components/data-grid'
import { ToolBar } from '../components/table/tool-bar'
import { getTableConfig, getTableData } from '../lib/db/table.server'
import { useTable } from '../lib/hooks/table'
import { generateSchema } from '../lib/utils'
import { webieRowData } from '../schema/table'
import { processFormData } from './action.server'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()

    const { tableConfigResult, rowsResult } = await processFormData(
        formData.get('tableConfig'),
        formData.get('rows')
    )

    // Generate a schema from the table config
    const dynamicSchema = generateSchema(tableConfigResult.data.columnMeta)

    try {
        // Validate the rows
        rowsResult.data.forEach(row => {
            dynamicSchema.parse(row)
        })
        console.log('Validation passed!')
        return json({ msg: 'Saved successfully' })
    } catch (e: any) {
        console.log('Validation failed:', e.errors)
        return json({ err: 'Validation failed' }, { status: 400 })
    }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    if (!params.table) {
        throw new Response('Bad Request', { status: 400 })
    }

    const tableConfig = await getTableConfig(params.table)
    const rows = await getTableData(params.table)

    return json({
        rows,
        tableConfig,
    })
}

export type SerializedLoaderData = SerializeFrom<typeof loader>

export default function DBTable() {
    const loaderData = useLoaderData<typeof loader>()
    const { tableConfigState, rowsState, setDBState, setRows, isRowsDirty } =
        useTable()

    useEffect(() => {
        // Every time the loaderData changes (revalidated), update the tableConfig and rows to state
        setDBState(loaderData.tableConfig, loaderData.rows)
    }, [loaderData])

    ///////////////////////////////////////////
    // Functions for CUD operations on rows //
    ///////////////////////////////////////////
    const rowCreate = () => {
        const newRow: webieRowData = {
            _id: new ObjectId().toString(),
            ...tableConfigState.columnMeta.reduce(
                (acc: { [columnId: string]: any }, column) => {
                    let defaultValue: unknown
                    switch (column.type) {
                        // primitive values
                        case 'string':
                            defaultValue = ''
                            break
                        case 'number':
                        case 'bigint':
                            defaultValue = 0
                            break
                        case 'boolean':
                            defaultValue = true
                            break
                        case 'date':
                            defaultValue = new Date()
                            break
                        case 'symbol':
                        case 'email':
                            defaultValue = ''
                            break

                        // empty types
                        case 'undefined':
                            defaultValue = undefined
                        case 'void':
                            defaultValue = `print('void')`
                        case 'any':
                            defaultValue = ''

                        // catch-all types
                        // allows any value
                        case 'null':
                        case 'unknown':
                            defaultValue = null

                        // never type
                        // allows no values
                        case 'never':
                            defaultValue = null

                        default:
                            defaultValue = null
                    }
                    acc[column._id] = defaultValue
                    return acc
                },
                {}
            ),
        }
        setRows([...rowsState, newRow])
    }

    const rowUpdate = (updateRow: webieRowData) => {
        const newRows = rowsState.map(row =>
            row._id === updateRow._id ? updateRow : row
        )
        setRows([...newRows])
    }

    const rowDelete = (deleteRow: webieRowData) => {
        const newRows = rowsState.filter(row => row._id !== deleteRow._id)
        setRows(newRows)
    }

    return (
        <div className="h-full flex flex-col p-3 gap-2">
            <ToolBar isDirty={isRowsDirty} createRow={rowCreate} />

            <div className="flex-grow">
                <DataGrid
                    tableConfig={tableConfigState}
                    rows={rowsState}
                    onRowUpdate={e => rowUpdate(e)}
                    onRowDelete={e => rowDelete(e)}
                    onColumnUpdate={e => console.log(e)}
                    onColumnDelete={e => console.log(e)}
                />
            </div>
        </div>
    )
}
