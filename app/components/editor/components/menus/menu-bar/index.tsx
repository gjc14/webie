import { PopoverClose } from '@radix-ui/react-popover'
import { Editor } from '@tiptap/react'
import { Image, Link, Unlink, WandSparkles } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import Youtube from '~/components/editor/components/asset/youtube'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'
import { Provider } from '~/routes/_webie.admin.api.ai.chat/route'
import {
    editAlignOptions,
    editHistoryOptions,
    editListOptions,
    editMarkOptions,
    editMiscOptions,
    editParagraphOptions,
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

                {/* Link */}
                <LinkUnlinkButtons editor={editor} />

                {/* Media */}
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

const LinkUnlinkButtons = ({ editor }: { editor: Editor }) => {
    const [linkInput, setLinkInput] = useState('')

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href

        // did notion
        if (!previousUrl && !linkInput) return

        // remove
        if (!!previousUrl && !linkInput) {
            return editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .unsetLink()
                .run()
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: linkInput })
            .run()
    }, [editor, linkInput])

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <ToggleButton
                        onClick={() => {
                            const previousUrl =
                                editor.getAttributes('link').href
                            setLinkInput(previousUrl ?? '')
                        }}
                        disabled={false}
                        tooltip="Set Link"
                        className={
                            editor.isActive('link')
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                    >
                        <Link size={14} />
                    </ToggleButton>
                </PopoverTrigger>
                <PopoverContent>
                    <Label htmlFor="link">URL</Label>
                    <Input
                        id="link"
                        placeholder="https://webie.dev"
                        value={linkInput}
                        onChange={e => setLinkInput(e.target.value ?? '')}
                    />
                    <PopoverClose asChild className="w-full mt-2">
                        <Button onClick={() => setLink()}>Set Link</Button>
                    </PopoverClose>
                </PopoverContent>
            </Popover>

            <ToggleButton
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                tooltip="Unset Link"
            >
                <Unlink size={14} />
            </ToggleButton>
        </>
    )
}

const ImageButton = ({ editor }: { editor: Editor }) => {
    const urlInputRef = useRef<HTMLInputElement>(null)
    const altInputRef = useRef<HTMLInputElement>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <ToggleButton disabled={false} tooltip="Insert Image">
                    <Image size={14} />
                </ToggleButton>
            </PopoverTrigger>

            <PopoverContent className="w-96">
                <div className="grid gap-3">
                    <div className="space-y-2">
                        <h4>Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                            Set the dimensions for your Image.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                ref={urlInputRef}
                                id="url"
                                placeholder="https://webie.dev/logo.svg"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="alt">Alt</Label>
                            <Input
                                ref={altInputRef}
                                id="alt"
                                placeholder="alt"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                ref={titleInputRef}
                                id="title"
                                placeholder="title"
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>

                    <footer>
                        <PopoverClose asChild>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const url = urlInputRef.current?.value
                                    const alt = altInputRef.current?.value
                                    const title = titleInputRef.current?.value

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
                                }}
                            >
                                Insert Youtube
                            </Button>
                        </PopoverClose>
                    </footer>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const YoutubeButton = ({ editor }: { editor: Editor }) => {
    const urlInputRef = useRef<HTMLInputElement>(null)
    const widthInputRef = useRef<HTMLInputElement>(null)
    const heightInputRef = useRef<HTMLInputElement>(null)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <ToggleButton disabled={false} tooltip="Insert Youtube">
                    <Youtube />
                </ToggleButton>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <div className="grid gap-3">
                    <div className="space-y-2">
                        <h4>Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                            Set the dimensions for your Youtube video.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                ref={urlInputRef}
                                id="url"
                                placeholder="https://www.youtube.com/watch?v=MgsdDfdGdHc"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="width">Width</Label>
                            <Input
                                ref={widthInputRef}
                                id="width"
                                defaultValue="640"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="height">Height</Label>
                            <Input
                                ref={heightInputRef}
                                id="height"
                                defaultValue="480"
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>

                    <footer>
                        <PopoverClose asChild>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const url = urlInputRef.current?.value
                                    const width = widthInputRef.current?.value
                                    const height = heightInputRef.current?.value

                                    if (url) {
                                        editor.commands.setYoutubeVideo({
                                            src: url,
                                            width: Math.max(
                                                320,
                                                parseInt(width || '0')
                                            ),
                                            height: Math.max(
                                                180,
                                                parseInt(height || '0')
                                            ),
                                        })
                                    }
                                }}
                            >
                                Insert Youtube
                            </Button>
                        </PopoverClose>
                    </footer>
                </div>
            </PopoverContent>
        </Popover>
    )
}
