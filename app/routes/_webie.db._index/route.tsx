import { json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { Loader2, PlusCircle } from 'lucide-react'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
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
import { Input } from '~/components/ui/input'
import Icon, { IconOptions } from '~/components/dynamic-icon'

export const loader = async () => {
    const tables: {
        table: string
        tableName: string
        icon: IconOptions
    }[] = [
        { table: 'users', tableName: 'Users', icon: 'user-round' },
        { table: 'posts', tableName: 'Posts', icon: 'newspaper' },
        { table: 'products', tableName: 'Products', icon: 'box' },
    ]
    return json({ tables })
}

export default function DBDashboard() {
    const { tables } = useLoaderData<typeof loader>()
    const fetcher = useFetcher()
    const isSubmitting = fetcher.state === 'submitting'

    return (
        <div>
            <AdminSectionWrapper hideReturnButton>
                <AdminHeader>
                    <AdminTitle>WebieDB</AdminTitle>
                    <AdminActions>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="space-x-1.5" size={'sm'}>
                                    {isSubmitting ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <PlusCircle size={16} />
                                    )}
                                    <p className="text-xs">Create a table</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create a table</DialogTitle>
                                    <DialogDescription>
                                        Give your table a unique name
                                    </DialogDescription>
                                </DialogHeader>
                                <fetcher.Form
                                    className="flex gap-1.5"
                                    method="POST"
                                >
                                    <Input
                                        placeholder="Name of you table"
                                        type="table-name"
                                        name="table-name"
                                    />
                                    <DialogClose asChild>
                                        <Button type="submit">Create</Button>
                                    </DialogClose>
                                </fetcher.Form>
                            </DialogContent>
                        </Dialog>
                    </AdminActions>
                </AdminHeader>
            </AdminSectionWrapper>
            <div className="flex gap-1">
                {tables.map(table => (
                    <Link
                        key={table.table}
                        to={table.table}
                        className="flex items-center gap-2"
                    >
                        <Button variant={'link'} className="space-x-1">
                            <Icon name={table.icon} size={16} />
                            <p>{table.tableName}</p>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    )
}
