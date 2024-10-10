import { QuestionMarkIcon } from '@radix-ui/react-icons'
import {
    Binary,
    Calendar,
    Circle,
    CircleDashed,
    CircleOff,
    Earth,
    FunctionSquare,
    Hash,
    LucideIcon,
    Mail,
    Star,
    Text,
    X,
} from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '~/components/ui/command'
import { convertRadixToLucideIcon } from '~/components/utils'
import { webieColType, webieColTypesSchema } from '../../schema/table'

export type TypeButtonArgs = {
    value: webieColType
    label: string
    icon: LucideIcon
}

const RadixQuestionMarkIcon = convertRadixToLucideIcon(QuestionMarkIcon)

export const supportedTypes: TypeButtonArgs[] = [
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
    {
        value: 'symbol',
        label: 'Symbol',
        icon: Star,
    },
    {
        value: 'undefined',
        label: 'Undefined',
        icon: CircleDashed,
    },
    {
        value: 'null',
        label: 'Null',
        icon: CircleOff,
    },
    {
        value: 'void',
        label: 'Void',
        icon: FunctionSquare,
    },
    {
        value: 'any',
        label: 'Any',
        icon: Earth,
    },
    {
        value: 'unknown',
        label: 'Unknown',
        icon: RadixQuestionMarkIcon,
    },
    {
        value: 'never',
        label: 'Never',
        icon: X,
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
