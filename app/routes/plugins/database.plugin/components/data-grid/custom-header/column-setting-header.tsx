import { CustomHeaderProps } from 'ag-grid-react'
import { Settings } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '~/components/ui/button'

export interface CustomColumnSettingHeaderProps extends CustomHeaderProps {}

export const CustomColumnSettingHeader = (
    props: CustomColumnSettingHeaderProps
) => {
    const refButton = useRef(null)
    const isCustomColumn = props.column.getUserProvidedColDef()

    const onSettingClicked = () => {
        alert(JSON.stringify(props.column.getColId()))
    }

    return (
        <span className="w-full h-full flex items-center justify-end">
            {/* Column Name */}
            <button
                className={`w-full h-full text-start flex items-center gap-2 cursor-default`}
            >
                {props.displayName}
            </button>

            {/* Setting Button */}
            {isCustomColumn && (
                <Button
                    ref={refButton}
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
