import {
    Calendar,
    CheckSquare2,
    CopyCheck,
    Earth,
    File,
    FileDigitIcon,
    FileDown,
    FileJson,
    FileText,
    FunctionSquare,
    Hash,
    Image,
    Link,
    LucideIcon,
    Mail,
    Router,
    SquareChevronDown,
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
import { webieColType, webieColTypesSchema } from '../../schema/column'

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
        label: 'Checkbox',
        icon: CheckSquare2,
    },
    {
        value: 'select',
        label: 'Select',
        icon: SquareChevronDown,
    },
    {
        value: 'multipleSelect',
        label: 'Multiple Select',
        icon: CopyCheck,
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
        value: 'nanoid',
        label: 'Nano ID',
        icon: Hash,
    },
    {
        value: 'json',
        label: 'JSON Data',
        icon: FileJson,
    },
    {
        value: 'calc',
        label: 'Calculation',
        icon: FunctionSquare,
    },
    {
        value: 'table',
        label: 'Table',
        icon: FileDown,
    },
    {
        value: 'tableLookup',
        label: 'Table Lookup',
        icon: FileDigitIcon,
    },
    {
        value: 'longText',
        label: 'Long Text',
        icon: FileText,
    },
    {
        value: 'image',
        label: 'Image',
        icon: Image,
    },
    {
        value: 'file',
        label: 'File',
        icon: File,
    },
    // Could be added for explicit percentage type instead of feature in number with percentage option
    // {
    //     value: 'percentage',
    //     label: 'Percentage',
    //     icon: Hash,
    // },
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
