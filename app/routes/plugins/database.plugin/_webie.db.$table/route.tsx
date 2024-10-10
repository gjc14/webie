import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    SerializeFrom,
} from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { DataGrid } from '../components/data-grid'
import { getTableConfig, getTableData } from '../lib/db/table.server'
import { generateSchema } from '../lib/utils'
import {
    webieRowData,
    webieRowDataSchema,
    webieTableConfigSchema,
} from '../schema/table'
import { ToolBar } from '../components/table/tool-bar'
import { ObjectId } from 'bson'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()

    const tableConfigString = formData.get('tableConfig')
    const rowsString = formData.get('rows')

    const { tableConfig, rows } = await processFormData(
        tableConfigString,
        rowsString
    )

    // Validate the tableConfig and rows
    const tableConfigResult = webieTableConfigSchema.safeParse(tableConfig)
    const dataRowsResult = z.array(webieRowDataSchema).safeParse(rows)

    if (!tableConfigResult.success) {
        console.log('error:', tableConfigResult.error)
        throw new Error('Invalid table config')
    }

    if (!dataRowsResult.success) {
        console.log('error:', dataRowsResult.error)
        throw new Error('Invalid rows')
    }

    const dynamicSchema = generateSchema(tableConfigResult.data.columnMeta)

    try {
        dataRowsResult.data.forEach(row => {
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
    const fetcher = useFetcher()

    const { tableConfig, rows } = useLoaderData<typeof loader>()
    const [rowsState, setRowsState] = useState(rows)

    const isDirty = JSON.stringify(rowsState) !== JSON.stringify(rows)

    const rowCreate = () => {
        const newRow: webieRowData = {
            _id: new ObjectId().toString(),
            ...tableConfig.columnMeta.reduce(
                (acc: { [columnId: string]: any }, column) => {
                    let defaultValue: unknown
                    switch (column.type) {
                        case 'string':
                            defaultValue = ''
                            break
                        case 'number':
                            defaultValue = 0
                            break
                        case 'boolean':
                            defaultValue = false
                            break
                        case 'date':
                            defaultValue = new Date().toISOString()
                            break
                        default:
                            defaultValue = null
                    }
                    acc[column._id] = defaultValue
                    return acc
                },
                {}
            ),
        }
        setRowsState(prevRows => [...prevRows, newRow])
    }

    const rowUpdate = (updateRow: webieRowData) => {
        setRowsState(prevRows =>
            prevRows.map(row => (row._id === updateRow._id ? updateRow : row))
        )
    }

    const rowDelete = (deleteRow: webieRowData) => {
        setRowsState(prevRows =>
            prevRows.filter(row => row._id !== deleteRow._id)
        )
    }

    return (
        <div className="h-full flex flex-col p-3 gap-2">
            {/* TODO: page */}

            <fetcher.Form
                id="rowDataForm"
                onSubmit={e => {
                    e.preventDefault()

                    const formData = new FormData(e.currentTarget)

                    const tableConfigString = JSON.stringify(tableConfig)
                    const rowsString = JSON.stringify(rowsState)
                    formData.set('tableConfig', tableConfigString)
                    formData.set('rows', rowsString)

                    fetcher.submit(formData, {
                        method: 'POST',
                    })
                }}
            />

            <ToolBar
                tableConfig={tableConfig}
                isDirty={isDirty}
                createRow={rowCreate}
            />

            <div className="flex-grow">
                <DataGrid
                    tableConfig={tableConfig}
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

const processFormData = async (
    tableConfigString: FormDataEntryValue | null,
    rowsString: FormDataEntryValue | null
) => {
    if (!tableConfigString || typeof tableConfigString !== 'string') {
        throw new Error('Invalid tableConfig')
    }

    if (!rowsString || typeof rowsString !== 'string') {
        throw new Error('Invalid rows')
    }

    let tableConfig
    let rows
    try {
        tableConfig = JSON.parse(tableConfigString)
        rows = JSON.parse(rowsString)
        return { tableConfig, rows }
    } catch (e) {
        throw new Error('Invalid JSON')
    }
}
