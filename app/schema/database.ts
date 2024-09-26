import { z } from 'zod'

export const UserRole = z.enum(['ADMIN', 'AUTHOR', 'EDITOR', 'SUBSCRIBER'])
export type UserRole = z.infer<typeof UserRole>

export const UserStatus = z.enum([
	'VIP',
	'ACTIVE',
	'INACTIVE',
	'BLOCKED',
	'SUSPENDED',
])
export type UserStatus = z.infer<typeof UserStatus>

export const PostStatus = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'TRASHED'])
export type PostStatus = z.infer<typeof PostStatus>

export const UserSchema = z.object({
	id: z.string(),
	updatedAt: z.date(),
	email: z.string().email(),
	name: z.string().nullable(),
	role: UserRole,
	status: UserStatus,
})

export const PostSchema = z.object({
	id: z.string(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date(),
	slug: z.string(),
	title: z.string(),
	content: z.string().nullable(),
	status: PostStatus,
	authorId: z.string(),
	seoId: z.string(),
})

export const SeoSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	title: z.string().nullable(),
	description: z.string().nullable(),
	route: z.string().nullable(),
})
