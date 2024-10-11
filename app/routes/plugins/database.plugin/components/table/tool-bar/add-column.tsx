import { forwardRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { webieColType } from '../../../schema/table'
import { TypeSelector } from '../type-selector'

interface AddColumnPopoverProps {
    children?: React.ReactNode
    onTypeSelect?: (type: webieColType) => void
    side?: 'right' | 'top' | 'bottom' | 'left' | undefined
}

export const AddColumnPopover = forwardRef<
    HTMLDivElement,
    AddColumnPopoverProps
>((props, ref) => {
    const [open, setOpen] = useState(false)

    return (
        <div ref={ref} className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {props.children ? (
                        props.children
                    ) : (
                        <Button>Add column</Button>
                    )}
                </PopoverTrigger>
                <PopoverContent className="p-0" side={props.side} align="start">
                    <TypeSelector
                        onTypeSelect={type => {
                            props.onTypeSelect?.(type)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
})
