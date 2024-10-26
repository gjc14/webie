import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import ImageBlock from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { common, createLowlight } from 'lowlight'
// import { SlashCommand } from './slash-command'
import { SmilieReplacer } from './smilie-replacer'
import { ColorHighlighter } from './color-highlighter'
import { StreamView } from './stream-view'

export const ExtensionKit = [
    StarterKit.configure({
        heading: {
            levels: [2, 3, 4, 5],
        },
        codeBlock: false,
        dropcursor: {
            width: 2,
            class: 'ProseMirror-dropcursor border-black',
        },
    }),

    // Marks
    Underline,
    Highlight.configure({
        multicolor: true,
    }),
    Color,
    Superscript,
    Subscript,
    Link.configure({
        defaultProtocol: 'https',
        validate: href => /^https?:\/\//.test(href),
    }),
    Typography, // Input rules, such as (c) -> © or >> -> »

    // Nodes
    Placeholder.configure({
        placeholder: () => {
            return 'Press "/" to open commands, "/ai" for continue writing'
        },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle.configure({}),
    CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
    ImageBlock,
    Youtube,
    TaskList,
    TaskItem.configure({
        nested: true,
    }),

    // Plugins
    // SlashCommand,
    SmilieReplacer,
    ColorHighlighter,
    StreamView,
]

export default ExtensionKit
