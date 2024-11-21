import { Post, Seo } from '@prisma/client'
import { useEffect, useRef, useState } from 'react'

import DefaultTipTap, { EditorRef } from '~/components/editor/default-tiptap'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog'
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

// TODO: Add featured image; tags, categories, subcategories selection; edit author; publish schedule
// TODO: Editor upload image; link setting popup
export const PostContent = ({
    post = newPost,
    onPostChange,
}: PostContentProps) => {
    const editorRef = useRef<EditorRef | null>(null)
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const localStorageContent = useRef<string | null>(null)
    const [open, setOpen] = useState(false)
    const [initRecoverUnsaved, setInitRecoverUnsaved] = useState(false)
    const [postState, setPostState] = useState<PostContentEdit>(post)

    const postKey = `dirty-post-${postState.id}`

    // Initialize recover/discard unsaved changes
    // 1. Recover 2. Discard 3. Nothing => setInitRecoverUnsaved(true)
    useEffect(() => {
        if (window) {
            const dirtyPost = window.localStorage.getItem(postKey)

            if (dirtyPost) {
                const isDirty = dirtyPost !== JSON.stringify(postState)

                if (isDirty) {
                    setOpen(true)
                    localStorageContent.current = dirtyPost
                } else {
                    setInitRecoverUnsaved(true)
                    window.localStorage.removeItem(postKey)
                }
            } else {
                setInitRecoverUnsaved(true)
            }
        }
    }, [])

    // Update post content when post prop changes
    useEffect(() => {
        setPostState(post)
    }, [post])

    // Update parent component and save dirty to local when post content changes
    useEffect(() => {
        const postChanged = JSON.stringify(postState)
        const isDirty = postChanged !== JSON.stringify(post)
        onPostChange?.(postState, isDirty)

        if (isDirty && window) {
            window.localStorage.setItem(postKey, postChanged)
        } else if (!isDirty && window && initRecoverUnsaved) {
            // Remove only if user has asked to recover unsaved changes (prevent removed on render)
            window.localStorage.removeItem(postKey)
        }
    }, [postState])

    const editorSectionMaxWidth = 'calc(65ch+1.5rem)'

    return (
        <div className="w-full flex flex-col md:flex-row gap-5">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Unsaved changes detected
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to recover your unsaved changes? For
                            post <strong>{postState.title}</strong> (id:{' '}
                            {postState.id})
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setInitRecoverUnsaved(true)
                                window.localStorage.removeItem(postKey)
                            }}
                        >
                            Discard
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setInitRecoverUnsaved(true)

                                const postContentLocal = JSON.parse(
                                    localStorageContent.current || '{}'
                                )
                                setPostState(postContentLocal)
                                editorRef.current?.updateContent(
                                    postContentLocal.content
                                )
                            }}
                        >
                            Recover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <section
                className={`w-[${editorSectionMaxWidth}] flex flex-col gap-5`}
            >
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="What is your post title?"
                        value={postState.title}
                        onChange={e => {
                            setPostState(prev => {
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
                        style={{ maxWidth: editorSectionMaxWidth }}
                    >
                        <input
                            id="content"
                            type="hidden"
                            name="content"
                            readOnly
                            value={postState.content}
                        />
                        <DefaultTipTap
                            ref={editorRef}
                            content={postState.content}
                            onUpdate={({ toJSON }) => {
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        content: toJSON(),
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
                        value={postState.status}
                        name="status"
                        onValueChange={v => {
                            setPostState(prev => {
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
                            value={postState.slug}
                            onChange={e => {
                                setPostState(prev => {
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
                            variant={'secondary'}
                            onClick={() => {
                                const slug = postState.title
                                    .replace(/^\s+|\s+$/g, '')
                                    .toLowerCase()
                                    .replace(/[^a-z0-9 -]/g, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/-+/g, '-')

                                setPostState(prev => {
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
                        placeholder="Short description about your post..."
                        value={postState.excerpt}
                        onChange={e => {
                            setPostState(prev => {
                                const newPost = {
                                    ...prev,
                                    excerpt: e.target.value,
                                }
                                return newPost
                            })
                        }}
                    />
                    <Button
                        type="button"
                        variant={'secondary'}
                        className="mt-2"
                        onClick={() => {
                            setPostState(prev => {
                                const text = editorRef.current?.getText() || ''
                                const newPost = {
                                    ...prev,
                                    excerpt: text.slice(0, 150).trim() || '',
                                }
                                return newPost
                            })
                        }}
                    >
                        Generate Excerpt
                    </Button>
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
                            value={postState.seo.title ?? ''}
                            onChange={e => {
                                setPostState(prev => {
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
                            variant={'secondary'}
                            onClick={() => {
                                setPostState(prev => {
                                    const newPost = {
                                        ...prev,
                                        seo: {
                                            ...prev.seo,
                                            title: postState.title,
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
                        value={postState.seo.description ?? ''}
                        onChange={e => {
                            setPostState(prev => {
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
                    <Button
                        type="button"
                        variant={'secondary'}
                        className="mt-2"
                        onClick={() => {
                            setPostState(prev => {
                                const text = editorRef.current?.getText() || ''
                                const newPost = {
                                    ...prev,
                                    seo: {
                                        ...prev.seo,
                                        description:
                                            text.slice(0, 150).trim() || '',
                                    },
                                }
                                return newPost
                            })
                        }}
                    >
                        Generate SEO Description
                    </Button>
                </div>
            </section>
        </div>
    )
}

const newPost: PostContentEdit = {
    id: 'new',
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
