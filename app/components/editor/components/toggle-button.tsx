import { Command, Option, ArrowBigUp as Shift } from 'lucide-react'
import React from 'react'
import { Button, ButtonProps } from '~/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

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

interface ToggleButtonProps extends ButtonProps {
	tooltip?: string
	shortcut?: string
}

export const ToggleButton = React.forwardRef<
	HTMLButtonElement,
	ToggleButtonProps
>(({ className, tooltip, shortcut, ...props }, ref) => {
	const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
	const processedTooltip = replaceKeys(shortcut, true)

	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant={'ghost'}
						className={cn('px-2 py-1 h-7', className)}
						ref={ref}
						{...props}
					/>
				</TooltipTrigger>
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
})
