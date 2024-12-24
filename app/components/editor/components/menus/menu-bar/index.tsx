import { Editor } from '@tiptap/react'
import { WandSparkles } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'
import { Provider } from '~/routes/_papa.admin.api.ai.chat/route'
import {
    editAlignOptions,
    editHistoryOptions,
    editListOptions,
    editMarkOptions,
    editMiscOptions,
    editParagraphOptions,
    ImageButton,
    LinkUnlinkButtons,
    YoutubeButton,
} from '../../../edit-options'
import { ToggleButton } from '../../toggle-button'
import { TooltipWrapper } from '../../tooltip-wrapper'
import { AIProviderSelector } from './ai-provider-selector'

export const MenuBar = ({
    editor,
    className,
    onComplete,
    onAiProviderSelect,
}: {
    editor: Editor
    className?: string
    onComplete?: () => void
    onAiProviderSelect?: (ai: Provider) => void
}) => {
    return (
        <div id="menu-bar" className={cn('py-1.5 border-y', className)}>
            <div id="buttons" className="flex flex-wrap items-center gap-1 p-1">
                {/* Formatting */}
                {editMarkOptions.map((option, index) => (
                    <ToggleButton
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
                    </ToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Paragraph */}
                {editParagraphOptions.map((option, index) => (
                    <ToggleButton
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
                    </ToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* List */}
                {editListOptions.map((option, index) => (
                    <ToggleButton
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
                    </ToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Align */}
                {editAlignOptions.map((option, index) => (
                    <ToggleButton
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
                    </ToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Misc */}
                {editMiscOptions.map((option, index) => (
                    <ToggleButton
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
                    </ToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Undo/Redo */}
                {editHistoryOptions.map((option, index) => (
                    <ToggleButton
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
                    </ToggleButton>
                ))}

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* Resource */}
                <LinkUnlinkButtons editor={editor} />
                <ImageButton editor={editor} />
                <YoutubeButton editor={editor} />

                <Separator
                    orientation="vertical"
                    className="h-full min-h-[1.5rem]"
                />

                {/* AI */}
                <TooltipWrapper
                    asChild
                    tooltip="Generate content with AI"
                    shortcut={'/ai'}
                >
                    <Button
                        variant="outline"
                        className="w-fit h-7 ml-2 px-2"
                        size={'sm'}
                        onClick={() => onComplete?.()}
                    >
                        <WandSparkles />
                        AI Completion
                    </Button>
                </TooltipWrapper>

                <AIProviderSelector
                    onAiProviderSelect={onAiProviderSelect}
                    className="ml-auto"
                />
            </div>
        </div>
    )
}
