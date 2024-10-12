import { themeQuartz } from '@ag-grid-community/theming'

import { useRevalidator } from '@remix-run/react'
import { ColDef, GetRowIdParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { parse } from 'cookie'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'

import { subscribeToSchemeChange } from '~/lib/client-hints/color-schema'
import { customThemeCookieName, useTheme } from '~/lib/hooks/theme-provider'
import { useCookieTheme } from '~/lib/hooks/use-cookie-theme'
import { useTable } from '../../lib/hooks/table'
import { webieColDef, webieRowData, webieTableConfig } from '../../schema/table'
import {
    checkCircular,
    generateCustomLogic,
    handleCellValueChanged,
} from './utils'
import { CustomFilterSortSettingHeader } from './webie-header-component/filter-sort-setting-header'
import { getWebieDefinedColumns } from './webie-system-columns'

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

export interface webieDataGridProps {}

export const DataGrid = forwardRef<AgGridReact>(
    (props: webieDataGridProps, ref) => {
        const {
            tableConfigState,
            rowsState,
            settingSelectedColumn,
            updateRow,
        } = useTable()

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
                    themeContext.theme === 'light'
                        ? customTheme
                        : customDarkTheme
                )
            }
        }, [themeContext])

        // Column Definitions: Defines the columns to be displayed.
        // keyof webieRowData will map to the field (column ID)Ｏ
        const [colDefs, setColDefs] = useState<ColDef<webieRowData>[]>([])

        const typeCalcColumns = useMemo(() => {
            const calcColumns = tableConfigState.columns.filter(
                column => column.type === 'calc'
            )
            const circulatedColumns = checkCircular(calcColumns)
            return { calcColumns, circulatedColumns }
        }, [tableConfigState.columns])

        const getCustomLogic = useMemo(
            () => (column: webieColDef) => {
                return generateCustomLogic(
                    column,
                    typeCalcColumns.calcColumns,
                    typeCalcColumns.circulatedColumns
                )
            },
            [tableConfigState.columns]
        )

        const webieProvidedColumns = getWebieDefinedColumns()

        useEffect(() => {
            setColDefs([
                { ...webieProvidedColumns._id },
                { ...webieProvidedColumns._openRow },

                ...mappedColumns(tableConfigState),
                { ...webieProvidedColumns._addColumn },
            ])
        }, [tableConfigState, settingSelectedColumn])

        const mappedColumns = useCallback(
            (tableConfigState: webieTableConfig): ColDef<webieRowData>[] => {
                return tableConfigState.columns.map(column => {
                    return {
                        headerName: column.headerName,
                        field: column._id,
                        editable: settingSelectedColumn
                            ? false
                            : column.editable,
                        filter: settingSelectedColumn ? false : column.filter,
                        sortable: settingSelectedColumn
                            ? false
                            : column.sortable,
                        width: column.width,
                        onCellValueChanged: e => {
                            const updateValue = handleCellValueChanged({
                                e,
                                column,
                            })
                            if (updateValue) updateRow(updateValue)
                        },
                        valueGetter:
                            column.valueGetterCustomLogic !== undefined // For type calc columns
                                ? p => {
                                      const customLogic = getCustomLogic(column)
                                      const row = p.data
                                      const chain = p.getValue

                                      return customLogic(row, chain)
                                  }
                                : undefined,

                        headerComponentParams: {},
                    }
                })
            },
            [tableConfigState]
        )

        const getRowId = useCallback(
            (params: GetRowIdParams<webieRowData>) => params.data._id,
            []
        )

        const customHeaderComponents = useMemo<{
            [p: string]: any
        }>(() => {
            return {
                agColumnHeader: CustomFilterSortSettingHeader,
            }
        }, [settingSelectedColumn])

        return (
            <div className="h-full">
                <AgGridReact
                    ref={ref}
                    rowSelection={{
                        mode: 'multiRow',
                        enableClickSelection: true,
                    }}
                    rowData={rowsState}
                    columnDefs={colDefs}
                    components={customHeaderComponents}
                    getRowId={getRowId}
                    pagination={true}
                    onColumnMoved={e => {
                        // TODO: Implement column reordering
                        console.log(e)
                    }}
                    theme={gridTheme}
                    loadThemeGoogleFonts={true}
                />
            </div>
        )
    }
)
