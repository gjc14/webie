import { CustomHeaderProps } from 'ag-grid-react'
import {
    ArrowDown,
    ArrowUp,
    Filter,
    Maximize2,
    Plus,
    Settings,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { PopoverClose } from '@radix-ui/react-popover'
import { Button } from '~/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { useTable } from '../../../lib/hooks/table'
import { ColumnTypePopover } from '../../table/tool-bar/column-type-popover'
import { supportedTypes } from '../../table/type-selector'
import { ColumnSettings } from '../column-settings'
import { webieDefinedColumns } from '../webie-system-columns'

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
    const { tableConfigState, addColumn, setColDefEditing } = useTable()

    const thisColumnId: webieDefinedColumns | string = props.column.getColId()
    const thisColumnConfig = tableConfigState.columns.find(
        column => column._id === thisColumnId
    )
    const thisColumnTypeButton = supportedTypes.find(
        type => type.value === thisColumnConfig?.type
    )

    const isCustomColumn =
        props.column.getUserProvidedColDef() && !thisColumnId.startsWith('_')

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
                <ColumnTypePopover
                    onTypeSelect={type => addColumn(type)}
                    side="right"
                >
                    <Button
                        variant={'ghost'}
                        className="h-fit w-fit p-[5px] rounded-sm"
                    >
                        <Plus size={16} />
                    </Button>
                </ColumnTypePopover>
            )
        } else if (thisColumnId === '_openRow') {
            return (
                <span className="w-full flex justify-center">
                    <Maximize2 size={16} />
                </span>
            )
        }
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
            {isCustomColumn &&
                ColumnSettingPopover({
                    onTriggered: () =>
                        setColDefEditing(thisColumnConfig ?? null),
                })}
        </span>
    )
}

const ColumnSettingPopover = ({ onTriggered }: { onTriggered: () => void }) => {
    const triggerRef = useRef<HTMLButtonElement>(null)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'ghost'}
                    className="h-fit w-fit p-[5px] rounded-sm"
                    onClick={() => onTriggered()}
                >
                    <Settings size={16} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="right"
                className="w-96 max-h-[88vh] mt-5 overflow-auto"
            >
                <PopoverClose ref={triggerRef} hidden />
                <ColumnSettings
                    onFinished={() => triggerRef.current?.click()}
                />
            </PopoverContent>
        </Popover>
    )
}
