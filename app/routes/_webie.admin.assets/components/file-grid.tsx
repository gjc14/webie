import { CloudUploadIcon, CupSoda } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { Button } from '~/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
import {
    FileMeta,
    FileUploaded,
} from '~/routes/_webie.admin.api.object-storage/schema'
import { fetchPresignedUrls } from '../utils'
import { FileCard } from './file-card'

export interface FileGridProps {
    files: ({ file: File } & FileMeta)[]
    onFileSelect?: (file: File) => void
    onFileUpdate?: (fileMeta: FileMeta) => void
    onFileDelete?: (fileId: string) => void
    dialogTrigger?: React.ReactNode
    uploadMode?: 'single' | 'multiple'
    onUpload?: (files: File[]) => void
}

/**
 * FileGrid Component should be wrap in display: flex as it uses flex: 1 to grow
 * @param dialogTrigger Add ReactNode to use FileGrid as Dialog
 */
export const FileGrid = (props: FileGridProps) => {
    if (!props.dialogTrigger) {
        return <FileGridMain {...props} />
    } else if (props.dialogTrigger) {
        return (
            <Dialog>
                <DialogTrigger asChild>{props.dialogTrigger}</DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-scroll">
                    <DialogHeader>
                        <DialogTitle>Assets</DialogTitle>
                        <DialogDescription>
                            Lists all your asstes here, You could drag or click
                            to upload your file
                        </DialogDescription>
                    </DialogHeader>

                    <FileGridMain {...props} />

                    <DialogFooter></DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }
}

const FileGridMain = ({
    files,
    onFileSelect,
    onFileUpdate,
    onFileDelete,
    uploadMode,
    onUpload,
}: FileGridProps) => {
    ///////////////////////////////////////////
    ///        Drag, Drop and Upload        ///
    ///////////////////////////////////////////
    const [filesUploaded, setFilesUploaded] = useState<FileUploaded[]>([])
    const [acceptedTypes, setAcceptedTypes] = useState({
        images: true,
        videos: true,
        audio: true,
        documents: true,
    })

    const getAcceptedFileTypes = useCallback(() => {
        const types: { [type: string]: [] } = {}
        if (acceptedTypes.images) types['image/*'] = []
        if (acceptedTypes.videos) types['video/*'] = []
        if (acceptedTypes.audio) types['audio/*'] = []
        if (acceptedTypes.documents) {
            types['application/pdf'] = []
            types['text/plain'] = []
        }
        return types
    }, [acceptedTypes])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: getAcceptedFileTypes(),
        onDrop: acceptedFiles => {
            setFilesUploaded(prev => {
                // see: https://react-dropzone.js.org/#section-previews
                const newFiles = acceptedFiles.map(file => ({
                    file,
                    id: crypto.randomUUID(),
                    url: URL.createObjectURL(file),
                    name: file.name,
                    description: '',
                }))

                return [...prev, ...newFiles]
            })
        },
    })

    const updateFilesUploaded = (fileMeta: FileMeta) => {
        setFilesUploaded(prev => {
            return prev.map(file => {
                if (file.id === fileMeta.id) {
                    return { ...file, ...fileMeta }
                }
                return file
            })
        })
    }

    const removeFileUploaded = (fileId: string) => {
        setFilesUploaded(prev => {
            const fileToRemove = prev.find(f => f.id === fileId)
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.url)
            }
            return prev.filter(f => f.id !== fileId)
        })
    }

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () =>
            filesUploaded.forEach(fileData => URL.revokeObjectURL(fileData.url))
    }, [filesUploaded])

    // Handle submitting files uploaded
    const onSubmit = async () => {
        try {
            const presignedFiles = await fetchPresignedUrls(filesUploaded)
            console.log('Presigned files', presignedFiles)
            // Upload with presigned URLs
        } catch (error) {
            console.error('Error uploading files', error)
        }
    }

    ////////////////////////////////////////////
    ///   File handling for existing files   ///
    ////////////////////////////////////////////
    const [fileState, setFileState] = useState<FileGridProps['files']>(files)

    const handleFileSelect = (file: File) => {
        onFileSelect?.(file)
    }

    const handleFileUpdate = (fileMeta: FileMeta) => {
        setFileState(prev => {
            return prev.map(file => {
                if (file.id === fileMeta.id) {
                    return { ...file, ...fileMeta }
                }
                return file
            })
        })
        onFileUpdate?.(fileMeta)

        // Handle uploaded files
        updateFilesUploaded(fileMeta)
    }

    const handleFileDelete = (fileId: string) => {
        setFileState(prev => {
            return prev.filter(file => file.id !== fileId)
        })
        onFileDelete?.(fileId)

        // Handle uploaded files
        removeFileUploaded(fileId)
    }

    return (
        <div
            className={cn(
                'relative h-auto grow p-3 border-2 border-dashed rounded-xl',
                isDragActive
                    ? 'border-4 border-sky-600 dark:border-sky-600'
                    : ''
            )}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <div
                className={cn(
                    'z-10 absolute h-full w-full inset-0 flex justify-center items-center bg-muted rounded-lg',
                    isDragActive ? '' : 'hidden'
                )}
            >
                <CloudUploadIcon className="w-12 h-12 text-primary" />
            </div>
            {/* TODO: Fix when length < 5 the FileCard takes all the width and grows too wide */}
            {filesUploaded.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
                    {filesUploaded.map((file, index) => {
                        return (
                            <FileCard
                                key={index}
                                file={file.file}
                                fileMeta={file}
                                onSelect={handleFileSelect}
                                onUpdate={handleFileUpdate}
                                onDelete={handleFileDelete}
                            />
                        )
                    })}
                </div>
            ) : fileState.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
                    {fileState.map((file, index) => {
                        return (
                            <FileCard
                                key={index}
                                file={file.file}
                                fileMeta={file}
                                onSelect={handleFileSelect}
                                onUpdate={handleFileUpdate}
                                onDelete={handleFileDelete}
                            />
                        )
                    })}
                </div>
            ) : (
                <div className="w-full h-full min-h-60 grow flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <CupSoda size={50} />
                    <p>
                        No file found, drag and drop, or click to select files
                        now
                    </p>
                    <Button size={'sm'}>
                        <CloudUploadIcon className="size-6" />
                        Upload now
                    </Button>
                </div>
            )}
        </div>
    )
}
