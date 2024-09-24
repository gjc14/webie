import 'highlight.js/styles/base16/atelier-dune.min.css'

import { Editor } from '@tiptap/react'
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Braces,
	Code,
	Command,
	CornerDownRight,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Highlighter,
	Italic,
	List,
	ListOrdered,
	Minus,
	Option,
	Pilcrow,
	Quote,
	Redo,
	RemoveFormatting,
	Strikethrough,
	Subscript,
	Superscript,
	Underline as UnderlineIcon,
	Undo,
} from 'lucide-react'
import React from 'react'
import { Button, ButtonProps } from '~/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
	if (!editor) {
		return null
	}

	return (
		<div id="menu-bar" className="my-3 py-1.5 border-y">
			<div id="buttons" className="flex flex-wrap gap-1 p-1">
				{/* Formatting */}
				<ToggleButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={
						editor.isActive('bold')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ B
						</span>
					}
				>
					<Bold size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={
						!editor.can().chain().focus().toggleItalic().run()
					}
					className={
						editor.isActive('italic')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ I
						</span>
					}
				>
					<Italic size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleUnderline().run()
					}
					disabled={
						!editor.can().chain().focus().toggleUnderline().run()
					}
					className={
						editor.isActive('underline')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ U
						</span>
					}
				>
					<UnderlineIcon size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={
						!editor.can().chain().focus().toggleStrike().run()
					}
					className={
						editor.isActive('strike')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + S
						</span>
					}
				>
					<Strikethrough size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleHighlight().run()
					}
					disabled={
						!editor.can().chain().focus().toggleHighlight().run()
					}
					className={
						editor.isActive('highlight')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + H
						</span>
					}
				>
					<Highlighter size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleSuperscript().run()
					}
					disabled={
						!editor.can().chain().focus().toggleSuperscript().run()
					}
					className={
						editor.isActive('superscript')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ .
						</span>
					}
				>
					<Superscript size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleSubscript().run()
					}
					disabled={
						!editor.can().chain().focus().toggleSubscript().run()
					}
					className={
						editor.isActive('subscript')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ ,
						</span>
					}
				>
					<Subscript size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className={
						editor.isActive('code')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ E
						</span>
					}
				>
					<Code size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
				>
					<RemoveFormatting size={14} />
				</ToggleButton>

				{/* Paragraph */}
				<ToggleButton
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={
						editor.isActive('paragraph')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl + Alt + 0&nbsp;/&nbsp;
							<Command size={12} />
							&nbsp;+&nbsp;
							<Option size={12} /> + 0
						</span>
					}
				>
					<Pilcrow size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={
						editor.isActive('heading', { level: 2 })
							? 'bg-accent text-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl + Alt + 2&nbsp;/&nbsp;
							<Command size={12} />
							&nbsp;+&nbsp;
							<Option size={12} /> + 2
						</span>
					}
				>
					<Heading2 size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={
						editor.isActive('heading', { level: 3 })
							? 'bg-accent text-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl + Alt + 3&nbsp;/&nbsp;
							<Command size={12} />
							&nbsp;+&nbsp;
							<Option size={12} /> + 3
						</span>
					}
				>
					<Heading3 size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					}
					className={
						editor.isActive('heading', { level: 4 })
							? 'bg-accent text-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl + Alt + 4&nbsp;/&nbsp;
							<Command size={12} />
							&nbsp;+&nbsp;
							<Option size={12} /> + 4
						</span>
					}
				>
					<Heading4 size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 5 }).run()
					}
					className={
						editor.isActive('heading', { level: 5 })
							? 'bg-accent text-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl + Alt + 5&nbsp;/&nbsp;
							<Command size={12} />
							&nbsp;+&nbsp;
							<Option size={12} /> + 5
						</span>
					}
				>
					<Heading5 size={14} />
				</ToggleButton>

				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					className={
						editor.isActive('orderedList')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + 7
						</span>
					}
				>
					<ListOrdered size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					className={
						editor.isActive('bulletList')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + 8
						</span>
					}
				>
					<List size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleCodeBlock().run()
					}
					className={
						editor.isActive('codeBlock')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl + Alt + C&nbsp;/&nbsp;
							<Command size={12} />
							&nbsp;+&nbsp;
							<Option size={12} /> + C
						</span>
					}
				>
					<Braces size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
					className={
						editor.isActive('blockquote')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + B
						</span>
					}
				>
					<Quote size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().setTextAlign('left').run()
					}
					className={
						editor.isActive({ textAlign: 'left' })
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + L
						</span>
					}
				>
					<AlignLeft size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().setTextAlign('center').run()
					}
					className={
						editor.isActive({ textAlign: 'center' })
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + E
						</span>
					}
				>
					<AlignCenter size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().setTextAlign('right').run()
					}
					className={
						editor.isActive({ textAlign: 'right' })
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + R
						</span>
					}
				>
					<AlignRight size={14} />
				</ToggleButton>

				<ToggleButton
					onClick={() =>
						editor.chain().focus().setHorizontalRule().run()
					}
				>
					<Minus size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().setHardBreak().run()}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Enter
						</span>
					}
				>
					<CornerDownRight size={14} />
				</ToggleButton>

				{/* Undo/Redo */}
				<ToggleButton
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Z
						</span>
					}
				>
					<Undo size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					tooltip={
						<span className="flex items-center">
							Ctrl/
							<Command size={12} />
							&nbsp;+ Shift + Z
						</span>
					}
				>
					<Redo size={14} />
				</ToggleButton>
			</div>
		</div>
	)
}

interface ToggleButtonProps extends ButtonProps {
	tooltip?: React.ReactNode
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
	({ className, tooltip, ...props }, ref) => {
		if (!tooltip) {
			return (
				<Button
					type="button"
					variant={'ghost'}
					className={cn('px-2 py-1 h-7', className)}
					ref={ref}
					{...props}
				/>
			)
		} else {
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
						<TooltipContent className="px-2 py-1">
							{tooltip}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)
		}
	}
)
