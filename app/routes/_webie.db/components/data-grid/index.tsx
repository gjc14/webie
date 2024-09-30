import { themeQuartz } from '@ag-grid-community/theming'

import { useRevalidator } from '@remix-run/react'
import { ColDef, GetRowIdParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { parse } from 'cookie'
import { Settings } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { subscribeToSchemeChange } from '~/lib/client-hints/color-schema'
import { customThemeCookieName, useTheme } from '~/lib/hooks/theme-provider'
import { useCookieTheme } from '~/lib/hooks/use-cookie-theme'
import { webieRowData, webieTableConfig } from '../../schema/table'

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
}

export const DataGrid = (props: webieDataGridProps) => {
    const {
        tableConfig,
        rows,
        onRowUpdate,
        onRowDelete,
        onColumnUpdate,
        onColumnDelete,
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
    const mappedColumns = (
        tableConfig: webieTableConfig
    ): ColDef<webieRowData>[] => {
        return tableConfig.columnMeta.map(column => {
            return {
                headerName: column.headerName,
                field: column._id,
                editable: column.editable,
                filter: column.filter,
                sortable: column.sortable,
                onCellValueChanged: e => {
                    const updatedRow = e.data
                    console.log(updatedRow)

                    onRowUpdate?.(updatedRow)
                },
            }
        })
    }

    const [colDefs, setColDefs] = useState<ColDef<webieRowData>[]>([
        { headerName: 'ID', field: '_id' },
        ...mappedColumns(tableConfig),
    ])

    useEffect(() => {
        setColDefs([
            { headerName: 'ID', field: '_id' },
            ...mappedColumns(tableConfig),
            {
                headerName: 'test',
                field: 'test',
                headerComponent: CustomColumnHeader,
            },
        ])
    }, [tableConfig])

    const getRowId = useCallback(
        (params: GetRowIdParams<webieRowData>) => params.data._id,
        []
    )

    return (
        <div className="h-full">
            <AgGridReact
                selection={{ mode: 'multiRow', enableClickSelection: true }}
                rowData={rows}
                columnDefs={colDefs}
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

const CustomColumnHeader = () => {
    return (
        <span className="w-full h-full flex items-center justify-between">
            <button className="w-full h-full text-start">Test</button>
            <Button variant={'ghost'} size={'icon'}>
                <Settings size={16} />
            </Button>
        </span>
    )
}
