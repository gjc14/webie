import { Post, Seo } from '@prisma/client'
import { useEffect, useRef, useState } from 'react'

import DefaultTipTap from '~/components/editor/default-tiptap'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { PostStatus } from '~/schema/database'

export type PostContentEdit = Post & {
    seo: {
        title: Seo['title']
        description: Seo['description']
    }
}

interface PostContentProps {
    post?: PostContentEdit
    onPostChange?: (post: PostContentEdit, dirty: boolean) => void
}

export const PostContent = ({
    post = newPost,
    onPostChange,
}: PostContentProps) => {
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const [postContent, setPostContent] = useState<PostContentEdit>(post)

    useEffect(() => {
        setPostContent(post)
    }, [post])

    useEffect(() => {
        const isDirty = JSON.stringify(postContent) !== JSON.stringify(post)
        onPostChange?.(postContent, isDirty)

        // // TODO: Persist the post if dirty
        // if (window) {
        //     window.localStorage.setItem(
        //         `postContent-${postContent.id}`,
        //         JSON.stringify(postContent)
        //     )
        // }
    }, [postContent])

    return (
        <div className="w-full flex flex-col md:flex-row gap-5">
            <section className="flex flex-col gap-5">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="What is your post title?"
                        value={postContent.title}
                        onChange={e => {
                            setPostContent(prev => {
                                const newPost = {
                                    ...prev,
                                    title: e.target.value,
                                }
                                return newPost
                            })
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="content">Content</Label>
                    <div
                        ref={contentWrapperRef}
                        className="p-3 border border-border rounded-md"
                        style={{ maxWidth: 'calc(65ch + 1.5rem)' }} // max-w-prose + p-3 padding
                    >
                        <input
                            id="content"
                            type="hidden"
                            name="content"
                            readOnly
                            value={postContent.content}
                        />
                        <DefaultTipTap
                            content={postContent.content}
                            onUpdate={updateContent => {
                                setPostContent(prev => {
                                    const newPost = {
                                        ...prev,
                                        content: updateContent,
                                    }
                                    return newPost
                                })
                            }}
                            onFocus={() => {
                                contentWrapperRef.current?.classList.add(
                                    'border-primary'
                                )
                            }}
                            onBlur={() => {
                                contentWrapperRef.current?.classList.remove(
                                    'border-primary'
                                )
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="grow flex flex-col gap-5">
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={postContent.status}
                        name="status"
                        onValueChange={v => {
                            setPostContent(prev => {
                                const newPost = {
                                    ...prev,
                                    status: v,
                                }
                                return newPost
                            })
                        }}
                    >
                        <SelectTrigger id="status" className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(PostStatus.enum).map(status => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="slug">Slug</Label>
                    <div className="flex items-center gap-1.5">
                        <Input
                            id="slug"
                            name="slug"
                            type="text"
                            placeholder="How to display your post in the URL?"
                            value={postContent.slug}
                            onChange={e => {
                                setPostContent(prev => {
                                    const newPost = {
                                        ...prev,
                                        slug: e.target.value,
                                    }
                                    return newPost
                                })
                            }}
                        />
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => {
                                const slug = postContent.title
                                    .replace(/^\s+|\s+$/g, '')
                                    .toLowerCase()
                                    .replace(/[^a-z0-9 -]/g, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/-+/g, '-')

                                setPostContent(prev => {
                                    const newPost = {
                                        ...prev,
                                        slug,
                                    }
                                    return newPost
                                })
                            }}
                        >
                            Generate
                        </Button>
                    </div>
                </div>

                <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        rows={3}
                        placeholder="If empty, the first 50 caracteres of the content will be used."
                        value={postContent.excerpt}
                        onChange={e => {
                            setPostContent(prev => {
                                const newPost = {
                                    ...prev,
                                    excerpt: e.target.value,
                                }
                                return newPost
                            })
                        }}
                    />
                </div>

                <Separator />

                <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <div className="flex items-center gap-1.5">
                        <Input
                            id="seo-title"
                            name="seo-title"
                            type="text"
                            placeholder="Meta tilte should match Title (H1) for SEO."
                            value={postContent.seo.title ?? ''}
                            onChange={e => {
                                setPostContent(prev => {
                                    const newPost = {
                                        ...prev,
                                        seo: {
                                            ...prev.seo,
                                            title: e.target.value,
                                        },
                                    }
                                    return newPost
                                })
                            }}
                        />
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => {
                                setPostContent(prev => {
                                    const newPost = {
                                        ...prev,
                                        seo: {
                                            ...prev.seo,
                                            title: postContent.title,
                                        },
                                    }
                                    return newPost
                                })
                            }}
                        >
                            Copy Title
                        </Button>
                    </div>
                </div>
                <div>
                    <Label htmlFor="seo-description">SEO Description</Label>
                    <Textarea
                        id="seo-description"
                        name="seo-description"
                        rows={3}
                        placeholder="Short description about your post..."
                        value={postContent.seo.description ?? ''}
                        onChange={e => {
                            setPostContent(prev => {
                                const newPost = {
                                    ...prev,
                                    seo: {
                                        ...prev.seo,
                                        description: e.target.value,
                                    },
                                }
                                return newPost
                            })
                        }}
                    />
                </div>
            </section>
        </div>
    )
}

const newPost: PostContentEdit = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: '',
    title: '',
    content: '',
    excerpt: '',
    featuredImage: null,
    status: 'DRAFT',
    authorId: '',
    seoId: '',
    tagIDs: [],
    categoryIDs: [],
    subCategoryIDs: [],
    seo: {
        title: null,
        description: null,
    },
}
