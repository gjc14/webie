import { BubbleMenu, Editor } from '@tiptap/react'
import { AlignLeft, MoreVertical, Pilcrow, WandSparkles } from 'lucide-react'

import {
    editAlignOptions,
    editHistoryOptions,
    editListOptions,
    editMarkOptions,
    editMiscOptions,
    editParagraphOptions,
} from '~/components/editor/edit-options'
import { Separator } from '~/components/ui/separator'
import { PopoverMenuOptions } from '../popover-options'
import { ToggleButton } from '../toggle-button'

export const DefaultBubbleMenu = ({
    editor,
    onComplete,
}: {
    editor: Editor
    onComplete?: () => void
}) => {
    const activeParagraphOption = [
        ...editParagraphOptions,
        ...editListOptions,
    ].find(option => option.isActive?.(editor))
    const activeAlignOption = editAlignOptions.find(option =>
        option.isActive?.(editor)
    )

    const MarkOptions = editMarkOptions.filter(
        option =>
            option.tooltip !== 'Remove Formatting' &&
            option.tooltip !== 'Superscript' &&
            option.tooltip !== 'Subscript'
    )
    const OtherMarkOptions = editMarkOptions.filter(
        option =>
            option.tooltip === 'Remove Formatting' ||
            option.tooltip === 'Superscript' ||
            option.tooltip === 'Subscript'
    )

    return (
        <BubbleMenu
            tippyOptions={{
                duration: 100,
                maxWidth: '90vw',
                zIndex: 45, // Lower than the tooltip z-50
            }}
            editor={editor}
            className="flex items-center p-1 gap-0.5 bg-primary-foreground border border-border rounded-md shadow-md"
        >
            {/* AI Write */}
            <ToggleButton
                onClick={onComplete}
                disabled={undefined}
                tooltip={'AI Continue Writing'}
            >
                <WandSparkles size={16} />
            </ToggleButton>

            <Separator
                orientation="vertical"
                className="h-full min-h-[1.5rem]"
            />

            {/* Paragraph options */}
            <PopoverMenuOptions
                editor={editor}
                activeIcon={
                    <span className="flex gap-1 items-center text-xs">
                        {activeParagraphOption?.icon(16)}
                        {activeParagraphOption?.tooltip}
                    </span>
                }
                defaultIcon={<Pilcrow size={16} />}
                options={[
                    { label: 'Paragraph' },
                    ...editParagraphOptions,
                    { label: 'List' },
                    ...editListOptions,
                ]}
            />

            <Separator
                orientation="vertical"
                className="h-full min-h-[1.5rem]"
            />

            {MarkOptions.map((option, index) => (
                <ToggleButton
                    key={index}
                    onClick={() => option.onClick(editor)}
                    disabled={!option.can(editor)}
                    className={
                        option.isActive?.(editor)
                            ? 'bg-accent text-accent-foreground'
                            : ''
                    }
                    shortcut={option.shortcut}
                    tooltip={option.tooltip}
                >
                    {option.icon(16)}
                </ToggleButton>
            ))}

            <Separator
                orientation="vertical"
                className="h-full min-h-[1.5rem]"
            />

            <PopoverMenuOptions
                editor={editor}
                activeIcon={activeAlignOption?.icon(16)}
                defaultIcon={<AlignLeft size={16} />}
                options={editAlignOptions}
            />

            <Separator
                orientation="vertical"
                className="h-full min-h-[1.5rem]"
            />

            <PopoverMenuOptions
                editor={editor}
                defaultIcon={<MoreVertical size={16} />}
                options={[
                    ...OtherMarkOptions,
                    ...editMiscOptions,
                    ...editHistoryOptions,
                ]}
                hideIndicator
            />
        </BubbleMenu>
    )
}
