import { CustomHeaderProps } from 'ag-grid-react'
import { ArrowDown, ArrowUp, Filter } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'

export interface CustomFilterSortHeaderProps extends CustomHeaderProps {}

export const CustomFilterSortHeader = (props: CustomFilterSortHeaderProps) => {
    const refButton = useRef(null)
    const [sort, setSort] = useState<ReturnType<typeof props.column.getSort>>()

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
