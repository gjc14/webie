import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    SerializeFrom,
} from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'

import { DataGrid } from '../components/data-grid'
import { ToolBar } from '../components/table/tool-bar'
import { getTableConfig, getTableData } from '../lib/db/table.server'
import { useTable } from '../lib/hooks/table'
import { validateRows } from './action.server'

/**
 * Get tableConfig from the database, rows from request form data (frontend state)
 */
export const action = async ({ request, params }: ActionFunctionArgs) => {
    if (!params.table) {
        throw new Response('Bad Request', { status: 400 })
    }
    const tableConfig = await getTableConfig(params.table) // Get table config from the database
    const formData = await request.formData()

    try {
        await validateRows(formData.get('rows'), tableConfig)
        return json({ msg: 'Saved successfully' })
    } catch (error) {
        console.log('Error saving rows:', error)
        return json({ err: 'Rows validation failed' }, { status: 400 })
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
    const loaderData = useLoaderData<typeof loader>()
    const { setDBState, rowsState } = useTable()

    useEffect(() => {
        // Every time the loaderData changes (revalidated), update the tableConfig and rows to state
        setDBState(loaderData.tableConfig, loaderData.rows)
    }, [loaderData])

    const onSaveRows = async () => {
        fetcher.submit(
            { rows: JSON.stringify(rowsState) },
            {
                method: 'POST',
            }
        )
    }

    return (
        <div className="h-full flex flex-col p-3 gap-2">
            <ToolBar onSaveRows={onSaveRows} />

            <div className="flex-grow">
                <DataGrid />
            </div>
        </div>
    )
}
