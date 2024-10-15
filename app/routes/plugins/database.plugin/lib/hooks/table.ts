/**
 * State management for single table using zustand
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { webieColDef, webieColType } from '../../schema/column'
import { webieRowData, webieTableConfig } from '../../schema/table'
import { generateNewColumn, generateNewRow } from '../utils'

export type TableState = {
    db?: {
        tableConfig: webieTableConfig
        rows: webieRowData[]
    }
    tableConfigState: webieTableConfig
    rowsState: webieRowData[]
    isRowsDirty: boolean
    isTableConfigDirty: boolean

    colDefEditing: webieColDef | null
}

export type Action = {
    setDBState: (tableConfig: webieTableConfig, rows: webieRowData[]) => void
    getDBState: () =>
        | { tableConfig: webieTableConfig; rows: webieRowData[] }
        | undefined

    // CUD operations on columns
    setTableConfig: (tableConfig: webieTableConfig) => void
    addColumn: (type: webieColType) => void
    updateColumn: (column: webieColDef) => void
    deleteColumn: (column: webieColDef) => void
    setColDef: (column: webieColDef) => void

    // CUD operations on rows
    setRows: (rows: webieRowData[]) => void
    addRow: () => void
    updateRow: (row: webieRowData) => void
    deleteRow: (rows: webieRowData) => void

    setTableConfigDirty: (isDirty: boolean) => void
    setRowsDirty: (isDirty: boolean) => void

    setColDefEditing: (column: webieColDef | null) => void

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
    colDefEditing: null,
}

export const useTable = create(
    persist<TableState & Action>(
        (set, get) => ({
            db: initialState.db,
            tableConfigState: initialState.tableConfigState,
            rowsState: initialState.rowsState,
            isRowsDirty: initialState.isRowsDirty,
            isTableConfigDirty: initialState.isTableConfigDirty,
            colDefEditing: initialState.colDefEditing,

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
                    colDefEditing: null,
                })
            },
            getDBState() {
                return get().db
            },

            /////////////////////////////////////////////
            // Functions for CUD operations on columns //
            /////////////////////////////////////////////
            setTableConfig(tableConfig) {
                const isTableConfigDirty =
                    JSON.stringify(tableConfig) !==
                    JSON.stringify(get().db?.tableConfig)
                set({ tableConfigState: tableConfig, isTableConfigDirty })
            },
            addColumn(type) {
                const tableConfigState = get().tableConfigState
                const newColumns = [
                    ...tableConfigState.columns,
                    generateNewColumn(type),
                ]
                const newTableConfig = {
                    ...tableConfigState,
                    columns: newColumns,
                }

                get().setTableConfig(newTableConfig)
            },
            updateColumn(column) {
                const tableConfigState = get().tableConfigState
                const newColumns = tableConfigState.columns.map(c =>
                    c._id === column._id ? column : c
                )
                const newTableConfig = {
                    ...tableConfigState,
                    columns: newColumns,
                }

                get().setTableConfig(newTableConfig)
            },
            deleteColumn(column) {
                const tableConfigState = get().tableConfigState
                const newColumns = tableConfigState.columns.filter(
                    c => c._id !== column._id
                )
                const newTableConfig = {
                    ...tableConfigState,
                    columns: newColumns,
                }

                get().setTableConfig(newTableConfig)
                get().setColDefEditing(null)
            },
            setColDef(column) {
                const tableConfigState = get().tableConfigState

                const oldColumns = tableConfigState.columns
                const newColumns = oldColumns.map(c => {
                    if (c._id === column._id) {
                        return column
                    }
                    return c
                })

                set({
                    tableConfigState: {
                        ...tableConfigState,
                        columns: newColumns,
                    },
                })
            },

            //////////////////////////////////////////
            // Functions for CUD operations on rows //
            //////////////////////////////////////////
            setRows(rows) {
                const isRowsDirty =
                    JSON.stringify(rows) !== JSON.stringify(get().db?.rows)
                set({ rowsState: rows, isRowsDirty })
            },
            addRow() {
                const tableConfig = get().tableConfigState
                const rows = get().rowsState
                const newRow = generateNewRow(tableConfig)
                const newRows = [newRow, ...rows]

                get().setRows(newRows)
            },
            updateRow(row) {
                const rows = get().rowsState
                const newRows = rows.map(r => (r._id === row._id ? row : r))

                get().setRows(newRows)
            },
            deleteRow(row) {
                const rows = get().rowsState
                const newRows = rows.filter(r => r._id !== row._id)

                get().setRows(newRows)
            },

            setTableConfigDirty(isDirty: boolean) {
                set({ isTableConfigDirty: isDirty })
            },
            setRowsDirty(isDirty: boolean) {
                set({ isRowsDirty: isDirty })
            },

            setColDefEditing(column) {
                set({ colDefEditing: column })
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
