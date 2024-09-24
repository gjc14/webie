import './styles.scss'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import 'highlight.js/styles/base16/atelier-dune.min.css'
import { common, createLowlight } from 'lowlight'
import {
	Bold,
	Braces,
	Code,
	CornerDownRight,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Italic,
	List,
	ListOrdered,
	Minus,
	Pilcrow,
	Quote,
	Redo,
	RemoveFormatting,
	Strikethrough,
	Undo,
} from 'lucide-react'
import { Button } from '~/components/ui/button'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
	if (!editor) {
		return null
	}

	return (
		<div id="menu-bar" className="my-3 py-1.5 border-y">
			<div id="buttons" className="flex flex-wrap gap-1 p-1">
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('bold') ? 'bg-primary' : '')}
				>
					<Bold size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('italic') ? 'bg-primary' : '')}
				>
					<Italic size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('strike') ? 'bg-primary' : '')}
				>
					<Strikethrough size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('code') ? 'bg-primary' : '')}
				>
					<Code size={14} />
				</Button>
				<Button
					type={'button'}
					className={'px-2 py-1 h-7 bg-muted-foreground '}
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
				>
					<RemoveFormatting size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('paragraph') ? 'bg-primary' : '')
					}
				>
					<Pilcrow size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' +
						(editor.isActive('heading', { level: 2 }) ? 'bg-primary' : '')
					}
				>
					<Heading2 size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' +
						(editor.isActive('heading', { level: 3 }) ? 'bg-primary' : '')
					}
				>
					<Heading3 size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' +
						(editor.isActive('heading', { level: 4 }) ? 'bg-primary' : '')
					}
				>
					<Heading4 size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' +
						(editor.isActive('heading', { level: 5 }) ? 'bg-primary' : '')
					}
				>
					<Heading5 size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('bulletList') ? 'bg-primary' : '')
					}
				>
					<List size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('orderedList') ? 'bg-primary' : '')
					}
				>
					<ListOrdered size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('codeBlock') ? 'bg-primary' : '')
					}
				>
					<Braces size={14} />
				</Button>
				<Button
					type={'button'}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={
						'px-2 py-1 h-7 bg-muted-foreground ' + (editor.isActive('blockquote') ? 'bg-primary' : '')
					}
				>
					<Quote size={14} />
				</Button>
				<Button
					type={'button'}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + ''}
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
				>
					<Minus size={14} />
				</Button>
				<Button
					type={'button'}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + ''}
					onClick={() => editor.chain().focus().setHardBreak().run()}
				>
					<CornerDownRight size={14} />
				</Button>
				<Button
					type={'button'}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + ''}
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				>
					<Undo size={14} />
				</Button>
				<Button
					type={'button'}
					className={'px-2 py-1 h-7 bg-muted-foreground ' + ''}
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
				>
					<Redo size={14} />
				</Button>
			</div>
		</div>
	)
}

export const extensions = [
	Color,
	TextStyle,
	StarterKit.configure({
		heading: {
			levels: [2, 3, 4, 5],
		},
		codeBlock: false,
	}),
	Placeholder.configure({ placeholder: 'Write something amazing...' }),
	CodeBlockLowlight.extend({}).configure({ lowlight: createLowlight(common) }),
]

export default (props: {
	content?: string
	onUpdate?: (content: string) => void
	onFocus?: () => void
	onBlur?: () => void
}) => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions,
		content: props.content ? JSON.parse(props.content) : undefined,
		onFocus: () => {
			props.onFocus && props.onFocus()
		},
		onBlur: () => {
			props.onBlur && props.onBlur()
		},
		onUpdate({ editor }) {
			props.onUpdate && props.onUpdate(JSON.stringify(editor.getJSON()))
		},
	})

	return (
		<>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</>
	)
}
