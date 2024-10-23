import { useFetcher } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { DataTable } from '~/routes/_webie.admin/components/data-table'
import { TaxonomyDialog } from '~/routes/_webie.admin/components/taxonomy'
import { Intents } from '../_webie.admin.blog.action.taxonomy/route'
import { useAdminBlogContext } from '../_webie.admin.blog/route'

export default function AdminTaxonomy() {
    const { tags, categories } = useAdminBlogContext()

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle description="SEO data is connect to post or route. You could set in either here or in post or route.">
                    Taxonomy
                </AdminTitle>
                <AdminActions>
                    <TaxonomyDialog tags={tags} categories={categories}>
                        <Button size={'sm'}>
                            <PlusCircle size={16} />
                            <p className="text-xs">Create Taxonomy</p>
                        </Button>
                    </TaxonomyDialog>
                </AdminActions>
            </AdminHeader>
            <Separator />
            <h3>Tags</h3>
            <DataTable columns={tagColumns} data={tags}>
                {table => (
                    <Input
                        placeholder="Filter tags..."
                        value={
                            (table
                                .getColumn('name')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('name')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
            <Separator />
            <h3>Categories</h3>
            <DataTable columns={categoryColumns} data={categories}>
                {table => (
                    <Input
                        placeholder="Filter category..."
                        value={
                            (table
                                .getColumn('name')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('name')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
        </AdminSectionWrapper>
    )
}

const DeleteTaxonomy = ({
    id,
    actionRoute,
    intent,
}: {
    id: string
    actionRoute: string
    intent: Intents
}) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get('id') === id

    return (
        <fetcher.Form method="DELETE" action={actionRoute} className="ml-auto">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="intent" value={intent} />
            <Button variant={'destructive'} disabled={isDeleting}>
                Delete
            </Button>
        </fetcher.Form>
    )
}

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
        accessorKey: 'id',
        header: () => <div className="w-full text-right">Action</div>,
        cell: ({ row }) => (
            <div className="w-full flex">
                <DeleteTaxonomy
                    id={row.original.id}
                    actionRoute={'/admin/blog/action/taxonomy'}
                    intent={'tag'}
                />
            </div>
        ),
    },
]

export const categoryColumns: ColumnDef<
    ReturnType<typeof useAdminBlogContext>['categories'][number]
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
            // TODO: Open a dialog to show subcategories
            return row.original.subCategories.length
        },
    },
    {
        accessorKey: 'id',
        header: () => <div className="w-full text-right">Action</div>,
        cell: ({ row }) => (
            <div className="w-full flex">
                <DeleteTaxonomy
                    id={row.original.id}
                    actionRoute={'/admin/blog/action/taxonomy'}
                    intent={'category'}
                />
            </div>
        ),
    },
]
