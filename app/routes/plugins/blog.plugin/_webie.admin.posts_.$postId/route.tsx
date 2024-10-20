import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useFetcher, useLoaderData } from '@remix-run/react'
import { ExternalLink, Loader2, Save, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'
import { z } from 'zod'

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
import { userIs } from '~/lib/db/auth.server'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { PostContent } from '~/routes/plugins/blog.plugin/components/post-content'
import { PostStatus } from '~/schema/database'
import { getPost, updatePost } from '../lib/db/post.server'

const PostContentUpdateSchema = z
    .object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        excerpt: z.string().optional().default(''),
        slug: z.string(),
        status: PostStatus,
        'seo-title': z.string(),
        'seo-description': z.string(),
    })
    .refine(data => {
        if (!data.excerpt) {
            const content = data.content
            const excerpt = content.match(/[\s\S]{1,50}/u)?.[0] || ''
            data.excerpt = excerpt
        }
        return true
    })

export const action = async ({ request }: ActionFunctionArgs) => {
    const admin = await userIs(
        request.headers.get('Cookie'),
        'ADMIN',
        '/admin/signin'
    )

    if (request.method !== 'PUT') {
        throw new Response('Method not allowed', { status: 405 })
    }

    const formData = await request.formData()
    const updatePostData = Object.fromEntries(formData)

    const zResult = PostContentUpdateSchema.safeParse(updatePostData)

    if (!zResult.success || !zResult.data) {
        console.log('updatePostData', zResult.error.issues)
        const message = zResult.error.issues
            .map(issue => `${issue.message} ${issue.path[0]}`)
            .join(' & ')
        return json({ data: null, err: message }, { status: 400 })
    }

    try {
        const { post } = await updatePost({
            id: zResult.data.id,
            title: zResult.data.title,
            content: zResult.data.content,
            excerpt: zResult.data.excerpt,
            slug: zResult.data.slug,
            status: zResult.data.status,
            authorId: admin.id,
            seo: {
                metaTitle: zResult.data['seo-title'],
                metaDescription: zResult.data['seo-description'],
            },
        })

        return json({ msg: `Post ${post.title} updated successfully` })
    } catch (error) {
        console.error(error)
        return json({ data: null, err: 'Failed to create post' })
    }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const postId = params.postId
    if (!postId) {
        throw new Response('Bad request', { status: 400 })
    }

    try {
        const { post } = await getPost(postId)
        if (!post) {
            throw new Error('Post not found')
        }
        return json({ post })
    } catch (error) {
        console.error(error)
        throw new Error('Failed to get post')
    }
}

export default function AdminPost() {
    const fetcher = useFetcher()
    const { post } = useLoaderData<typeof loader>()
    const [isDirty, setIsDirty] = useState(false)

    const postContent = useMemo(() => {
        return {
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
        }
    }, [post])

    const isSubmitting = fetcher.state === 'submitting'

    return (
        <AdminSectionWrapper
            shouldConfirm={isDirty}
            promptTitle="Discard Post"
            promptMessage="You have unsaved changes. Are you sure you want to leave?"
        >
            <AdminHeader>
                <AdminTitle description={'Post id: ' + post.id}>
                    Edit Post
                </AdminTitle>
                <AdminActions>
                    <Link to={`/blog/${post.slug}`} target="_blank">
                        <Button variant={'link'}>
                            See post
                            <ExternalLink size={12} className="ml-1" />
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="space-x-1.5"
                                size={'sm'}
                                variant={'destructive'}
                            >
                                <Trash height={16} width={16} />
                                <p className="text-xs">Discard</p>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Discard Post
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to discard this post
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Link to="/admin/posts">
                                    <AlertDialogAction>
                                        Discard
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        form="update-post"
                        className="space-x-1.5"
                        size={'sm'}
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <p className="text-xs">Save</p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <Form
                id="update-post"
                onSubmit={e => {
                    e.preventDefault()
                    fetcher.submit(e.currentTarget, { method: 'PUT' })
                    setIsDirty(false)
                }}
            >
                <input hidden name="id" defaultValue={post.id} />
                <PostContent
                    post={postContent}
                    onPostChange={(_, dirty) => setIsDirty(dirty)}
                />
            </Form>
        </AdminSectionWrapper>
    )
}
