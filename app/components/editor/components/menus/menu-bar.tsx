import { Editor } from '@tiptap/react'
import { Image, Link, Unlink } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import Youtube from '~/components/editor/components/asset/youtube'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'
import { Provider, providers } from '~/routes/_webie.admin.api.ai.chat'
import {
    editAlignOptions,
    editHistoryOptions,
    editListOptions,
    editMarkOptions,
    editMiscOptions,
    editParagraphOptions,
} from '../../edit-options'
import { ToggleButton } from '../toggle-button'

export const MenuBar = ({
    editor,
    className,
    onAiProviderSelect,
}: {
    editor: Editor
    className?: string
    onAiProviderSelect?: (ai: Provider) => void
}) => {
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
                <ToggleButton
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
                </ToggleButton>

                <ToggleButton
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link')}
                    tooltip="Unset Link"
                >
                    <Unlink size={14} />
                </ToggleButton>

                {/* Media */}
                <ToggleButton
                    onClick={useCallback(() => {
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
                    }, [editor])}
                    disabled={false}
                    tooltip="Insert Image"
                >
                    <Image size={14} />
                </ToggleButton>

                <ToggleButton
                    onClick={useCallback(() => {
                        const url = window.prompt('URL')
                        const width =
                            prompt('Enter width (default: 640)') || '640'
                        const height =
                            prompt('Enter height (default: 480)') || '480'

                        if (url && width && height) {
                            editor.commands.setYoutubeVideo({
                                src: url,
                                width: Math.max(320, parseInt(width)),
                                height: Math.max(180, parseInt(height)),
                            })
                        }
                    }, [editor])}
                    disabled={false}
                    tooltip="Insert Youtube"
                >
                    <Youtube />
                </ToggleButton>

                {/* AI Model Selector */}
                <AIProviderSelector
                    onAiProviderSelect={onAiProviderSelect}
                    className="ml-auto"
                />
            </div>
        </div>
    )
}

import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '~/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'

const AIProviderSelector = ({
    className,
    onAiProviderSelect,
}: {
    className?: string
    onAiProviderSelect?: (ai: Provider) => void
}) => {
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<Provider>('gemini-1.5-flash-latest')

    useEffect(() => {
        onAiProviderSelect?.(value)
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-fit h-7 px-2justify-between', className)}
                    size={'sm'}
                >
                    {value}
                    <ChevronsUpDown className="ml-2 size-2 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={`w-[${triggerRef.current?.offsetWidth}] p-0`}
            >
                <Command>
                    <CommandInput placeholder="Search ai model..." />
                    <CommandList>
                        <CommandEmpty>No ai provider found.</CommandEmpty>
                        <CommandGroup>
                            {providers.map(provider => (
                                <CommandItem
                                    key={provider}
                                    value={provider}
                                    onSelect={currentValue => {
                                        setValue(currentValue as Provider)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === provider
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {provider}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
