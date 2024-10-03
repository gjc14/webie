import { Editor } from '@tiptap/react'
import { Link, Unlink } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { Separator } from '~/components/ui/separator'
import {
    editAlignOptions,
    editHistoryOptions,
    editListOptions,
    editMarkOptions,
    editMediaOptions,
    editMiscOptions,
    editParagraphOptions,
} from '../../edit-options'
import { ToggleButton } from '../toggle-button'

const MemoToggleButton = memo(ToggleButton)

export const MenuBar = ({ editor }: { editor: Editor }) => {
    const [height, setHeight] = useState('480')
    const [width, setWidth] = useState('640')

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()

            return
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run()
    }, [editor])

    return (
        <div id="menu-bar" className="my-3 py-1.5 border-y">
            <div id="buttons" className="flex flex-wrap items-center gap-1 p-1">
                {/* Formatting */}
                {editMarkOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Paragraph */}
                {editParagraphOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* List */}
                {editListOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Align */}
                {editAlignOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Misc */}
                {editMiscOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Undo/Redo */}
                {editHistoryOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Link */}
                <MemoToggleButton
                    onClick={setLink}
                    disabled={false}
                    tooltip="Set Link"
                    className={
                        editor.isActive('link')
                            ? 'bg-accent text-bg-accent-foreground'
                            : ''
                    }
                >
                    <Link size={14} />
                </MemoToggleButton>

                <MemoToggleButton
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link')}
                    tooltip="Unset Link"
                >
                    <Unlink size={14} />
                </MemoToggleButton>

                {/* Media */}
                {editMediaOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}

                {editHistoryOptions.map((option, index) => (
                    <MemoToggleButton
                        key={index}
                        onClick={() => option.onClick(editor)}
                        disabled={!option.can(editor)}
                        className={
                            option.isActive?.(editor)
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                        shortcut={option.shortcut}
                        tooltip={option.tooltip}
                    >
                        {option.icon(14)}
                    </MemoToggleButton>
                ))}
            </div>
        </div>
    )
}
