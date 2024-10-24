import { ActionFunctionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { userIs } from '~/lib/db/auth.server'
import { updateUser } from '~/lib/db/user.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
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
import { UserContent } from '~/routes/_webie.admin/components/user-content'
import { UserRole, UserStatus } from '~/schema/database'
import { useUsersContext } from '../_webie.admin.users/route'

export const UserUpdateSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    role: UserRole,
    status: UserStatus,
})

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'PUT') {
        return json<ConventionalError>(
            { data: null, err: 'Invalid method' },
            { status: 400 }
        )
    }

    await userIs(request, 'ADMIN', '/admin/signin')

    const formData = await request.formData()
    const updateUserData = Object.fromEntries(formData)

    const zResult = UserUpdateSchema.safeParse(updateUserData)

    if (!zResult.success || !zResult.data) {
        console.log('updateUserData', zResult.error.issues)
        const message = zResult.error.issues
            .map(issue => `${issue.message} ${issue.path[0]}`)
            .join(' & ')
        return json<ConventionalError>(
            { data: zResult.error.issues, err: message },
            { status: 400 }
        )
    }

    try {
        const { user } = await updateUser({
            id: zResult.data.id,
            data: {
                email: zResult.data.email,
                name: zResult.data.name,
                role: zResult.data.role,
                status: zResult.data.status,
            },
        })

        return json<ConventionalSuccess>({
            msg: 'Success update ' + (user.name || user.email),
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { data: null, err: 'Failed to update user' },
            { status: 400 }
        )
    }
}

export default function AdminAdminUsers() {
    const fetcher = useFetcher()
    const { users: allUsers } = useUsersContext()
    const users = allUsers.filter(user => user.role === 'ADMIN')

    const isSubmitting = fetcher.formAction === '/admin/users/admins/invite'

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle>Admins</AdminTitle>
                <AdminActions>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size={'sm'}>
                                {isSubmitting ? (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <PlusCircle size={16} />
                                )}
                                <p className="text-xs">Invite admin</p>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite admin</DialogTitle>
                                <DialogDescription>
                                    We'll send an invitation link to email
                                    address provided.
                                </DialogDescription>
                            </DialogHeader>
                            <fetcher.Form
                                className="flex gap-1.5"
                                method="POST"
                                action="/admin/users/admins/invite"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                />
                                <DialogClose asChild>
                                    <Button type="submit">{'Invite'}</Button>
                                </DialogClose>
                            </fetcher.Form>
                        </DialogContent>
                    </Dialog>
                </AdminActions>
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

type SerializedUser = ReturnType<typeof useUsersContext>['users'][number]

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
                    <AdminDataTableMoreMenu route="users/admins" id={id}>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            Edit
                        </DropdownMenuItem>
                    </AdminDataTableMoreMenu>
                    <UserContent
                        method="PUT"
                        action={`/admin/users/admins`}
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
