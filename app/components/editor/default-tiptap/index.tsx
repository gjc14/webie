import 'highlight.js/styles/base16/atelier-dune.min.css'
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import { forwardRef, useImperativeHandle } from 'react'
import { DefaultBubbleMenu } from '../components/menus/bubble-menu'
import { DefaultFloatingMenu } from '../components/menus/floating-menu'
import { MenuBar } from '../components/menus/menu-bar'
import ExtensionKit from '../extensions/extension-kit'

export interface EditorRef {
    updateContent: (content: string) => void
    getText: () => string
}

interface EditorProps {
    content?: string
    onUpdate?: ({
        toJSON,
        toHTML,
        toText,
    }: {
        toJSON: () => string
        toHTML: () => string
        toText: () => string
    }) => void
    onFocus?: () => void
    onBlur?: () => void
}

export default forwardRef<EditorRef, EditorProps>((props, ref) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [...ExtensionKit],
        content: props.content ? JSON.parse(props.content) : undefined,
        onFocus: () => {
            props.onFocus && props.onFocus()
        },
        onBlur: () => {
            props.onBlur && props.onBlur()
        },
        onUpdate({ editor }) {
            props.onUpdate &&
                props.onUpdate({
                    toJSON: () => JSON.stringify(editor.getJSON()),
                    toHTML: () => editor.getHTML(),
                    toText: () => editor.getText(),
                })
        },
        editorProps: {
            attributes: {
                class: 'prose tracking-wide leading-loose dark:prose-invert my-8 mx-1 focus:outline-none',
            },
        },
    })

    useImperativeHandle(
        ref,
        () => ({
            updateContent(content: string) {
                editor?.commands.setContent(JSON.parse(content))
            },
            getText() {
                return editor?.getText() || ''
            },
        }),
        [editor]
    )

    return (
        <>
            {editor && <MenuBar editor={editor} />}
            {editor && <DefaultBubbleMenu editor={editor} />}
            {editor && <DefaultFloatingMenu editor={editor} />}
            <EditorContent editor={editor} />
        </>
    )
})
