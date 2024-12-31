import { Category, SubCategory, Tag } from '@prisma/client'
import { Tags } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { CategoryPart } from './category-part'
import { SubCategoryPart } from './sub-category-part'
import { TagPart } from './tag-part'

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
