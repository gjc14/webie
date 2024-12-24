import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useFetcher } from '@remix-run/react'
import { Loader2, PlusCircle, Trash } from 'lucide-react'
import { useState } from 'react'
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
import { createPost } from '~/lib/db/post.server'
import { commitFlashSession, getFlashSession } from '~/lib/sessions.server'
import { ConventionalError } from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { PostStatus } from '~/schema/database'

const PostCreateSchema = z.object({
    title: z.string(),
    content: z.string(),
    excerpt: z.string(),
    slug: z.string(),
    status: PostStatus,
    'seo-title': z.string(),
    'seo-description': z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
    const { user: admin } = await userIs(request, 'ADMIN', '/admin/signin')

    if (request.method !== 'POST') {
        throw new Response('Method not allowed', { status: 405 })
    }

    const formData = await request.formData()
    const createPostData = Object.fromEntries(formData)

    const zResult = PostCreateSchema.safeParse(createPostData)

    if (!zResult.success || !zResult.data) {
        console.log('createPostData', zResult.error.issues)
        const message = zResult.error.issues
            .map(issue => `${issue.message} ${issue.path[0]}`)
            .join(' & ')
        return json<ConventionalError>({ err: message }, { status: 400 })
    }

    try {
        const { post } = await createPost({
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

        const flashSession = await getFlashSession()
        flashSession.flash('success', [
            `Post "${post.title}" created successfully`,
        ])

        return redirect(`/admin/blog/${post.id}`, {
            headers: {
                'Set-Cookie': await commitFlashSession(flashSession),
            },
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { err: 'Failed to create post' },
            { status: 500 }
        )
    }
}

export default function AdminPost() {
    const fetcher = useFetcher()
    const [isDirty, setIsDirty] = useState(false)
    const isSubmitting = fetcher.state === 'submitting'

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle title="New Post"></AdminTitle>
                <AdminActions>
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
                                    Are you sure you want to discard this post?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Link to="/admin/blog">
                                    <AlertDialogAction
                                        onClick={() => {
                                            window.localStorage.removeItem(
                                                `dirty-post-new`
                                            )
                                        }}
                                    >
                                        Discard
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button type="submit" form="new-post" size={'sm'}>
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <PlusCircle size={16} />
                        )}
                        <p className="text-xs">Save</p>
                    </Button>
                </AdminActions>
            </AdminHeader>

            <Form
                id="new-post"
                onSubmit={e => {
                    e.preventDefault()
                    fetcher.submit(e.currentTarget, { method: 'POST' })
                    setIsDirty(false)
                }}
            >
                <PostContent onPostChange={(_, dirty) => setIsDirty(dirty)} />
            </Form>
        </AdminSectionWrapper>
    )
}
