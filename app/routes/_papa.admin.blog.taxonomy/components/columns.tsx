import { ColumnDef } from '@tanstack/react-table'

import {
    BlogLoaderType,
    useAdminBlogContext,
} from '~/routes/_papa.admin.blog/route'
import { DeleteTaxonomyButton } from './delete-taxonomy-button'
import { SubCategoriesDialog } from './subcategories-dialog'

export const tagColumns: ColumnDef<
    ReturnType<typeof useAdminBlogContext>['tags'][number]
>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'postIDs',
        header: 'Posts',
        cell: ({ row }) => {
            // TODO: Open a dialog to show posts
            return row.original.postIDs.length
        },
    },
    {
        id: 'Action',
        accessorKey: 'id',
        header: () => <div className="w-full text-right">Action</div>,
        cell: ({ row }) => (
            <div className="w-full flex">
                <DeleteTaxonomyButton
                    id={row.original.id}
                    actionRoute={'/admin/blog/action/taxonomy'}
                    intent={'tag'}
                />
            </div>
        ),
    },
]

export const categoryColumns: ColumnDef<
    BlogLoaderType['categories'][number]
>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'postIDs',
        header: 'Posts',
        cell: ({ row }) => {
            // TODO: Open a dialog to show posts
            return row.original.postIDs.length
        },
    },
    {
        accessorKey: 'subCategories',
        header: 'Subcategories',
        cell: ({ row }) => {
            const categoryId = row.original.id
            const category = row.original.name
            const subCategories = row.original.subCategories
            return (
                <SubCategoriesDialog
                    categoryId={categoryId}
                    category={category}
                    subCategories={subCategories}
                />
            )
        },
    },
    {
        id: 'Action',
        accessorKey: 'id',
        header: () => <div className="w-full text-right">Action</div>,
        cell: ({ row }) => (
            <div className="w-full flex">
                <DeleteTaxonomyButton
                    id={row.original.id}
                    actionRoute={'/admin/blog/action/taxonomy'}
                    intent={'category'}
                />
            </div>
        ),
    },
]
