import 'highlight.js/styles/base16/atelier-dune.min.css'
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import { DefaultBubbleMenu } from '../components/menus/bubble-menu'
import { DefaultFloatingMenu } from '../components/menus/floating-menu'
import { MenuBar } from '../components/menus/menu-bar'
import ExtensionKit from '../extensions/extension-kit'

export default (props: {
	content?: string
	onUpdate?: (content: string) => void
	onFocus?: () => void
	onBlur?: () => void
}) => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [...ExtensionKit()],
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
			{editor && <MenuBar editor={editor} />}
			{editor && <DefaultBubbleMenu editor={editor} />}
			{editor && <DefaultFloatingMenu editor={editor} />}
			<EditorContent editor={editor} />
		</>
	)
}
