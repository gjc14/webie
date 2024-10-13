import { themeQuartz } from '@ag-grid-community/theming'

import { useRevalidator } from '@remix-run/react'
import { ColDef, GetRowIdParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { parse } from 'cookie'
import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { subscribeToSchemeChange } from '~/lib/client-hints/color-schema'
import { customThemeCookieName, useTheme } from '~/lib/hooks/theme-provider'
import { useCookieTheme } from '~/lib/hooks/use-cookie-theme'
import { useTable } from '../../lib/hooks/table'
import { webieColDef, webieRowData, webieTableConfig } from '../../schema/table'
import { GridToolTip } from '../db-tooltip'
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

export const DataGrid = forwardRef<AgGridReact<webieRowData>>(
    (props: webieDataGridProps, ref) => {
        const { tableConfigState, rowsState, updateRow } = useTable()

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
        }, [tableConfigState])

        const mappedColumns = useCallback(
            (tableConfigState: webieTableConfig): ColDef<webieRowData>[] => {
                return tableConfigState.columns.map(column => {
                    return {
                        colId: column._id,
                        field: column._id,
                        headerName: column.headerName,
                        editable: column.editable,
                        filter: column.filter,
                        sortable: column.sortable,
                        width: column.width,
                        onCellValueChanged: e => {
                            const updateValue = handleCellValueChanged({
                                e,
                                column,
                            })
                            if (updateValue) updateRow(updateValue)
                        },
                        // cellRenderer: column.cellRenderer,
                        valueGetter:
                            column.valueGetterCustomLogic !== undefined // For type calc columns
                                ? p => {
                                      const customLogic = getCustomLogic(column)
                                      const row = p.data
                                      const chain = p.getValue

                                      return customLogic(row, chain)
                                  }
                                : undefined,
                        // valueFormatter: column.valueFormatter,
                        headerComponentParams: {},
                        tooltipField: '_id', // The _id column of the row instead of column._id itself
                    }
                })
            },
            [tableConfigState]
        )

        const getRowId = useCallback((params: GetRowIdParams<webieRowData>) => {
            return params.data._id
        }, [])

        const customHeaderComponents = useMemo<{
            [p: string]: any
        }>(() => {
            return {
                agColumnHeader: CustomFilterSortSettingHeader,
            }
        }, [])

        const defaultColDef = useMemo<ColDef>(() => {
            return {
                tooltipComponent: memo(GridToolTip),
            }
        }, [])

        return (
            <div className="h-full">
                <AgGridReact<webieRowData>
                    ref={ref}
                    defaultColDef={defaultColDef}
                    rowSelection={{
                        mode: 'multiRow',
                        enableClickSelection: true,
                    }}
                    rowData={rowsState}
                    columnDefs={colDefs}
                    components={customHeaderComponents}
                    getRowId={getRowId}
                    pagination={true}
                    paginationPageSize={20}
                    paginationPageSizeSelector={[
                        10, 20, 50, 100, 200, 500, 1000,
                    ]}
                    tooltipInteraction={true}
                    tooltipShowDelay={1000}
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
