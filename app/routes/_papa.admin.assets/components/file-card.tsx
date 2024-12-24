import {
    AudioWaveform,
    Expand,
    ExternalLink,
    File,
    Film,
    Trash2,
} from 'lucide-react'
import { forwardRef, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { FileMeta } from '~/routes/_papa.admin.api.object-storage/schema'

export type FileCardProps = {
    file: FileMeta
    className?: string
    onSelect?: (file: FileMeta) => void
    onUpdate?: (file: FileMeta) => void
    onDelete?: (file: FileMeta) => void
}

export const FileCard = ({
    file,
    className,
    onSelect,
    onUpdate,
    onDelete,
}: FileCardProps) => {
    const nameRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLTextAreaElement>(null)
    const [open, setOpen] = useState(false)
    const [deleteAlert, setDeleteAlert] = useState(false)
    const fileGeneralType = file.type.split('/')[0]

    const handleSelect = () => {
        onSelect?.(file)
    }

    const handleUpdate = () => {
        onUpdate?.({
            ...file,
            name: nameRef.current?.value || file.name,
            description: descRef.current?.value || file.description,
        })
        setOpen(false)
    }

    const handleDelete = () => {
        onDelete?.(file)
        setDeleteAlert(false)
        setOpen(false)
    }

    return (
        <div
            className={cn(
                'group relative flex flex-col items-center justify-center border rounded-lg aspect-square overflow-hidden',
                className
            )}
            onClick={e => e.stopPropagation()}
        >
            {fileGeneralType === 'image' ? (
                <img src={file.url} alt={file.name} className="" />
            ) : fileGeneralType === 'video' ? (
                <Film />
            ) : fileGeneralType === 'audio' ? (
                <AudioWaveform />
            ) : (
                <File />
            )}
            {deleteAlert && (
                <div className="absolute w-full h-full flex flex-col justify-center items-center backdrop-blur-sm gap-1.5 pt-3">
                    <Button
                        variant={'destructive'}
                        size={'sm'}
                        className="h-7 px-1.5 text-[10px]"
                        onClick={handleDelete}
                    >
                        Delete permanently
                    </Button>
                    <button
                        className="text-[10px] underline-offset-2 hover:underline"
                        onClick={() => setDeleteAlert(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* options */}
            <div
                className={cn(
                    `hidden ${deleteAlert ? '' : 'group-hover:flex'}`,
                    'absolute bottom-3 left-[50%] translate-x-[-50%] bg-primary-foreground',
                    'border rounded-lg items-center justify-center px-1 py-0.5 gap-1'
                )}
            >
                <ToolBarButton
                    onClick={() => setDeleteAlert(true)}
                    className="hover:text-destructive-foreground hover:bg-destructive"
                >
                    <Trash2 />
                </ToolBarButton>

                <ToolBarButton onClick={() => setOpen(true)}>
                    <Expand />
                </ToolBarButton>
            </div>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="max-h-[90vh] overflow-scroll"
                    onClick={e => e.stopPropagation()}
                >
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="flex grid-cols-3 items-center gap-1.5">
                            {onSelect ? (
                                <Button
                                    size={'sm'}
                                    onClick={handleSelect}
                                    asChild
                                >
                                    <DialogClose>Select</DialogClose>
                                </Button>
                            ) : (
                                <Label htmlFor="name">Filename</Label>
                            )}
                            <Input
                                ref={nameRef}
                                id="name"
                                placeholder="File name"
                                defaultValue={file.name}
                                className="grow"
                            />
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant={'ghost'}>
                                    <ExternalLink className="w-5 h-5" />
                                </Button>
                            </a>
                        </DialogTitle>
                        <DialogDescription className="min-h-36 flex flex-col justify-center items-center gap-2 border rounded-lg overflow-hidden">
                            {fileGeneralType === 'image' ? (
                                <img
                                    className="max-h-[50vh]"
                                    src={file.url}
                                    alt={file.name}
                                />
                            ) : fileGeneralType === 'video' ? (
                                <video
                                    src={file.url}
                                    controls
                                    className="w-full"
                                >
                                    Your browser does not support the
                                    <code>video</code> element.
                                </video>
                            ) : fileGeneralType === 'audio' ? (
                                <audio
                                    src={file.url}
                                    controls
                                    className="w-full"
                                >
                                    Your browser does not support the
                                    <code>audio</code> element.
                                </audio>
                            ) : (
                                <>
                                    <File />
                                    {file.type}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-1.5 overflow-scroll px-1">
                        <div className="w-full gap-2">
                            <Label htmlFor="id" className="px-1">
                                ID
                            </Label>
                            <p
                                id="id"
                                className="shadow-sm flex-1 min-h-0 text-sm border rounded-lg py-1 px-1.5 overflow-y-auto cursor-copy"
                                onClick={() => {
                                    navigator.clipboard.writeText(file.id)
                                    toast.success('Copied to clipboard')
                                }}
                            >
                                {file.id}
                            </p>
                        </div>
                        <div className="w-full gap-2">
                            <Label htmlFor="url" className="px-1">
                                URL
                            </Label>
                            <p
                                id="url"
                                className="shadow-sm flex-1 min-h-0 text-sm border rounded-lg py-1 px-1.5 overflow-y-auto cursor-copy"
                                onClick={() => {
                                    navigator.clipboard.writeText(file.url)
                                    toast.success('Copied to clipboard')
                                }}
                            >
                                {file.url}
                            </p>
                        </div>

                        <div className="w-full gap-2">
                            <Label htmlFor="description" className="px-1">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                ref={descRef}
                                placeholder="Description"
                                defaultValue={file.description ?? ''}
                            ></Textarea>
                        </div>

                        <div id="file-details" className="w-full my-2 px-1">
                            <p className="text-sm">
                                <strong>File Type:</strong> {file.type}
                            </p>
                            <p className="text-sm">
                                <strong>File Size:</strong>{' '}
                                {file.size > 1024 * 1024 * 1024
                                    ? `${Math.round(
                                          file.size / 1024 / 1024 / 1024
                                      )} GB`
                                    : file.size > 1024 * 1024
                                    ? `${Math.round(
                                          file.size / 1024 / 1024
                                      )} MB`
                                    : `${Math.round(file.size / 1024)} KB`}
                            </p>
                            <p className="text-sm">
                                <strong>Last Modified:</strong>{' '}
                                {new Date(file.updatedAt).toLocaleString()}
                            </p>
                        </div>

                        {
                            <Button className="w-full" onClick={handleUpdate}>
                                Save
                            </Button>
                        }
                        <Separator className="my-3" />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant={'link'}
                                    className="p-0 h-fit w-fit"
                                >
                                    Delete permanently
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Continute delete this file permanently?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete {file.name} servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete permanently
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const ToolBarButton = forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type, ...props }, ref) => {
    return (
        <button
            ref={ref}
            type={type || 'button'}
            className={cn(
                'inline-flex items-center justify-center gap-2 whitespace-nowrap p-1 size-6 cursor-pointer transition-colors rounded-full hover:bg-accent',
                className
            )}
            {...props}
        />
    )
})
