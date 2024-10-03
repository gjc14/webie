import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import ImageBlock from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { common, createLowlight } from 'lowlight'

export const ExtensionKit = () => [
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
        openOnClick: false,
    }),

    // Nodes
    Placeholder.configure({ placeholder: 'Write something amazing...' }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
    TextStyle.configure({}),
    ImageBlock.configure({
        inline: true,
        allowBase64: true,
    }),
    Youtube,
]

export default ExtensionKit
