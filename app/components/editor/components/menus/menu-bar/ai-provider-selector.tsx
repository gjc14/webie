import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
import { cn } from '~/lib/utils'
import { Provider, providers } from '~/routes/_papa.admin.api.ai.chat/route'

export const AIProviderSelector = ({
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
                    className={cn('w-fit h-7 px-2 justify-between', className)}
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
