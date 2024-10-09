import {
    Binary,
    Calendar,
    Circle,
    Hash,
    LucideIcon,
    Mail,
    Text,
} from 'lucide-react'
import React from 'react'
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
import { webieColType, webieColTypesSchema } from '../../../schema/table'

export type Status = {
    value: webieColType
    label: string
    icon: LucideIcon
}

const supportedTypes: Status[] = [
    {
        value: 'string',
        label: 'String',
        icon: Text,
    },
    {
        value: 'boolean',
        label: 'Boolean',
        icon: Circle,
    },
    {
        value: 'date',
        label: 'Date',
        icon: Calendar,
    },
    {
        value: 'email',
        label: 'Email',
        icon: Mail,
    },
    {
        value: 'number',
        label: 'Number',
        icon: Hash,
    },
    {
        value: 'bigint',
        label: 'Bigint',
        icon: Binary,
    },
]

export function AddColumnPopover({
    onTypeSelect,
}: {
    onTypeSelect?: (type: webieColType) => void
}) {
    const [open, setOpen] = React.useState(false)
    const [selectedType, setSelectedType] = React.useState<Status | null>(null)

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                        Add column
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Find your type..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {supportedTypes.map(type => (
                                    <CommandItem
                                        key={type.value}
                                        value={type.value}
                                        onSelect={value => {
                                            const { success, data, error } =
                                                webieColTypesSchema.safeParse(
                                                    value
                                                )
                                            if (!success) {
                                                console.error(
                                                    'Invalid type:',
                                                    error
                                                )
                                                return
                                            }

                                            onTypeSelect?.(data)
                                            setOpen(false)
                                        }}
                                    >
                                        <type.icon className="mr-2 h-4 w-4 opacity-100" />
                                        <span>{type.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
