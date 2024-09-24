import './styles.scss'
import 'highlight.js/styles/base16/atelier-dune.min.css'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { MenuBar } from './menu-bar'

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
	CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
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
