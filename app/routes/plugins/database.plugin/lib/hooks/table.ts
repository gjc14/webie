import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { webieColDef, webieRowData, webieTableConfig } from '../../schema/table'

type TableState = {
    db?: {
        tableConfig: webieTableConfig
        rows: webieRowData[]
    }
    tableConfigState: webieTableConfig
    rowsState: webieRowData[]
    isRowsDirty: boolean
    isTableConfigDirty: boolean
    columnSelected: webieColDef | null
}

type Action = {
    setDBState: (tableConfig: webieTableConfig, rows: webieRowData[]) => void
    getDBState: () =>
        | { tableConfig: webieTableConfig; rows: webieRowData[] }
        | undefined

    setTableConfig: (tableConfig: webieTableConfig) => void
    setRows: (rows: webieRowData[]) => void

    setTableConfigDirty: (isDirty: boolean) => void
    setRowsDirty: (isDirty: boolean) => void

    setColumnSelected: (columnId: string) => void

    resetTableConfig: () => void
    resetRows: () => void
    resetTable: () => void
}

const initialState: TableState = {
    db: undefined,
    tableConfigState: {
        _id: '',
        table: '',
        settings: {
            autoSave: false,
        },
        columns: [],
    },
    rowsState: [],
    isRowsDirty: false,
    isTableConfigDirty: false,
    columnSelected: null,
}

export const useTable = create(
    persist<TableState & Action>(
        (set, get) => ({
            db: initialState.db,
            tableConfigState: initialState.tableConfigState,
            rowsState: initialState.rowsState,
            isRowsDirty: initialState.isRowsDirty,
            isTableConfigDirty: initialState.isTableConfigDirty,
            columnSelected: initialState.columnSelected,

            setDBState(tableConfig, rows) {
                set({
                    db: {
                        tableConfig: JSON.parse(JSON.stringify(tableConfig)),
                        rows: JSON.parse(JSON.stringify(rows)),
                    },
                    tableConfigState: tableConfig,
                    rowsState: rows,
                    isRowsDirty: false,
                    isTableConfigDirty: false,
                    columnSelected: null,
                })
            },
            getDBState() {
                return get().db
            },

            setTableConfig(tableConfig) {
                console.log(JSON.stringify(tableConfig))
                console.log(JSON.stringify(get().db?.tableConfig))
                const isTableConfigDirty =
                    JSON.stringify(tableConfig) !==
                    JSON.stringify(get().db?.tableConfig)
                set({ tableConfigState: tableConfig, isTableConfigDirty })
            },
            setRows(rows) {
                const isRowsDirty =
                    JSON.stringify(rows) !== JSON.stringify(get().db?.rows)
                set({ rowsState: rows, isRowsDirty })
            },

            setTableConfigDirty(isDirty: boolean) {
                set({ isTableConfigDirty: isDirty })
            },
            setRowsDirty(isDirty: boolean) {
                set({ isRowsDirty: isDirty })
            },

            setColumnSelected(columnId) {
                const columnSelected = get().tableConfigState.columns.find(
                    c => c._id === columnId
                )
                set({ columnSelected })
            },

            resetTableConfig() {
                set({
                    tableConfigState: get().db?.tableConfig,
                    isTableConfigDirty: false,
                })
            },
            resetRows() {
                set({ rowsState: get().db?.rows, isRowsDirty: false })
            },
            resetTable() {
                set(initialState)
            },
        }),
        {
            name: 'db-table', // name of the item in the storage (must be unique)
            // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
)
