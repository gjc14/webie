import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { DataGrid } from '../_webie.db/components/data-grid'
import { getTableConfig, getTableData } from '../_webie.db/lib/db/table.server'
import { generateSchema } from '../_webie.db/lib/utils'
import {
    webieColDef,
    webieRowData,
    webieRowDataSchema,
    webieTableConfigSchema,
} from '../_webie.db/schema/table'
import { ThemeToggle } from '~/components/theme-toggle'

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

export default function DBTable() {
    const { tableConfig, rows } = useLoaderData<typeof loader>()
    const fetcher = useFetcher()
    const [tableConfigState, setTableConfigState] = useState(tableConfig)
    const [rowsState, setRowsState] = useState(rows)

    const rowCreate = () => {
        const newRow: webieRowData = {
            _id: 'new-row-' + Math.random().toString(36).substring(2, 9),
            ...tableConfigState.columnMeta.reduce(
                (acc: { [columnId: string]: any }, column) => {
                    acc[column._id] = null
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

    const columnCreate = () => {
        setTableConfigState(prevConfig => {
            const newColumn: webieColDef = {
                _id: 'new-col-' + Math.random().toString(36).substring(2, 9),
                type: 'string',
                headerName: 'New Column',
                editable: true,
                filter: true,
                sortable: true,
            }
            return {
                ...prevConfig,
                columnMeta: [...prevConfig.columnMeta, newColumn],
            }
        })
    }

    return (
        <div className="h-full flex flex-col p-3 gap-2">
            {/* TODO: page */}

            <fetcher.Form
                className="h-fit flex gap-1.5"
                onSubmit={e => {
                    e.preventDefault()

                    const formData = new FormData(e.currentTarget)

                    const tableConfig = JSON.stringify(tableConfigState)
                    const rows = JSON.stringify(rowsState)
                    formData.set('tableConfig', tableConfig)
                    formData.set('rows', rows)

                    fetcher.submit(formData, {
                        method: 'POST',
                    })
                }}
            >
                <div className="w-full h-full flex p-1 bg-primary-foreground rounded-md border border-border">
                    <Button size={'sm'} variant={'ghost'}>
                        Save
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        type="button"
                        onClick={rowCreate}
                    >
                        Add Row
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        type="button"
                        onClick={columnCreate}
                    >
                        Add Column
                    </Button>

                    <ThemeToggle size="sm" className="ml-auto mr-3" />
                </div>
            </fetcher.Form>

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
