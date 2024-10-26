import { Command, Option, ArrowBigUp as Shift } from 'lucide-react'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip'

const replaceKeys = (str?: string, isMac: boolean = false) => {
    if (!str) {
        return null
    }
    return str.split(' ').map((part, index) => {
        if (isMac) {
            switch (part) {
                case 'Ctrl':
                    return <Command key={index} size={10} />
                case 'Alt':
                    return <Option key={index} size={10} />
                case 'Shift':
                    return <Shift key={index} size={10} />
                default:
                    return (
                        <span key={index} className="text-xs">
                            {part}
                        </span>
                    )
            }
        }
        return (
            <span key={index} className="text-xs">
                {part}
            </span>
        )
    })
}

export interface TooltipProps {
    tooltip?: string
    shortcut?: string
    asChild?: boolean
    children?: React.ReactNode
}

/**
 *
 * @param shortcut Format `Ctrl + I`, `Shift + Alt + A`
 * @param tooltip Just a readable string
 * @returns
 */
export const TooltipWrapper = ({
    tooltip,
    shortcut,
    asChild,
    children,
}: TooltipProps) => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    // TODO: Add support for Windows/Linux
    const processedTooltip = replaceKeys(shortcut, true)

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
                <TooltipContent className="px-2 py-0.5">
                    <span className="flex items-center gap-1.5">
                        {tooltip}

                        {processedTooltip && (
                            <kbd className="flex items-center py-0.5 px-1 border rounded shadow-lg">
                                {processedTooltip}
                            </kbd>
                        )}
                    </span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
