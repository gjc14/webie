import * as React from 'react'

import { cn } from '~/lib/utils'

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	autoSize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, value, onChange, autoSize, ...props }, ref) => {
		const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

		// Combine refs to handle both forwarded ref and internal ref
		const handleRef = (textarea: HTMLTextAreaElement | null) => {
			textareaRef.current = textarea
			if (typeof ref === 'function') {
				ref(textarea)
			} else if (ref) {
				ref.current = textarea
			}
		}

		const adjustHeight = React.useCallback(() => {
			const textarea = textareaRef.current
			if (textarea && autoSize) {
				textarea.style.height = 'auto'
				textarea.style.height = `${textarea.scrollHeight}px`
			}
		}, [autoSize])

		React.useEffect(() => {
			adjustHeight()
		}, [value, adjustHeight])

		// Adjust height on window resize
		React.useEffect(() => {
			if (autoSize) {
				const handleResize = () => {
					adjustHeight()
				}
				window.addEventListener('resize', handleResize)
				return () => {
					window.removeEventListener('resize', handleResize)
				}
			}
		}, [autoSize, adjustHeight])

		return (
			<textarea
				className={cn(
					'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				ref={handleRef}
				value={value}
				onChange={e => {
					onChange?.(e)
					adjustHeight()
				}}
				{...props}
			/>
		)
	}
)
Textarea.displayName = 'Textarea'

export { Textarea }
