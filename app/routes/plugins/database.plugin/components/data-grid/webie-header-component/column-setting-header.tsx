import { CustomHeaderProps } from 'ag-grid-react'
import { Plus, Settings } from 'lucide-react'

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

export interface CustomColumnSettingHeaderProps extends CustomHeaderProps {}

export const CustomColumnSettingHeader = (
    props: CustomColumnSettingHeaderProps
) => {
    const { columnSelected, setColumnSelected, tableConfigState, addColumn } =
        useTable()
    const thisColumnId: webieDefinedColumns | string = props.column.getColId()
    const thisColumnIsSelected = columnSelected?._id === thisColumnId
    const thisColumnConfig = tableConfigState.columns.find(
        column => column._id === thisColumnId
    )
    const columnType = supportedTypes.find(
        type => type.value === thisColumnConfig?.type
    )

    const isCustomColumn =
        props.column.getUserProvidedColDef() && !thisColumnId.startsWith('_')

    const onSettingClicked = () => {
        setColumnSelected(thisColumnId)
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
        }
    }

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
                {isCustomColumn && columnType && <columnType.icon size={14} />}
                {props.displayName}
            </button>

            {/* Setting Button */}
            {isCustomColumn && (
                <>
                    <Button
                        variant={'ghost'}
                        className="h-fit w-fit p-[5px] rounded-sm"
                    >
                        <Settings size={16} />
                    </Button>
                </>
            )}
        </span>
    )
}
