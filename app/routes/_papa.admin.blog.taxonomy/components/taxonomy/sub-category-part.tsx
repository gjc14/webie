import { Category, SubCategory } from '@prisma/client'
import { Close, PopoverTrigger } from '@radix-ui/react-popover'
import { Form, useFetcher, useFetchers, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent } from '~/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'

const actionRoute = '/admin/blog/taxonomy/resource'

export const usePendingSubCategories = (): SubCategory[] => {
    const matchedFetchers = useFetchers().filter(fetcher => {
        if (!fetcher.formData) return false
        return fetcher.formData.get('intent') === 'subcategory'
    })
    return matchedFetchers.map(fetcher => {
        return {
            id: String(fetcher.formData?.get('id')),
            name: String(fetcher.formData?.get('name')),
            categoryId: '',
            postIDs: [],
        }
    })
}

const SubCategoryPart = (props: {
    categories: (Category & { subCategories: SubCategory[] })[] | null
}) => {
    const { categories } = props
    const submit = useSubmit()
    const [selected, setSelected] = useState<string>('')
    const subCategories =
        categories?.find(cat => cat.id === selected)?.subCategories || null

    // Optimistic
    const pendingItems = usePendingSubCategories()
    for (let item of pendingItems) {
        if (!subCategories?.some(sub => sub.id === item.id)) {
            subCategories?.push(item)
        }
    }

    useEffect(() => {
        if (!categories?.some(cat => cat.id === selected)) {
            setSelected('')
        }
    }, [categories])

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label className="flex items-center gap-x-1.5">
                    Subcategory
                </Label>
            </div>

            <div className="flex items-center gap-3">
                <Select
                    value={selected ?? ''}
                    onValueChange={v => {
                        setSelected(v)
                    }}
                >
                    <SelectTrigger
                        disabled={
                            categories === null || categories.length === 0
                        }
                    >
                        <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories?.map(category => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Popover modal>
                    <PopoverTrigger
                        asChild
                        disabled={
                            categories === null ||
                            categories.length === 0 ||
                            !selected
                        }
                    >
                        <Button variant={'outline'}>
                            Add a new Subcategory
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Form
                            className="w-full space-y-1.5"
                            onSubmit={e => {
                                e.preventDefault()

                                const formData = new FormData(e.currentTarget)
                                formData.set('id', new ObjectId().toString())

                                submit(formData, {
                                    method: 'POST',
                                    action: actionRoute,
                                    navigate: false,
                                })
                            }}
                        >
                            <input
                                type="hidden"
                                name="intent"
                                value="subcategory"
                            />
                            <input
                                type="hidden"
                                name="parentId"
                                value={selected}
                            />
                            <Input
                                type="text"
                                placeholder="Subcategory name"
                                name="name"
                            />
                            <Close asChild>
                                <Button type="submit" className="mt-2 w-full">
                                    Save
                                </Button>
                            </Close>
                        </Form>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="col-span-2 flex flex-wrap items-center gap-1">
                {subCategories && subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                        {subCategories.map(subcategory => (
                            <SubcategoryItem
                                key={subcategory.id}
                                subcategory={subcategory}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export const SubcategoryItem = (props: { subcategory: SubCategory }) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get('id') === props.subcategory.id

    return (
        <div
            className={`flex gap-0.5 items-center ${
                isDeleting ? 'hidden' : ''
            }`}
        >
            <Badge>{props.subcategory.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    fetcher.submit(
                        { id: props.subcategory.id, intent: 'subcategory' },
                        { method: 'DELETE', action: actionRoute }
                    )
                }}
            />
        </div>
    )
}

export { SubCategoryPart }
