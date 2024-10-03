import { json, SerializeFrom } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import {
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import {
    AdminDataTableMoreMenu,
    DataTable,
} from '~/routes/_webie.admin/components/data-table'
import { UserContent } from '~/routes/_webie.admin/components/user-content'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { getUsers } from '~/lib/db/user.server'

export { action } from '~/routes/_webie.admin.admins/route'

export const loader = async () => {
    const { users } = await getUsers()

    return json({ users })
}

type SerializedUser = SerializeFrom<typeof loader>['users'][number]

export default function AdminAllUsers() {
    const { users } = useLoaderData<typeof loader>()

    return (
        <AdminSectionWrapper hideReturnButton>
            <AdminHeader>
                <AdminTitle>Users</AdminTitle>
            </AdminHeader>
            <DataTable columns={columns} data={users} hideColumnFilter>
                {table => (
                    <Input
                        placeholder="Filter email..."
                        value={
                            (table
                                .getColumn('email')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('email')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
        </AdminSectionWrapper>
    )
}

export const columns: ColumnDef<SerializedUser>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last update',
        accessorFn: row => new Date(row.updatedAt).toLocaleString('zh-TW'),
    },
    {
        accessorKey: 'id',
        header: 'Edit',
        cell: ({ row }) => {
            const [open, setOpen] = useState(false)
            const id = row.original.id

            return (
                <>
                    <AdminDataTableMoreMenu route="admins" id={id}>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            Edit
                        </DropdownMenuItem>
                    </AdminDataTableMoreMenu>
                    <UserContent
                        method="PUT"
                        action={`/admin/users`}
                        user={{
                            ...row.original,
                            updatedAt: new Date(row.original.updatedAt),
                        }}
                        open={open}
                        setOpen={setOpen}
                    />
                </>
            )
        },
    },
]
