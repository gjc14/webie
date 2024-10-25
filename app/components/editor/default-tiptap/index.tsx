import 'highlight.js/styles/base16/atelier-dune.min.css'
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import { forwardRef, useImperativeHandle } from 'react'

import { cn } from '~/lib/utils'
import { DefaultBubbleMenu } from '../components/menus/bubble-menu'
// import { DefaultFloatingMenu } from '../components/menus/floating-menu'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
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
    className?: string
    menuBarClassName?: string
    editorContentClassName?: string
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
                class: 'prose tracking-wide leading-loose dark:prose-invert py-5 mx-1 focus:outline-none',
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
        // To make tippy (BubbleMenu/FloatingMenu under the hood) interactive with keyboard, wrap it with <div> or <span>
        // see: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity
        <div
            className={cn(
                'relative max-w-prose grow flex flex-col gap-3',
                props.className
            )}
        >
            {editor && (
                <MenuBar editor={editor} className={props.menuBarClassName} />
            )}
            {editor && <DefaultBubbleMenu editor={editor} />}
            {/* {editor && <DefaultFloatingMenu editor={editor} />} */}
            <EditorContent
                onClick={() => editor?.commands.focus()}
                editor={editor}
                className={cn('grow cursor-text', props.editorContentClassName)}
            />
            <footer className="flex justify-end items-center pt-2 px-1 border-t text-xs text-muted-foreground">
                <a
                    href="https://github.com/gjc14/webie"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View source code on GitHub"
                    aria-label="View source code on GitHub"
                >
                    <GitHubLogoIcon />
                </a>
            </footer>
        </div>
    )
})
