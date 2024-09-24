import 'highlight.js/styles/base16/atelier-dune.min.css'
import './styles.scss'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { MenuBar } from './menu-bar'

export const extensions = [
	StarterKit.configure({
		heading: {
			levels: [2, 3, 4, 5],
		},
		codeBlock: false,
	}),
	Underline,
	Highlight.configure({
		multicolor: true,
	}),
	Color,
	Superscript,
	Subscript,
	TextAlign.configure({ types: ['heading', 'paragraph'] }),
	Placeholder.configure({ placeholder: 'Write something amazing...' }),
	CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
	TextStyle.configure({}),
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
		editorProps: {
			attributes: {
				class: 'prose tracking-wide leading-loose dark:prose-invert my-8 mx-1 focus:outline-none',
			},
		},
	})

	return (
		<>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</>
	)
}
