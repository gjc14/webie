import * as React from 'react'

import { cn } from '~/lib/utils'

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	autoSize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, onChange, autoSize, ...props }, ref) => {
		const handleHeight = (
			event: React.ChangeEvent<HTMLTextAreaElement>
		) => {
			const textarea = event.currentTarget
			textarea.style.height = 'inherit'
			textarea.style.height = `${textarea.scrollHeight}px`
		}

		return (
			<textarea
				className={cn(
					'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				ref={ref}
				onChange={e => {
					autoSize && handleHeight(e)
					onChange?.(e)
				}}
				{...props}
			/>
		)
	}
)
Textarea.displayName = 'Textarea'

export { Textarea }
