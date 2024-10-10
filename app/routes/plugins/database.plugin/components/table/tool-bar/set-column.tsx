import { useState } from 'react'

import { Button } from '~/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { webieColType } from '../../../schema/table'
import { TypeSelector } from '../type-selector'

export function SetColumnPopover({
    children,
    onTypeSelect,
    side = 'right',
}: {
    children?: React.ReactNode
    onTypeSelect?: (type: webieColType) => void
    side?: 'right' | 'top' | 'bottom' | 'left' | undefined
}) {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {children ? children : <Button>Set column</Button>}
                </PopoverTrigger>
                <PopoverContent className="p-0" side={side} align="start">
                    <TypeSelector
                        onTypeSelect={type => {
                            onTypeSelect?.(type)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
