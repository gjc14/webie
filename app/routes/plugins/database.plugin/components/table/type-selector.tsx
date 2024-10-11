import {
    Calendar,
    CheckCheck,
    CircleEllipsis,
    Earth,
    FileJson,
    FunctionSquare,
    Hash,
    Link,
    LucideIcon,
    Mail,
    Router,
    Text,
    Webhook,
} from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '~/components/ui/command'
import { webieColType, webieColTypesSchema } from '../../schema/table'

export type TypeButtonArgs = {
    value: webieColType
    label: string
    icon: LucideIcon
}

export const supportedTypes: TypeButtonArgs[] = [
    {
        value: 'string',
        label: 'Text',
        icon: Text,
    },
    {
        value: 'number',
        label: 'Number',
        icon: Hash,
    },
    {
        value: 'boolean',
        label: 'True/False',
        icon: CheckCheck,
    },
    {
        value: 'select',
        label: 'Select',
        icon: CircleEllipsis,
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
        value: 'void',
        label: 'Function',
        icon: FunctionSquare,
    },
    {
        value: 'api',
        label: 'API',
        icon: Webhook,
    },
    {
        value: 'any',
        label: 'Any',
        icon: Earth,
    },
    {
        value: 'url',
        label: 'URL',
        icon: Link,
    },
    {
        value: 'ip',
        label: 'IP Address',
        icon: Router,
    },
    {
        value: 'uuid',
        label: 'UUID',
        icon: Hash,
    },
    {
        value: 'cuid',
        label: 'CUID',
        icon: Hash,
    },
    {
        value: 'nanoId',
        label: 'Nano ID',
        icon: Hash,
    },
    {
        value: 'json',
        label: 'JSON Data',
        icon: FileJson,
    },
]

export const TypeSelector = ({
    onTypeSelect,
}: {
    onTypeSelect?: (type: webieColType) => void
}) => {
    return (
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
                                    webieColTypesSchema.safeParse(value)
                                if (!success) {
                                    console.error('Invalid type:', error)
                                    return
                                }

                                onTypeSelect?.(data)
                            }}
                        >
                            <type.icon className="mr-2 h-4 w-4 opacity-100" />
                            <span>{type.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
