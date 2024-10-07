import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import {
    useFetcher,
    useLoaderData,
    useLocation,
    useNavigate,
} from '@remix-run/react'
import {
    Binary,
    Calendar,
    Circle,
    Hash,
    LucideIcon,
    Mail,
    Text,
} from 'lucide-react'
import React, { useState } from 'react'
import { ThemeToggle } from '~/components/theme-toggle'
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
import { Separator } from '~/components/ui/separator'
import { SerializedLoaderData } from '../_webie.db.$table/route'
import { DataGrid } from '../_webie.db/components/data-grid'
import { getTableConfig } from '../_webie.db/lib/db/table.server'
import {
    webieColDef,
    webieColDefSchema,
    webieColType,
    webieColTypesSchema,
    webieTableConfigSchema,
} from '../_webie.db/schema/table'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()

    const tableConfigString = formData.get('tableConfig')

    if (!tableConfigString || typeof tableConfigString !== 'string') {
        throw new Error('Invalid tableConfig')
    }

    let tableConfig
    try {
        tableConfig = JSON.parse(tableConfigString)
    } catch (e) {
        throw new Error('Invalid JSON')
    }

    // Validate new tableConfig
    const tableConfigResult = webieTableConfigSchema.safeParse(tableConfig)

    if (!tableConfigResult.success) {
        console.log('error:', tableConfigResult.error)
        throw new Error('Invalid table config')
    }

    // Validate schema
    try {
        tableConfigResult.data.columnMeta.forEach((col: webieColDef) => {
            const { success, error } = webieColDefSchema.safeParse(col)
            if (!success) {
                console.error('Invalid column:', error)
                throw new Error('Invalid column')
            }
        })
        return json({ msg: 'Saved successfully' })
    } catch (e: any) {
        console.log('Validation failed:', e.errors)
        return json({ err: 'Validation failed' }, { status: 400 })
    }
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    if (!params.table) {
        throw new Response('Bad Request', { status: 400 })
    }

    // If user came from table page, pass null, no need to fetch data
    const referer = request.headers.get('referer')
    if (referer) {
        const routes = referer.split('/')
        const lastRoute = routes[routes.length - 1]
        if (lastRoute === params.table) {
            return null
        }
    }

    const tableConfig = await getTableConfig(params.table)

    return json({ tableConfig })
}

export default function DBTableEdit() {
    const location = useLocation()
    const navigate = useNavigate()
    const fetcher = useFetcher()

    const loaderData = useLoaderData<typeof loader>()

    let tableConfig
    if (loaderData) {
        tableConfig = loaderData.tableConfig
    } else {
        tableConfig = location.state
            .tableConfig as SerializedLoaderData['tableConfig']
    }
    const [tableConfigState, setTableConfigState] = useState(tableConfig)

    const isDirty =
        JSON.stringify(tableConfigState) !== JSON.stringify(tableConfig)

    const createColumn = () => {
        setTableConfigState(prevConfig => {
            const newColumn: webieColDef = {
                _id: 'new-col-' + Math.random().toString(36).substring(2, 9),
                type: 'string',
                headerName: 'New Column',
                editable: true,
                filter: true,
                sortable: true,
            }
            return {
                ...prevConfig,
                columnMeta: [...prevConfig.columnMeta, newColumn],
            }
        })
    }

    return (
        <div className="h-full flex flex-col p-3 gap-2">
            {/* TODO: page */}

            <fetcher.Form
                id="tableConfigForm"
                onSubmit={e => {
                    e.preventDefault()

                    const formData = new FormData(e.currentTarget)

                    const tableConfig = JSON.stringify(tableConfigState)
                    formData.set('tableConfig', tableConfig)

                    fetcher.submit(formData, {
                        method: 'POST',
                    })
                }}
            />
            <div className="w-full h-fit flex items-center gap-1 p-1 bg-primary-foreground rounded-md border border-border">
                <Button
                    size={'sm'}
                    variant={'ghost'}
                    form="tableConfigForm"
                    disabled={!isDirty}
                >
                    Save
                </Button>

                <Separator orientation="vertical" className="h-4/5" />

                {/* Function area */}
                <AddColumnPopover
                    onTypeSelect={type => {
                        console.log(type)
                        createColumn()
                    }}
                />

                <Separator orientation="vertical" className="h-4/5" />

                <Button
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() =>
                        navigate('..', { replace: true, relative: 'path' })
                    }
                >
                    Cancel
                </Button>

                {/* Config area */}
                <div className="ml-auto flex items-center justify-end gap-1.5">
                    <ThemeToggle className="ml-auto mr-3 scale-90" />
                </div>
            </div>

            <div className="flex-grow">
                <DataGrid
                    tableConfig={tableConfigState}
                    rows={[]}
                    onColumnUpdate={e => console.log(e)}
                    onColumnDelete={e => console.log(e)}
                />
            </div>
        </div>
    )
}

type Status = {
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
