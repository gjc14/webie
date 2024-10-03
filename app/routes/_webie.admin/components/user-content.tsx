import { User } from '@prisma/client'
import { Form, useFetcher } from '@remix-run/react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { UserRole, UserStatus } from '~/schema/database'

export const UserContent = ({
    user,
    open,
    setOpen,
    action,
    method,
}: {
    user: User
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    action: string
    method: 'PUT' | 'POST'
}) => {
    const fetcher = useFetcher()
    const isSubmitting = fetcher.formAction === action

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-scroll">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done. Last updated on{' '}
                        {user.updatedAt.toLocaleString('zh-TW')}
                    </DialogDescription>
                </DialogHeader>
                <Form
                    id="user-content"
                    className="grid gap-4 py-4"
                    onSubmit={e => {
                        e.preventDefault()
                        fetcher.submit(new FormData(e.currentTarget), {
                            method,
                            action,
                        })
                    }}
                >
                    <input type="hidden" name="id" defaultValue={user.id} />
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            defaultValue={user.email}
                            className="col-span-3"
                            placeholder="ur@e.mail"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name ?? undefined}
                            className="col-span-3"
                            placeholder="what's your name?"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue
                                    id="role"
                                    placeholder="what's your role?"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(UserRole.enum).map(role => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select name="status" defaultValue={user.status}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue
                                    id="status"
                                    placeholder="what's your status?"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(UserStatus.enum).map(status => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </Form>
                <DialogFooter>
                    <Button form="user-content">
                        {isSubmitting ? (
                            <Loader2
                                size={16}
                                className="mr-1.5 animate-spin"
                            />
                        ) : (
                            <Save size={16} className="mr-1.5" />
                        )}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
