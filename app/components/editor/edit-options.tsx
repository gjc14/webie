import Youtube from '~/components/editor/components/asset/youtube'
import { Editor } from '@tiptap/react'
import {
    AlignCenter,
    AlignJustify,
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
    Image,
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
import { useCallback } from 'react'

export interface EditOptionProps {
    tooltip: string
    shortcut?: string
    icon: (size: number) => JSX.Element
    onClick: (editor: Editor) => void
    isActive?: (editor: Editor) => boolean
    can: (editor: Editor) => boolean
}

const editMarkOptions: EditOptionProps[] = [
    {
        tooltip: 'Bold',
        shortcut: 'Ctrl + B',
        icon: (size = 14) => {
            return <Bold size={size} />
        },
        onClick: (editor: Editor) => editor.chain().focus().toggleBold().run(),
        isActive: (editor: Editor) => editor.isActive('bold'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleBold().run(),
    },
    {
        tooltip: 'Italic',
        shortcut: 'Ctrl + I',
        icon: (size = 14) => {
            return <Italic size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleItalic().run(),
        isActive: (editor: Editor) => editor.isActive('italic'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleItalic().run(),
    },
    {
        tooltip: 'Underline',
        shortcut: 'Ctrl + U',
        icon: (size = 14) => {
            return <UnderlineIcon size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleUnderline().run(),
        isActive: (editor: Editor) => editor.isActive('underline'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleUnderline().run(),
    },
    {
        tooltip: 'Strikethrough',
        shortcut: 'Ctrl + Shift + S',
        icon: (size = 14) => {
            return <Strikethrough size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleStrike().run(),
        isActive: (editor: Editor) => editor.isActive('strike'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleStrike().run(),
    },
    {
        tooltip: 'Highlight',
        shortcut: 'Ctrl + Shift + H',
        icon: (size = 14) => {
            return <Highlighter size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleHighlight().run(),
        isActive: (editor: Editor) => editor.isActive('highlight'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleHighlight().run(),
    },
    {
        tooltip: 'Superscript',
        shortcut: 'Ctrl + .',
        icon: (size = 14) => {
            return <Superscript size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleSuperscript().run(),
        isActive: (editor: Editor) => editor.isActive('superscript'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleSuperscript().run(),
    },
    {
        tooltip: 'Subscript',
        shortcut: 'Ctrl + ,',
        icon: (size = 14) => {
            return <Subscript size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleSubscript().run(),
        isActive: (editor: Editor) => editor.isActive('subscript'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleSubscript().run(),
    },
    {
        tooltip: 'Code',
        shortcut: 'Ctrl + E',
        icon: (size = 14) => {
            return <Code size={size} />
        },
        onClick: (editor: Editor) => editor.chain().focus().toggleCode().run(),
        isActive: (editor: Editor) => editor.isActive('code'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleCode().run(),
    },
    {
        tooltip: 'Remove Formatting',
        icon: (size = 14) => {
            return <RemoveFormatting size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().unsetAllMarks().run(),
        can: () => true,
    },
]

const editParagraphOptions: EditOptionProps[] = [
    {
        tooltip: 'Paragraph',
        shortcut: 'Ctrl + Alt + 0',
        icon: (size = 14) => {
            return <Pilcrow size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setParagraph().run(),
        isActive: (editor: Editor) => editor.isActive('paragraph'),
        can: () => true,
    },
    {
        tooltip: 'Heading 2',
        shortcut: 'Ctrl + Alt + 2',
        icon: (size = 14) => {
            return <Heading2 size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 2 }),
        can: () => true,
    },
    {
        tooltip: 'Heading 3',
        shortcut: 'Ctrl + Alt + 3',
        icon: (size = 14) => {
            return <Heading3 size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 3 }),
        can: () => true,
    },
    {
        tooltip: 'Heading 4',
        shortcut: 'Ctrl + Alt + 4',
        icon: (size = 14) => {
            return <Heading4 size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 4 }),
        can: () => true,
    },
    {
        tooltip: 'Heading 5',
        shortcut: 'Ctrl + Alt + 5',
        icon: (size = 14) => {
            return <Heading5 size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleHeading({ level: 5 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 5 }),
        can: () => true,
    },
    {
        tooltip: 'Code Block',
        shortcut: 'Ctrl + Alt + C',
        icon: (size = 14) => {
            return <Braces size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleCodeBlock().run(),
        isActive: (editor: Editor) => editor.isActive('codeBlock'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleCodeBlock().run(),
    },
]

const editListOptions: EditOptionProps[] = [
    {
        tooltip: 'Ordered List',
        shortcut: 'Ctrl + Shift + 7',
        icon: (size = 14) => {
            return <ListOrdered size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleOrderedList().run(),
        isActive: (editor: Editor) => editor.isActive('orderedList'),
        can: () => true,
    },
    {
        tooltip: 'Bullet List',
        shortcut: 'Ctrl + Shift + 8',
        icon: (size = 14) => {
            return <List size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleBulletList().run(),
        isActive: (editor: Editor) => editor.isActive('bulletList'),
        can: () => true,
    },
    {
        tooltip: 'Blockquote',
        shortcut: 'Ctrl + Shift + B',
        icon: (size = 14) => {
            return <Quote size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().toggleBlockquote().run(),
        isActive: (editor: Editor) => editor.isActive('blockquote'),
        can: (editor: Editor) =>
            editor.can().chain().focus().toggleBlockquote().run(),
    },
]

const editAlignOptions: EditOptionProps[] = [
    {
        tooltip: 'Align Left',
        shortcut: 'Ctrl + Shift + L',
        icon: (size = 14) => {
            return <AlignLeft size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setTextAlign('left').run(),
        isActive: (editor: Editor) => editor.isActive({ textAlign: 'left' }),
        can: () => true,
    },
    {
        tooltip: 'Align Center',
        shortcut: 'Ctrl + Shift + E',
        icon: (size = 14) => {
            return <AlignCenter size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setTextAlign('center').run(),
        isActive: (editor: Editor) => editor.isActive({ textAlign: 'center' }),
        can: () => true,
    },
    {
        tooltip: 'Align Right',
        shortcut: 'Ctrl + Shift + R',
        icon: (size = 14) => {
            return <AlignRight size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setTextAlign('right').run(),
        isActive: (editor: Editor) => editor.isActive({ textAlign: 'right' }),
        can: () => true,
    },
    {
        tooltip: 'Justify',
        shortcut: 'Ctrl + Shift + J',
        icon: (size = 14) => {
            return <AlignJustify size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setTextAlign('justify').run(),
        isActive: (editor: Editor) => editor.isActive({ textAlign: 'justify' }),
        can: () => true,
    },
]

const editMiscOptions: EditOptionProps[] = [
    {
        tooltip: 'Separator',
        icon: (size = 14) => {
            return <Minus size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setHorizontalRule().run(),
        can: () => true,
    },
    {
        tooltip: 'Hard Break',
        shortcut: 'Ctrl / Shift + Enter',
        icon: (size = 14) => {
            return <CornerDownRight size={size} />
        },
        onClick: (editor: Editor) =>
            editor.chain().focus().setHardBreak().run(),
        can: () => true,
    },
]

const editHistoryOptions: EditOptionProps[] = [
    {
        tooltip: 'Undo',
        shortcut: 'Ctrl + Z',
        icon: (size = 14) => {
            return <Undo size={size} />
        },
        onClick: (editor: Editor) => editor.chain().focus().undo().run(),
        can: (editor: Editor) => editor.can().chain().focus().undo().run(),
    },
    {
        tooltip: 'Redo',
        shortcut: 'Ctrl + Shift + Z',
        icon: (size = 14) => {
            return <Redo size={size} />
        },
        onClick: (editor: Editor) => editor.chain().focus().redo().run(),
        can: (editor: Editor) => editor.can().chain().focus().redo().run(),
    },
]

const editMediaOptions: EditOptionProps[] = [
    {
        tooltip: 'Insert Image',
        icon: (size = 14) => {
            return <Image size={size} />
        },
        onClick: (editor: Editor) => {
            const url = window.prompt('URL')
            const alt = window.prompt('Alt')
            const title = window.prompt('Title')

            if (url) {
                editor
                    .chain()
                    .focus()
                    .setImage({
                        src: url,
                        alt: alt || 'Image',
                        title: title || 'Image',
                    })
                    .run()
            }
        },
        can: () => true,
    },
    {
        tooltip: 'Insert Youtube',
        icon: (size = 14) => {
            return <Youtube size={size} />
        },
        onClick: (editor: Editor) => {
            const url = window.prompt('URL')
            const width = prompt('Enter width (default: 640)') || '640'
            const height = prompt('Enter height (default: 480)') || '480'

            if (url && width && height) {
                editor.commands.setYoutubeVideo({
                    src: url,
                    width: Math.max(320, parseInt(width)),
                    height: Math.max(180, parseInt(height)),
                })
            }
        },
        can: () => true,
    },
]

export {
    editAlignOptions,
    editHistoryOptions,
    editListOptions,
    editMarkOptions,
    editMiscOptions,
    editMediaOptions,
    editParagraphOptions,
}
