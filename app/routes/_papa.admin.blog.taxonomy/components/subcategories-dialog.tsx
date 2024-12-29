import { Form, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { useRef } from 'react'

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
import { BlogLoaderType } from '~/routes/_papa.admin.blog/route'
import {
    SubcategoryItem,
    usePendingSubCategories,
} from '~/routes/_papa.admin/components/taxonomy'

const actionRoute = '/admin/blog/action/taxonomy'

export function SubCategoriesDialog({
    category,
    categoryId,
    subCategories,
}: {
    category: BlogLoaderType['categories'][number]['name']
    categoryId: BlogLoaderType['categories'][number]['id']
    subCategories: BlogLoaderType['categories'][number]['subCategories']
}) {
    const submit = useSubmit()
    const subInputRef = useRef<HTMLInputElement>(null)

    // Optimistic
    const pendingItems = usePendingSubCategories()
    for (let item of pendingItems) {
        if (!subCategories?.some(sub => sub.id === item.id)) {
            subCategories?.push(item)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    See {subCategories.length} Subcategories
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {subCategories.length} Subcategories
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to subcategories of "{category}".
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-3">
                    <Form
                        className="w-full flex items-center justify-center gap-2"
                        onSubmit={e => {
                            e.preventDefault()

                            const formData = new FormData(e.currentTarget)
                            formData.set('id', new ObjectId().toString())

                            submit(formData, {
                                method: 'POST',
                                action: actionRoute,
                                navigate: false,
                            })

                            if (subInputRef.current) {
                                subInputRef.current.value = ''
                            }
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
                            value={categoryId}
                        />
                        <Input
                            ref={subInputRef}
                            type="text"
                            placeholder="Subcategory name"
                            name="name"
                            className="shink-0"
                        />
                        <Button type="submit">Add</Button>
                    </Form>

                    <div className="w-full space-y-1">
                        <Label>Subcategories</Label>
                        {subCategories.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 items-center">
                                {subCategories.map(subcategory => (
                                    <SubcategoryItem
                                        key={subcategory.id}
                                        subcategory={subcategory}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Empty, add some subcategories
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
