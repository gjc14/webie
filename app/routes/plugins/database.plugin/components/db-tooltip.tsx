import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip'

export const DBToolTip = ({
    message,
    asChild,
    children,
}: {
    message?: string
    asChild?: boolean
    children?: React.ReactNode
}) => {
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
