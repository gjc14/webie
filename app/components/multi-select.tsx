/**
 * @see https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx
 */
import { X } from 'lucide-react'
import * as React from 'react'

import { Command as CommandPrimitive } from 'cmdk'
import { Badge } from '~/components/ui/badge'
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '~/components/ui/command'

type Option = Record<'value' | 'label', string>

interface MultiSelectInputProps {
    options: Option[]
    defaultSelected?: Option[]
    onSelectedChange?: (optionsSelected: Option[]) => void
    placeholder?: string
    // className?: string  // className is not functional with cn() in div
    // id?: string  // id is controlled by cmdk
}

export const MultiSelect = ({
    options,
    defaultSelected,
    onSelectedChange,
    placeholder,
}: MultiSelectInputProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<Option[]>(
        defaultSelected ?? []
    )
    const [inputValue, setInputValue] = React.useState('')

    const handleUnselect = React.useCallback(
        (option: MultiSelectInputProps['options'][number]) => {
            setSelected(prev => {
                const newSelected = prev.filter(s => s.value !== option.value)
                onSelectedChange?.(newSelected)
                return newSelected
            })
        },
        []
    )

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (input) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (input.value === '') {
                        setSelected(prev => {
                            const newSelected = [...prev]
                            newSelected.pop()
                            onSelectedChange?.(newSelected)
                            return newSelected
                        })
                    }
                }
                // This is not a default behaviour of the <input /> field
                if (e.key === 'Escape') {
                    input.blur()
                }
            }
        },
        []
    )

    const selectables = options.filter(option => {
        return !selected.some(
            selectedOption => selectedOption.value === option.value
        )
    })

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset">
                <div className="flex flex-wrap gap-1">
                    {selected.map(option => {
                        return (
                            <Badge key={option.value} variant="secondary">
                                {option.label}
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(option)
                                        }
                                    }}
                                    onMouseDown={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={() => handleUnselect(option)}
                                >
                                    <X className="h-3 w-3 -mr-0.5 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        )
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder ?? 'Select...'}
                        className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${
                            selected.length > 0 ? 'ml-2' : ''
                        }`}
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open &&
                        (selectables.length > 0 ? (
                            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                <CommandGroup className="h-full overflow-auto">
                                    {selectables.map(option => {
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                onMouseDown={e => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                onSelect={value => {
                                                    setInputValue('')
                                                    setSelected(prev => {
                                                        onSelectedChange?.([
                                                            ...prev,
                                                            option,
                                                        ])
                                                        return [...prev, option]
                                                    })
                                                }}
                                                className={'cursor-pointer'}
                                            >
                                                {option.label}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </div>
                        ) : (
                            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                <CommandGroup className="h-full overflow-auto">
                                    <CommandItem
                                        onMouseDown={undefined}
                                        onSelect={undefined}
                                        className={'cursor-default'}
                                        disabled
                                    >
                                        Add some options...
                                    </CommandItem>
                                </CommandGroup>
                            </div>
                        ))}
                </CommandList>
            </div>
        </Command>
    )
}
