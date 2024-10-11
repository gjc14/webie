import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'

import { DataGrid } from '../components/data-grid'
import { ToolBarEditMode } from '../components/table/tool-bar'
import { getTableConfig } from '../lib/db/table.server'
import { useTable } from '../lib/hooks/table'
import { generateNewColumn } from '../lib/utils'
import {
    webieColDef,
    webieColDefSchema,
    webieColType,
    webieTableConfigSchema,
} from '../schema/table'
import { ColumnSettings } from './components/column-settings'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()

    const tableConfigString = formData.get('tableConfig')

    if (!tableConfigString || typeof tableConfigString !== 'string') {
        throw new Error('Invalid tableConfig')
    }

    let tableConfig
    try {
        tableConfig = JSON.parse(tableConfigString)
    } catch (e) {
        throw new Error('Invalid JSON')
    }

    // Validate new tableConfig
    const tableConfigResult = webieTableConfigSchema.safeParse(tableConfig)

    if (!tableConfigResult.success) {
        console.log('error:', tableConfigResult.error)
        throw new Error('Invalid table config')
    }

    // Validate schema
    try {
        tableConfigResult.data.columns.forEach((col: webieColDef) => {
            const { success, error } = webieColDefSchema.safeParse(col)
            if (!success) {
                console.error('Invalid column:', error)
                throw new Error('Invalid column')
            }
        })
        return json({ msg: 'Saved successfully' })
    } catch (e: any) {
        console.log('Validation failed:', e.errors)
        return json({ err: 'Validation failed' }, { status: 400 })
    }
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    if (!params.table) {
        throw new Response('Bad Request', { status: 400 })
    }

    // If user came from table page, pass null, no need to fetch data
    const referer = request.headers.get('referer')
    if (referer) {
        const routes = referer.split('/')
        const lastRoute = routes[routes.length - 1]
        if (lastRoute === params.table) {
            return null
        }
    }

    const tableConfig = await getTableConfig(params.table)

    return json({ tableConfig })
}

export default function DBTableEdit() {
    const { tableConfigState, setTableConfig, isTableConfigDirty } = useTable()

    const createColumn = (type: webieColType) => {
        const newColumn = generateNewColumn(type)
        setTableConfig({
            ...tableConfigState,
            columns: [...tableConfigState.columns, newColumn],
        })
    }

    return (
        <div className="h-full flex flex-col p-3 gap-2">
            <ToolBarEditMode
                isDirty={isTableConfigDirty}
                createColumn={createColumn}
            />

            <div className="flex-grow">
                <DataGrid
                    tableConfig={tableConfigState}
                    rows={[]}
                    onColumnUpdate={e => console.log(e)}
                    onColumnDelete={e => console.log(e)}
                    settingMode={true}
                />
            </div>

            <ColumnSettings />
        </div>
    )
}
