import { CustomTooltipProps } from 'ag-grid-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip'

export const GridToolTip = (props: CustomTooltipProps) => {
    return (
        <div className="z-50 overflow-hidden rounded-md bg-primary-foreground px-3 py-1.5 text-xs text-primary animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border border-primary/20">
            {props.value}
        </div>
    )
}

interface DBToolTipProps {
    message?: string
    asChild?: boolean
    children?: React.ReactNode
    value?: never
}

export const DBToolTip = ({ message, asChild, children }: DBToolTipProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipContent className="bg-primary-foreground text-primary border border-primary/20">
                    {message}
                </TooltipContent>

                <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
            </Tooltip>
        </TooltipProvider>
    )
}
