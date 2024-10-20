import { Post, Seo } from '@prisma/client'
import { useRef, useState } from 'react'

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

export type EditPost = Post & {
    seo: {
        title: Seo['title']
        description: Seo['description']
    }
}

interface PostContentProps {
    post?: EditPost
    onPostContentChange: (post: EditPost) => void
}

export const PostContent = ({
    post = newPost,
    onPostContentChange,
}: PostContentProps) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const slugRef = useRef<HTMLInputElement>(null)
    const seoTitleRef = useRef<HTMLInputElement>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const [content, setContent] = useState(post.content)

    return (
        <div className="w-full flex flex-col md:flex-row gap-5">
            <section className="flex flex-col gap-5">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        ref={titleRef}
                        id="title"
                        name="title"
                        type="text"
                        placeholder="What is your post title?"
                        defaultValue={post.title}
                        onChange={e =>
                            onPostContentChange({
                                ...post,
                                title: e.target.value,
                            })
                        }
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
                            defaultValue={content}
                        />
                        <DefaultTipTap
                            content={content}
                            onUpdate={updateContent => {
                                setContent(updateContent)

                                onPostContentChange({
                                    ...post,
                                    content: updateContent,
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
                        defaultValue={post.status}
                        name="status"
                        onValueChange={v =>
                            onPostContentChange({ ...post, status: v })
                        }
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
                            ref={slugRef}
                            id="slug"
                            name="slug"
                            type="text"
                            placeholder="How to display your post in the URL?"
                            defaultValue={post.slug}
                            onChange={e =>
                                onPostContentChange({
                                    ...post,
                                    slug: e.target.value,
                                })
                            }
                        />
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => {
                                if (titleRef.current && slugRef.current) {
                                    const title = titleRef.current.value
                                    const slug = title
                                        .replace(/^\s+|\s+$/g, '')
                                        .toLowerCase()
                                        .replace(/[^a-z0-9 -]/g, '')
                                        .replace(/\s+/g, '-')
                                        .replace(/-+/g, '-')
                                    slugRef.current.value = slug
                                }
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
                        defaultValue={post.excerpt}
                        onChange={e =>
                            onPostContentChange({
                                ...post,
                                excerpt: e.target.value,
                            })
                        }
                    />
                </div>

                <Separator />

                <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <div className="flex items-center gap-1.5">
                        <Input
                            ref={seoTitleRef}
                            id="seo-title"
                            name="seo-title"
                            type="text"
                            placeholder="Meta tilte should match Title (H1) for SEO."
                            defaultValue={post.seo.title ?? undefined}
                            onChange={e =>
                                onPostContentChange({
                                    ...post,
                                    seo: {
                                        ...post.seo,
                                        title: e.target.value,
                                    },
                                })
                            }
                        />
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => {
                                if (titleRef.current && seoTitleRef.current) {
                                    seoTitleRef.current.value =
                                        titleRef.current.value
                                }
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
                        defaultValue={post.seo.description ?? undefined}
                        onChange={e =>
                            onPostContentChange({
                                ...post,
                                seo: {
                                    ...post.seo,
                                    description: e.target.value,
                                },
                            })
                        }
                    />
                </div>
            </section>
        </div>
    )
}

const newPost: EditPost = {
    id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: '',
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'DRAFT',
    authorId: '',
    seoId: '',
    tagIDs: [],
    categoryIDs: [],
    subCategoryIDs: [],
    seo: {
        title: '',
        description: '',
    },
}
