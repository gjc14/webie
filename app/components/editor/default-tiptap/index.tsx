import 'highlight.js/styles/base16/atelier-dune.min.css'
import './styles.scss'

import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { useCompletion } from 'ai/react'
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'

import { cn } from '~/lib/utils'
import { ChatAPICustomBody } from '~/routes/_webie.admin.api.ai.chat'
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

    ////////////////////////
    ///        AI        ///
    ////////////////////////
    const [aiProvider, setAiProvider] = useState<ChatAPICustomBody['provider']>(
        'gemini-1.5-flash-latest'
    )
    const { completion, complete, isLoading, stop } = useCompletion({
        api: 'admin/api/ai/chat',
        body: { provider: aiProvider },
    })

    const lastCompletion = useRef(0)
    const onComplete = useCallback(
        (editor: Editor) => {
            const { selection, doc } = editor.state
            const { $head, from, to } = selection

            lastCompletion.current = 0

            const defaultPrompt =
                'Please write a post about human education and its impact on eliminating Inequality Gap between Rich and Poor.'
            if (selection.empty) {
                // Use last 20 "lines" as prompt
                const textBefore = doc.textBetween(
                    0,
                    $head.pos,
                    '[webie | split]'
                )

                const prompt =
                    textBefore
                        .split('[webie | split]')
                        .filter(Boolean)
                        .slice(-20)
                        .join(' | ') || defaultPrompt

                complete(prompt, {
                    body: { provider: aiProvider },
                })
            } else {
                // Use selected text as prompt
                const content = doc.textBetween(from, to, '[webie | split]')
                const prompt =
                    content
                        .split('[webie | split]')
                        .filter(Boolean)
                        .join(' | ') || defaultPrompt

                complete(prompt, {
                    body: { provider: aiProvider },
                })
            }
        },
        [editor, complete]
    )

    useEffect(() => {
        if (!editor || !completion) return

        let newCompletion = completion.slice(lastCompletion.current)

        if (lastCompletion.current === 0 && editor.state.selection.empty) {
            // If generate with selected text, it will just replace the selected text, no "\n" needed
            newCompletion = '\n' + newCompletion
        }

        editor.commands.insertContent(newCompletion)

        lastCompletion.current = completion.length
    }, [editor, completion])

    return (
        <div
            className={cn(
                'relative max-w-prose grow flex flex-col gap-3',
                props.className
            )}
        >
            {editor && (
                <MenuBar
                    editor={editor}
                    className={props.menuBarClassName}
                    onComplete={() => onComplete(editor)}
                    isLoading={isLoading}
                    onStop={stop}
                    onAiProviderSelect={ai => setAiProvider(ai)}
                />
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
