import { themeQuartz } from '@ag-grid-community/theming'

import { useRevalidator } from '@remix-run/react'
import { ColDef, GetRowIdParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { parse } from 'cookie'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { subscribeToSchemeChange } from '~/lib/client-hints/color-schema'
import { customThemeCookieName, useTheme } from '~/lib/hooks/theme-provider'
import { useCookieTheme } from '~/lib/hooks/use-cookie-theme'
import { webieRowData, webieTableConfig } from '../../schema/table'
import { CustomColumnSettingHeader } from './custom-header/column-setting-header'
import { CustomFilterSortHeader } from './custom-header/filter-sort-header'

const customTheme = themeQuartz.withParams({
    accentColor: '#51B1FF',
    browserColorScheme: 'inherit',
    columnBorder: false,
    fontFamily: {
        googleFont: 'Open Sans',
    },
    headerFontSize: 14,
    sidePanelBorder: true,
    wrapperBorder: true,
})

const customDarkTheme = themeQuartz.withParams({
    backgroundColor: '#090F16',
    browserColorScheme: 'dark',
    chromeBackgroundColor: {
        ref: 'foregroundColor',
        mix: 0.07,
        onto: 'backgroundColor',
    },
    fontFamily: {
        googleFont: 'Open Sans',
    },
    foregroundColor: '#FFF',
    headerBackgroundColor: '#1A1C22',
    headerFontSize: 14,
})

export interface webieDataGridProps {
    tableConfig: webieTableConfig
    rows: webieRowData[]
    onRowUpdate?: (row: webieRowData) => void
    onRowDelete?: (row: webieRowData) => void
    onColumnUpdate?: (column: webieTableConfig) => void
    onColumnDelete?: (column: webieTableConfig) => void
    settingMode?: boolean
}

export const DataGrid = (props: webieDataGridProps) => {
    const {
        tableConfig,
        rows,
        onRowUpdate,
        onRowDelete,
        onColumnUpdate,
        onColumnDelete,
        settingMode,
    } = props

    // Theme: Sets the theme for the data grid based on Client Hints
    const { revalidate } = useRevalidator()
    const cookieTheme = useCookieTheme()
    const [gridTheme, setGridTheme] = useState(
        cookieTheme === 'light' ? customTheme : customDarkTheme
    )
    const themeContext = useTheme()
    useEffect(() => {
        subscribeToSchemeChange(theme => {
            // Do not set theme if custom theme is set
            const cookieHeader = document.cookie
            const parsedCustomTheme =
                cookieHeader && parse(cookieHeader)[customThemeCookieName]
            if (parsedCustomTheme) return revalidate()

            // Set theme to system theme
            setGridTheme(theme === 'dark' ? customDarkTheme : customTheme)
        })
    }, [])
    useEffect(() => {
        if (themeContext) {
            setGridTheme(
                themeContext.theme === 'light' ? customTheme : customDarkTheme
            )
        }
    }, [themeContext])

    // Column Definitions: Defines the columns to be displayed.
    // keyof webieRowData will map to the field (column ID)
    const mappedColumns = useCallback(
        (tableConfig: webieTableConfig): ColDef<webieRowData>[] => {
            return tableConfig.columnMeta.map(column => {
                return {
                    headerName: column.headerName,
                    field: column._id,
                    editable: settingMode ? false : column.editable,
                    filter: settingMode ? false : column.filter,
                    sortable: settingMode ? false : column.sortable,
                    onCellValueChanged: e => {
                        const updatedRow = e.data
                        console.log(updatedRow)

                        onRowUpdate?.(updatedRow)
                    },
                    headerComponentParams: {},
                }
            })
        },
        [tableConfig]
    )

    const [colDefs, setColDefs] = useState<ColDef<webieRowData>[]>([
        {
            headerName: 'ID',
            field: '_id',
            editable: settingMode && false,
            filter: settingMode && false,
            sortable: settingMode && false,
        },
        ...mappedColumns(tableConfig),
    ])

    useEffect(() => {
        setColDefs([
            {
                headerName: 'ID',
                field: '_id',
                editable: settingMode && false,
                filter: settingMode && false,
                sortable: settingMode && false,
            },
            ...mappedColumns(tableConfig),
        ])
    }, [tableConfig])

    const getRowId = useCallback(
        (params: GetRowIdParams<webieRowData>) => params.data._id,
        []
    )

    const customHeaderComponents = useMemo<{
        [p: string]: any
    }>(() => {
        return {
            agColumnHeader: settingMode
                ? CustomColumnSettingHeader
                : CustomFilterSortHeader,
        }
    }, [settingMode])

    return (
        <div className="h-full">
            <AgGridReact
                rowSelection={{ mode: 'multiRow', enableClickSelection: true }}
                rowData={rows}
                columnDefs={colDefs}
                components={customHeaderComponents}
                getRowId={getRowId}
                pagination={true}
                onColumnMoved={e => {
                    console.log(e)
                }}
                theme={gridTheme}
                loadThemeGoogleFonts={true}
            />
        </div>
    )
}
