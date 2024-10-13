import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    SerializeFrom,
} from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import { AgGridReact } from 'ag-grid-react'
import { DataGrid } from '../components/data-grid'
import { ToolBar, ToolBarEditMode } from '../components/table/tool-bar'
import { getTableConfig, getTableData } from '../lib/db/table.server'
import { useTable } from '../lib/hooks/table'
import { webieRowData } from '../schema/table'
import { validateRows } from './action.server'
import { ColumnSettings } from './components/column-settings'

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
    const gridRef = useRef<AgGridReact<webieRowData>>(null)
    const loaderData = useLoaderData<typeof loader>()
    const {
        setDBState,
        rowsState,
        settingSelectedColumn,
        setSettingSelectedColumn,
    } = useTable()

    useEffect(() => {
        // Every time the loaderData changes (revalidated), update the tableConfig and rows to state
        setDBState(loaderData.tableConfig, loaderData.rows)
        setSettingSelectedColumn(null)
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
            {settingSelectedColumn ? (
                <ToolBarEditMode gridRef={gridRef} />
            ) : (
                <ToolBar gridRef={gridRef} onSaveRows={onSaveRows} />
            )}

            <div className="flex-grow">
                <DataGrid ref={gridRef} />
            </div>

            <ColumnSettings />
        </div>
    )
}
