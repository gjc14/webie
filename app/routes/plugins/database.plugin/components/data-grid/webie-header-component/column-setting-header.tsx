import { CustomHeaderProps } from 'ag-grid-react'
import { Settings } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '~/components/ui/button'
import { useTable } from '../../../lib/hooks/table'

export interface CustomColumnSettingHeaderProps extends CustomHeaderProps {}

export const CustomColumnSettingHeader = (
    props: CustomColumnSettingHeaderProps
) => {
    const refButton = useRef(null)
    const { columnSelected, setColumnSelected } = useTable()
    const thisColumnIsSelected = columnSelected?._id === props.column.getColId()

    const isCustomColumn = props.column.getUserProvidedColDef()

    const onSettingClicked = () => {
        setColumnSelected(props.column.getColId())
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
                {props.displayName}
            </button>

            {/* Setting Button */}
            {isCustomColumn && (
                <>
                    <Button
                        ref={refButton}
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
