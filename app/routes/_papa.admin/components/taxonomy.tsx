import { Category, SubCategory, Tag } from '@prisma/client'
import { Close, PopoverTrigger } from '@radix-ui/react-popover'
import { Form, useFetcher, useFetchers, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { Tags, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
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
import { Separator } from '~/components/ui/separator'

const actionRoute = '/admin/blog/action/taxonomy'

export const TaxonomyDialog = (props: {
    tags: Tag[] | null
    categories: (Category & { subCategories: SubCategory[] })[] | null
    children?: React.ReactNode
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {props.children ? (
                    props.children
                ) : (
                    <Button variant="outline" size={'sm'}>
                        <Tags size={16} />
                        <span className="sr-only md:not-sr-only xs:whitespace-nowrap">
                            Edit Tags and Categories
                        </span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Tags and Categories</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Taxonomy tags={props.tags} categories={props.categories} />
            </DialogContent>
        </Dialog>
    )
}

const Taxonomy = (props: {
    tags: Tag[] | null
    categories: (Category & { subCategories: SubCategory[] })[] | null
}) => {
    return (
        <div className="grid gap-5 pt-2">
            <CategoryPart categories={props.categories} />
            <Separator />
            <SubCategoryPart categories={props.categories} />
            <Separator />
            <TagPart tags={props.tags} />
        </div>
    )
}

const usePendingCategories = (): (Category & {
    subCategories: SubCategory[]
})[] => {
    const matchedFetchers = useFetchers().filter(fetcher => {
        if (!fetcher.formData) return false
        return fetcher.formData.get('intent') === 'category'
    })
    return matchedFetchers.map(fetcher => {
        return {
            id: String(fetcher.formData?.get('id')),
            name: String(fetcher.formData?.get('name')),
            postIDs: [],
            subCategories: [],
        }
    })
}

const CategoryPart = (props: {
    categories: (Category & { subCategories: SubCategory[] })[] | null
}) => {
    const submit = useSubmit()

    // Optimistic
    const pendingItems = usePendingCategories()
    for (let item of pendingItems) {
        if (!props.categories?.some(cat => cat.id === item.id)) {
            props.categories?.push(item)
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label className="flex items-center gap-x-1.5">Category</Label>
            </div>

            <div className="flex items-center">
                <Popover modal>
                    <PopoverTrigger asChild>
                        <Button variant={'outline'}>Add a new Category</Button>
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
                                value="category"
                            />
                            <Input
                                type="text"
                                placeholder="Category name"
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
                {(!props.categories || props.categories.length === 0) && (
                    <p className="text-sm text-muted-foreground mx-3">
                        No category found
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-1">
                {props.categories &&
                    props.categories?.length > 0 &&
                    props.categories.map(category => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
            </div>
        </div>
    )
}

const CategoryItem = (props: { category: Category }) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get('id') === props.category.id

    return (
        <div
            className={`flex gap-0.5 items-center ${
                isDeleting ? 'hidden' : ''
            }`}
        >
            <Badge>{props.category.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    fetcher.submit(
                        { id: props.category.id, intent: 'category' },
                        { method: 'DELETE', action: actionRoute }
                    )
                }}
            />
        </div>
    )
}

const usePendingSubCategories = (): SubCategory[] => {
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
                        <SelectValue placeholder="Select subcategory..." />
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

const SubcategoryItem = (props: { subcategory: SubCategory }) => {
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

const usePendingTags = (): Tag[] => {
    const matchedFetchers = useFetchers().filter(fetcher => {
        if (!fetcher.formData) return false
        return fetcher.formData.get('intent') === 'tag'
    })
    return matchedFetchers.map(fetcher => {
        return {
            id: String(fetcher.formData?.get('id')),
            name: String(fetcher.formData?.get('name')),
            postIDs: [],
        }
    })
}

const TagPart = (props: { tags: Tag[] | null }) => {
    const submit = useSubmit()
    const [tagValue, setTagValue] = useState<string>('')
    const [isComposing, setIsComposing] = useState(false)

    const pendingItems = usePendingTags()
    for (let item of pendingItems) {
        if (!props.tags?.some(tag => tag.id === item.id)) {
            props.tags?.push(item)
        }
    }

    const addTag = (tag: string) => {
        submit(
            { id: String(new ObjectId()), name: tag.trim(), intent: 'tag' },
            { method: 'POST', action: actionRoute, navigate: false }
        )
        setTagValue('')
    }

    // Check enterd value
    useEffect(() => {
        if (
            tagValue &&
            (tagValue[tagValue.length - 1] === ' ' ||
                tagValue[tagValue.length - 1] === ';' ||
                tagValue[tagValue.length - 1] === ',')
        ) {
            addTag(tagValue.split(tagValue[tagValue.length - 1])[0])
        }
    }, [tagValue])

    return (
        <div className="grid gap-1.5">
            <Label htmlFor="tag" className="flex items-center gap-x-1.5">
                Tag
            </Label>
            <Input
                id="tag"
                name="tag"
                type="text"
                value={tagValue}
                placeholder="Tag name"
                onChange={e => setTagValue(e.target.value)}
                onKeyDown={e => {
                    ;(e.key === 'Enter' || e.key === 'Tab') &&
                        !isComposing &&
                        addTag(tagValue)
                }}
                onCompositionStart={() => {
                    setIsComposing(true)
                }}
                onCompositionEnd={() => {
                    setIsComposing(false)
                }}
            />
            {props.tags && props.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                    {props.tags.map(tag => (
                        <TagItem key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    )
}

const TagItem = (props: { tag: Tag }) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get('id') === props.tag.id

    return (
        <div
            className={`flex gap-0.5 items-center ${
                isDeleting ? 'hidden' : ''
            }`}
        >
            <Badge>{props.tag.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    fetcher.submit(
                        { id: props.tag.id, intent: 'tag' },
                        { method: 'DELETE', action: actionRoute }
                    )
                }}
            />
        </div>
    )
}
