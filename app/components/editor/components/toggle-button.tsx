import React from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import { TooltipProps, TooltipWrapper } from './tooltip-wrapper'

interface ToggleButtonProps
    extends TooltipProps,
        React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ToggleButton = React.forwardRef<
    HTMLButtonElement,
    ToggleButtonProps
>(({ className, tooltip, shortcut, ...props }, ref) => {
    return (
        <TooltipWrapper tooltip={tooltip} shortcut={shortcut} asChild>
            <Button
                type="button"
                variant={'ghost'}
                className={cn('px-2 py-1 h-7', className)}
                ref={ref}
                {...props}
            />
        </TooltipWrapper>
    )
})
