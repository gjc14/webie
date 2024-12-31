import { Link } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { TaxonomyDialog } from '~/routes/_papa.admin.blog.taxonomy/components/taxonomy'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import {
    AdminDataTableMoreMenu,
    DataTable,
} from '~/routes/_papa.admin/components/data-table'
import {
    useAdminBlogContext,
    type BlogLoaderType,
} from '../_papa.admin.blog/route'

export default function AdminPost() {
    const { posts, tags, categories } = useAdminBlogContext()

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle title="Posts"></AdminTitle>
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

export const columns: ColumnDef<BlogLoaderType['posts'][number]>[] = [
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
        id: 'Updated At',
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
            const title = row.original.title

            return (
                <AdminDataTableMoreMenu
                    route="blog"
                    id={id}
                    deleteTarget={title}
                >
                    <Link to={`/admin/blog/${id}`}>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                </AdminDataTableMoreMenu>
            )
        },
    },
]
