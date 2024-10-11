import { CustomHeaderProps } from 'ag-grid-react'
import { ArrowDown, ArrowUp, Filter, Plus, Settings2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip'
import { useTable } from '../../../lib/hooks/table'
import { AddColumnPopover } from '../../table/tool-bar/add-column'
import { supportedTypes } from '../../table/type-selector'
import { webieDefinedColumns } from '../webie-system-column'

export interface CustomFilterSortHeaderProps extends CustomHeaderProps {}

export const CustomFilterSortHeader = (props: CustomFilterSortHeaderProps) => {
    const refButton = useRef(null)
    const [sort, setSort] = useState<ReturnType<typeof props.column.getSort>>()

    const { tableConfigState, addColumn } = useTable()
    const thisColumnId: webieDefinedColumns | string = props.column.getColId()
    const thisColumnConfig = tableConfigState.columns.find(
        column => column._id === thisColumnId
    )
    const columnType = supportedTypes.find(
        type => type.value === thisColumnConfig?.type
    )
    const isCustomColumn =
        props.column.getUserProvidedColDef() && !thisColumnId.startsWith('_')

    const onFilterClicked = () => {
        props.showColumnMenu(refButton.current!)
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

    if (!isCustomColumn) {
        if (thisColumnId === '_addColumn') {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipContent className="bg-primary-foreground text-primary border border-primary/20">
                            Add a new column
                        </TooltipContent>

                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            )
        } else if (thisColumnId === '_actions') {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipContent className="bg-primary-foreground text-primary border border-primary/20">
                            Manage your column
                        </TooltipContent>

                        <TooltipTrigger asChild>
                            <span className="w-full flex justify-center">
                                <Settings2 size={16} />
                            </span>
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    }

    return (
        <span className="w-full h-full flex items-center justify-end">
            {/* Column Name and Sort Function */}
            <button
                className={`w-full h-full text-start flex items-center gap-2 ${
                    !props.enableSorting && 'cursor-default'
                }`}
                onClick={e => {
                    props.enableSorting && onSortRequested(e)
                }}
            >
                {isCustomColumn && columnType && <columnType.icon size={14} />}
                {props.displayName}
                {sortIndicator}
            </button>

            {/* Filter Button */}
            {props.enableFilterButton && (
                <Button
                    ref={refButton}
                    variant={'ghost'}
                    className="h-fit w-fit p-[5px] rounded-sm"
                    onClick={onFilterClicked}
                >
                    <Filter size={16} />
                </Button>
            )}
        </span>
    )
}
