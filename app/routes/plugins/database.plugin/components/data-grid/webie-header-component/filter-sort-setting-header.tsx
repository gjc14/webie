import { CustomHeaderProps } from 'ag-grid-react'
import {
    ArrowDown,
    ArrowUp,
    Filter,
    Plus,
    Settings,
    Settings2,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import { useTable } from '../../../lib/hooks/table'
import { DBToolTip } from '../../db-tooltip'
import { AddColumnPopover } from '../../table/tool-bar/add-column'
import { supportedTypes } from '../../table/type-selector'
import { webieDefinedColumns } from '../webie-system-column'

export interface CustomFilterSortHeaderProps extends CustomHeaderProps {}

/**
 * This component simply define the layout of different column header type.
 * If your looking for setting columns, please refer to colDefs state when setting <AgGridReact> component
 */
export const CustomFilterSortSettingHeader = (
    props: CustomFilterSortHeaderProps
) => {
    const refFilterButton = useRef(null)
    const [sort, setSort] = useState<ReturnType<typeof props.column.getSort>>()
    const {
        tableConfigState,
        addColumn,
        settingSelectedColumn,
        setSettingSelectedColumn,
    } = useTable()

    const thisColumnId: webieDefinedColumns | string = props.column.getColId()
    const thisColumnConfig = tableConfigState.columns.find(
        column => column._id === thisColumnId
    )
    const thisColumnTypeButton = supportedTypes.find(
        type => type.value === thisColumnConfig?.type
    )

    const thisColumnIsSelected = settingSelectedColumn?._id === thisColumnId
    const isCustomColumn =
        props.column.getUserProvidedColDef() && !thisColumnId.startsWith('_')

    const onSettingClicked = () => {
        setSettingSelectedColumn(thisColumnId)
    }

    const onFilterClicked = () => {
        props.showColumnMenu(refFilterButton.current!)
    }

    const onSortRequested = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        let currentSort = props.column.getSort()
        currentSort = currentSort ?? null

        // Ascending -> Descending -> No Sort
        const nextSort =
            currentSort === 'asc'
                ? 'desc'
                : currentSort === 'desc'
                ? null
                : 'asc'

        props.setSort(nextSort, event.shiftKey)
        setSort(nextSort)
    }

    let sortIndicator = null
    if (props.enableSorting) {
        sortIndicator = (
            <>
                {sort === 'asc' && <ArrowDown size={16} />}
                {sort === 'desc' && <ArrowUp size={16} />}
            </>
        )
    }

    // Check webie system defined columns first
    if (!isCustomColumn) {
        if (thisColumnId === '_addColumn') {
            return (
                <DBToolTip asChild message="Add a new column">
                    <AddColumnPopover
                        onTypeSelect={type => addColumn(type)}
                        side="right"
                    >
                        <Button
                            variant={'ghost'}
                            className="h-fit w-fit p-[5px] rounded-sm"
                        >
                            <Plus size={16} />
                        </Button>
                    </AddColumnPopover>
                </DBToolTip>
            )
        } else if (thisColumnId === '_actions') {
            return (
                <DBToolTip asChild message="Manage your column">
                    <span className="w-full flex justify-center">
                        <Settings2 size={16} />
                    </span>
                </DBToolTip>
            )
        }
    }

    // In setting mode, all header is a button to select the column to show settings
    if (settingSelectedColumn) {
        return (
            <span
                className={`w-full h-full flex items-center justify-end ${
                    thisColumnIsSelected ? 'font-black' : ''
                }`}
                onClick={onSettingClicked}
            >
                {/* Column Name */}
                <button
                    className={`w-full h-full text-start flex items-center gap-2`}
                >
                    {isCustomColumn && thisColumnTypeButton && (
                        <thisColumnTypeButton.icon size={14} />
                    )}
                    {props.displayName}
                </button>
            </span>
        )
    }

    return (
        <span className="w-full h-full flex items-center justify-end gap-0.5">
            {/* Column Name and Sort Function */}
            <button
                className={`w-full h-full text-start flex items-center gap-2 ${
                    !props.enableSorting && 'cursor-default'
                }`}
                onClick={e => {
                    props.enableSorting && onSortRequested(e)
                }}
            >
                {isCustomColumn && thisColumnTypeButton && (
                    <thisColumnTypeButton.icon size={14} />
                )}
                {props.displayName}
                {sortIndicator}
            </button>

            {/* Filter Button */}
            {props.enableFilterButton && (
                <Button
                    ref={refFilterButton}
                    variant={'ghost'}
                    className="h-fit w-fit p-[5px] rounded-sm"
                    onClick={onFilterClicked}
                >
                    <Filter size={16} />
                </Button>
            )}

            {/* Setting Button */}
            {isCustomColumn && (
                <Button
                    variant={'ghost'}
                    className="h-fit w-fit p-[5px] rounded-sm"
                    onClick={onSettingClicked}
                >
                    <Settings size={16} />
                </Button>
            )}
        </span>
    )
}
