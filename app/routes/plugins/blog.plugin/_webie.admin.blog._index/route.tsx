import { Link } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import {
    AdminDataTableMoreMenu,
    DataTable,
} from '~/routes/_webie.admin/components/data-table'
import { TaxonomyDialog } from '~/routes/_webie.admin/components/taxonomy'
import { useAdminBlogContext } from '../_webie.admin.blog/route'

export default function AdminPost() {
    const { posts, tags, categories } = useAdminBlogContext()

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle>Posts</AdminTitle>
                <AdminActions>
                    <TaxonomyDialog tags={tags} categories={categories} />
                    <Link to="/admin/blog/new">
                        <Button size={'sm'}>
                            <PlusCircle size={16} />
                            <p className="text-xs">Create new post</p>
                        </Button>
                    </Link>
                </AdminActions>
            </AdminHeader>
            <DataTable columns={columns} data={posts} hideColumnFilter>
                {table => (
                    <Input
                        placeholder="Filter title..."
                        value={
                            (table
                                .getColumn('title')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('title')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
        </AdminSectionWrapper>
    )
}

type SerializedPost = ReturnType<typeof useAdminBlogContext>['posts'][number]

export const columns: ColumnDef<SerializedPost>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'excerpt',
        header: 'Excerpt',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'author',
        header: 'Author',
        accessorFn: row => row.author.name || 'author',
    },
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Last Update
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        accessorFn: row => new Date(row.updatedAt).toLocaleString('zh-TW'),
    },
    {
        accessorKey: 'id',
        header: 'Edit',
        cell: ({ row }) => {
            const id = row.original.id

            return (
                <AdminDataTableMoreMenu route="blog" id={id}>
                    <Link to={`/admin/blog/${id}`}>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                </AdminDataTableMoreMenu>
            )
        },
    },
]
