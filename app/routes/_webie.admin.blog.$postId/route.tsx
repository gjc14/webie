import { ActionFunctionArgs, json } from '@remix-run/node'
import { Form, Link, useFetcher, useParams } from '@remix-run/react'
import { ExternalLink, Loader2, Save, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'
import { z } from 'zod'

import { PostContent } from '~/components/cms/post-content'
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
import { updatePost } from '~/lib/db/post.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { PostStatus } from '~/schema/database'
import { useAdminBlogContext } from '../_webie.admin.blog/route'

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
    const admin = await userIs(request, 'ADMIN', '/admin/signin')

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
        return json<ConventionalError>({ err: message }, { status: 400 })
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

        return json<ConventionalSuccess>({
            msg: `Post ${post.title} updated successfully`,
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>({
            data: null,
            err: 'Failed to create post',
        })
    }
}

export default function AdminPost() {
    const fetcher = useFetcher()
    const params = useParams()
    const postId = params.postId
    const { posts } = useAdminBlogContext()
    const post = posts.find(p => p.id === postId)

    if (!post) {
        return (
            <h2 className="grow flex items-center justify-center">Not found</h2>
        )
    }

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
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle description={'Post id: ' + post.id}>
                    Edit Post
                </AdminTitle>
                <AdminActions>
                    <Link
                        to={`/blog/${post.slug}?preview=true`}
                        target="_blank"
                    >
                        <Button variant={'link'}>
                            {postContent.status !== 'PUBLISHED'
                                ? 'Preview'
                                : 'See'}{' '}
                            post
                            <ExternalLink size={12} className="ml-1" />
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size={'sm'} variant={'destructive'}>
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
                                <Link to="/admin/blog">
                                    <AlertDialogAction
                                        onClick={() => {
                                            window.localStorage.removeItem(
                                                `dirty-post-${postContent.id}`
                                            )
                                        }}
                                    >
                                        Discard
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button form="update-post" size={'sm'}>
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
