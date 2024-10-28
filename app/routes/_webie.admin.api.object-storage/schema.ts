import { z } from 'zod'

export type FileMeta = {
    id: string
    url: string
    name: string
    description: string
    [key: string]: any
}

export type FileUploaded = FileMeta & {
    file: File
    presignedUrl?: string
}

// Request schemas
export const FilePresignArgsSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
})
export const PresignRequestSchema = z.array(FilePresignArgsSchema)
export type PresignRequest = z.infer<typeof PresignRequestSchema>

// Response schemas
export const PresignedUrlSchema = z.object({
    id: z.string(),
    presignedUrl: z.string().url(),
})
export const PresignResponseSchema = z.object({
    urls: z.array(PresignedUrlSchema),
})
