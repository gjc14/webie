import { Editor } from '@tiptap/react'
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Braces,
	Code,
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
import { Separator } from '~/components/ui/separator'
import { ToggleButton } from '../ToggleButton'

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
	if (!editor) {
		return null
	}

	return (
		<div id="menu-bar" className="my-3 py-1.5 border-y">
			<div id="buttons" className="flex flex-wrap items-center gap-1 p-1">
				{/* Formatting */}
				<ToggleButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={
						editor.isActive('bold')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltipShortcut={'Ctrl + B'}
					tooltip="Bold"
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
					tooltipShortcut={'Ctrl + I'}
					tooltip="Italic"
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
					tooltipShortcut={'Ctrl + U'}
					tooltip="Underline"
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
					tooltipShortcut={'Ctrl + Shift + S'}
					tooltip="Strikethrough"
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
					tooltipShortcut={'Ctrl + Shift + H'}
					tooltip="Highlight"
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
					tooltipShortcut={'Ctrl + .'}
					tooltip="Superscript"
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
					tooltipShortcut={'Ctrl + ,'}
					tooltip="Subscript"
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
					tooltipShortcut={'Ctrl + E'}
					tooltip="Code"
				>
					<Code size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
					tooltip="Remove Formatting"
				>
					<RemoveFormatting size={14} />
				</ToggleButton>

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>
				{/* Paragraph */}
				<ToggleButton
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={
						editor.isActive('paragraph')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltipShortcut={'Ctrl + Alt + 0'}
					tooltip="Paragraph"
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
					tooltipShortcut={'Ctrl + Alt + 2'}
					tooltip="Heading 2"
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
					tooltipShortcut={'Ctrl + Alt + 3'}
					tooltip="Heading 3"
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
					tooltipShortcut={'Ctrl + Alt + 4'}
					tooltip="Heading 4"
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
					tooltipShortcut={'Ctrl + Alt + 5'}
					tooltip="Heading 5"
				>
					<Heading5 size={14} />
				</ToggleButton>

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					className={
						editor.isActive('orderedList')
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltipShortcut={'Ctrl + Shift + 7'}
					tooltip="Ordered List"
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
					tooltipShortcut={'Ctrl + Shift + 8'}
					tooltip="Bullet List"
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
					tooltipShortcut={'Ctrl + Alt + C'}
					tooltip="Code Block"
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
					tooltipShortcut={'Ctrl + Shift + B'}
					tooltip="Blockquote"
				>
					<Quote size={14} />
				</ToggleButton>

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().setTextAlign('left').run()
					}
					className={
						editor.isActive({ textAlign: 'left' })
							? 'bg-accent text-bg-accent-foreground'
							: ''
					}
					tooltipShortcut={'Ctrl + Shift + L'}
					tooltip="Align Left"
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
					tooltipShortcut={'Ctrl + Shift + E'}
					tooltip="Align Center"
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
					tooltipShortcut={'Ctrl + Shift + R'}
					tooltip="Align Right"
				>
					<AlignRight size={14} />
				</ToggleButton>

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>
				<ToggleButton
					onClick={() =>
						editor.chain().focus().setHorizontalRule().run()
					}
					tooltip="Separator"
				>
					<Minus size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().setHardBreak().run()}
					tooltipShortcut={'Ctrl / Shift + Enter'}
					tooltip="Hard Break"
				>
					<CornerDownRight size={14} />
				</ToggleButton>

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>
				{/* Undo/Redo */}
				<ToggleButton
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					tooltipShortcut={'Ctrl + Z'}
					tooltip="Undo"
				>
					<Undo size={14} />
				</ToggleButton>
				<ToggleButton
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					tooltipShortcut={'Ctrl + Shift + Z'}
					tooltip="Redo"
				>
					<Redo size={14} />
				</ToggleButton>
			</div>
		</div>
	)
}
