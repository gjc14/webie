import { themeQuartz } from '@ag-grid-community/theming'

import { useRevalidator } from '@remix-run/react'
import { ColDef, GetRowIdParams, NewValueParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { parse } from 'cookie'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { subscribeToSchemeChange } from '~/lib/client-hints/color-schema'
import { customThemeCookieName, useTheme } from '~/lib/hooks/theme-provider'
import { useCookieTheme } from '~/lib/hooks/use-cookie-theme'
import { useTable } from '../../lib/hooks/table'
import { webieColDef, webieRowData, webieTableConfig } from '../../schema/table'
import { CustomFilterSortSettingHeader } from './webie-header-component/filter-sort-setting-header'
import { getWebieDefinedColumns } from './webie-system-column'
import { generateColumnSchema } from '../../lib/utils'
import { toast } from 'sonner'
import { supportedTypes } from '../table/type-selector'

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

export const DataGrid = (props: webieDataGridProps) => {
    const { tableConfigState, rowsState, settingSelectedColumn, updateRow } =
        useTable()

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
    const [colDefs, setColDefs] = useState<ColDef<webieRowData>[]>([])

    const webieProvidedColumns = getWebieDefinedColumns()

    useEffect(() => {
        setColDefs([
            ...(!settingSelectedColumn
                ? [{ ...webieProvidedColumns._id }]
                : []),
            ...(!settingSelectedColumn
                ? [{ ...webieProvidedColumns._actions }]
                : []),

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
                    editable: settingSelectedColumn ? false : column.editable,
                    filter: settingSelectedColumn ? false : column.filter,
                    sortable: settingSelectedColumn ? false : column.sortable,
                    onCellValueChanged: e => {
                        const updateValue = handleCellValueChanged({
                            e,
                            column,
                        })
                        if (updateValue) updateRow(updateValue)
                    },
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
                rowSelection={{ mode: 'multiRow', enableClickSelection: true }}
                rowData={settingSelectedColumn ? [] : rowsState}
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

function handleCellValueChanged({
    e,
    column,
}: {
    e: NewValueParams<webieRowData>
    column: webieColDef
}) {
    const updatedRowTarget = e.data
    const dynamicSchema = generateColumnSchema(column)
    const validate = dynamicSchema.safeParse(e.newValue)

    if (!validate.success) {
        console.log(
            'error:',
            validate.error.issues.map(i => i.message)
        )
        const supportedType = supportedTypes.find(
            type => type.value === column.type
        )
        toast.error(`Invalid value for ${supportedType?.label}`)
        e.node?.setDataValue(column._id, e.oldValue)
        return false
    } else {
        return updatedRowTarget
    }
}
