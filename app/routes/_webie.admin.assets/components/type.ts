export type FileMeta = Record<string, any> & {
    id: string
    url: string
    name: string
    description: string
}

export type FileCardProps = {
    file: File
    fileMeta: FileMeta
    className?: string
    onSelect?: (file: File, fileMeta: FileMeta) => void
    onUpdate?: (fileMeta: FileMeta) => void
    onDelete?: (fileId: string) => void
}

export interface FileGridProps {
    files: ({ file: File } & FileMeta)[]
    onFileSelect?: (file: File) => void
    onFileUpdate?: (fileMeta: FileMeta) => void
    onFileDelete?: (fileId: string) => void
    dialogTrigger?: React.ReactNode
    uploadMode?: 'single' | 'multiple'
    onUpload?: (files: File[]) => void
}
