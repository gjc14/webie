import { z } from 'zod'

export const FileMetaSchema = z
    .object({
        id: z.string(),
        key: z.string(),
        url: z.string(),
        type: z.string(),
        name: z.string(),
        description: z.string().nullable(),
    })
    .catchall(z.any())
export type FileMeta = z.infer<typeof FileMetaSchema>

export type FileMetaWithFile = {
    file: File
} & FileMeta

// Request schemas
export const FilePresignArgsSchema = z.object({
    key: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
    checksum: z.string(),
    description: z.string().optional(),
})
export const PresignRequestSchema = z.array(FilePresignArgsSchema)
export type PresignRequest = z.infer<typeof PresignRequestSchema>

// Response schemas
export const PresignedUrlSchema = z.object({
    id: z.string(), // From database
    updatedAt: z.string(), // From database
    key: z.string(),
    presignedUrl: z.string().url(),
})
export const PresignResponseSchema = z.object({
    urls: z.array(PresignedUrlSchema),
})
