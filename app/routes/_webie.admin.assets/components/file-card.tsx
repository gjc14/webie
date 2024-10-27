import {
    AudioWaveform,
    Expand,
    ExternalLink,
    File,
    Film,
    Trash2,
} from 'lucide-react'
import { forwardRef, useCallback, useRef, useState } from 'react'
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
import { FileCardProps } from './type'

export const FileCard = ({
    file,
    fileMeta,
    className,
    onSelect,
    onUpdate,
    onDelete,
}: FileCardProps) => {
    const nameRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLTextAreaElement>(null)
    const [open, setOpen] = useState(false)
    const [deleteAlert, setDeleteAlert] = useState(false)

    const getFileType = useCallback(
        (file: File): 'image' | 'video' | 'audio' | 'unknown' => {
            if (file.type.startsWith('image/')) {
                return 'image'
            } else if (file.type.startsWith('video/')) {
                return 'video'
            } else if (file.type.startsWith('audio/')) {
                return 'audio'
            } else {
                return 'unknown'
            }
        },
        [file]
    )

    const fileType = getFileType(file)

    const handleUpdate = () => {
        onUpdate?.({
            ...fileMeta,
            name: nameRef.current?.value || fileMeta.name,
            description: descRef.current?.value || fileMeta.description,
        })
        setOpen(false)
    }

    const handleDelete = () => {
        onDelete?.(fileMeta.id)
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
            {fileType === 'image' ? (
                <img src={fileMeta.url} alt={fileMeta.name} className="" />
            ) : fileType === 'video' ? (
                <Film />
            ) : fileType === 'audio' ? (
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
                        onClick={() => {
                            handleDelete()
                            setDeleteAlert(false)
                        }}
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
                                    onClick={() => {
                                        onSelect?.(file, fileMeta)
                                    }}
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
                                defaultValue={fileMeta.name}
                                className="grow"
                                onChange={e =>
                                    console.log('name', e.target.value)
                                }
                            />
                            <a
                                href={fileMeta.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant={'ghost'}>
                                    <ExternalLink className="w-5 h-5" />
                                </Button>
                            </a>
                        </DialogTitle>
                        <DialogDescription className="min-h-36 flex flex-col justify-center items-center gap-2 border rounded-lg overflow-hidden">
                            {fileType === 'image' ? (
                                <img
                                    className="max-h-[50vh]"
                                    src={fileMeta.url}
                                    alt={fileMeta.name}
                                />
                            ) : fileType === 'video' ? (
                                <video
                                    src={fileMeta.url}
                                    controls
                                    className="w-full"
                                >
                                    Your browser does not support the
                                    <code>video</code> element.
                                </video>
                            ) : fileType === 'audio' ? (
                                <audio
                                    src={fileMeta.url}
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
                        <p
                            className="shadow-sm w-full min-h-0 text-sm border rounded-lg py-1 px-1.5 overflow-y-auto cursor-copy"
                            onClick={() => {
                                navigator.clipboard.writeText(fileMeta.id)
                                toast.success('Copied to clipboard')
                            }}
                        >
                            {fileMeta.id}
                        </p>
                        <p
                            className="shadow-sm w-full min-h-0 text-sm border rounded-lg py-1 px-1.5 overflow-y-auto cursor-copy"
                            onClick={() => {
                                navigator.clipboard.writeText(fileMeta.url)
                                toast.success('Copied to clipboard')
                            }}
                        >
                            {fileMeta.url}
                        </p>
                        <Textarea
                            ref={descRef}
                            placeholder="Description"
                            defaultValue={fileMeta.description}
                            onChange={e => console.log('desc', e.target.value)}
                        ></Textarea>

                        {
                            <Button
                                className="w-full"
                                onClick={() => handleUpdate()}
                            >
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
                                        permanently delete {fileMeta.name}{' '}
                                        servers.
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
