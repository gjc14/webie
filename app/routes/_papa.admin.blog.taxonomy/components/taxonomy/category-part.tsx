import { Category, SubCategory } from '@prisma/client'
import { Close, PopoverTrigger } from '@radix-ui/react-popover'
import { Form, useFetcher, useFetchers, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { XCircle } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent } from '~/components/ui/popover'

const actionRoute = '/admin/blog/taxonomy/resource'

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

export { CategoryPart }
