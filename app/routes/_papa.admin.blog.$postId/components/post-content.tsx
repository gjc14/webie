import { Category, Post, Seo, Tag } from '@prisma/client'
import { ObjectId } from 'bson'
import { useEffect, useRef, useState } from 'react'

import DefaultTipTap, { EditorRef } from '~/components/editor/default-tiptap'
import { MultiSelect } from '~/components/multi-select'
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
import { CategoriesFromDB, TagsFromDB } from '~/lib/db/blog-taxonomy.server'
import { PostStatus } from '~/schema/database'

export type PostContentEdit = Post & {
    seo: {
        title: Seo['title']
        description: Seo['description']
    }
}

interface PostContentProps {
    post: PostContentEdit
    onPostChange?: (post: PostContentEdit, dirty: boolean) => void
    tags: TagsFromDB
    categories: CategoriesFromDB
}

export const generatePostSlug = (title: string) => {
    return title
        .replace(/^\s+|\s+$/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// TODO: Add featured image; tags, categories, subcategories selection; edit author; publish schedule
// TODO: Editor upload image; link setting popup
export const PostContent = ({
    post,
    onPostChange,
    tags,
    categories,
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
        // TODO: Didnt remove if it redirect from new page
        if (isDirty && window) {
            window.localStorage.setItem(postKey, postChanged)
        } else if (!isDirty && window && initRecoverUnsaved) {
            // Remove only if user has asked to recover unsaved changes (prevent removed on render)
            window.localStorage.removeItem(postKey)
        }
    }, [postState])

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
                className={`w-[calc(65ch+1.5rem)] flex flex-col gap-5 shrink-0`}
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
                                const slug = generatePostSlug(postState.title)

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
                    <Label htmlFor="categories">Categories</Label>
                    <div className="flex items-center gap-1.5">
                        <MultiSelect
                            options={categories.map(c => ({
                                value: c.id,
                                label: c.name,
                            }))}
                            defaultSelected={postState.categoryIDs
                                .map(categoryId => {
                                    const category = categories.find(
                                        c => c.id === categoryId
                                    )
                                    return category
                                        ? {
                                              value: category.id,
                                              label: category.name,
                                          }
                                        : null
                                })
                                .filter(c => !!c)}
                            onSelectedChange={selected => {
                                setPostState(prev => {
                                    const cIdArray = selected.map(s => s.value)
                                    return {
                                        ...prev,
                                        categoryIDs: cIdArray,
                                    }
                                })
                            }}
                            onEnterNewValue={v => {
                                setPostState(prev => {
                                    const newCategory: Category = {
                                        id: new ObjectId().toJSON(),
                                        name: v,
                                        postIDs: [],
                                    }
                                    return {
                                        ...prev,
                                        categoryIDs: [
                                            ...prev.categoryIDs,
                                            newCategory.id,
                                        ],
                                    }
                                })
                            }}
                            placeholder="Search categories..."
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex items-center gap-1.5">
                        <MultiSelect
                            options={tags.map(t => ({
                                value: t.id,
                                label: t.name,
                            }))}
                            defaultSelected={postState.tagIDs
                                .map(tagId => {
                                    const tag = tags.find(t => t.id === tagId)
                                    return tag
                                        ? { value: tag.id, label: tag.name }
                                        : null
                                })
                                .filter(t => !!t)}
                            onSelectedChange={selected => {
                                setPostState(prev => {
                                    const tIdArray = selected.map(s => s.value)
                                    return {
                                        ...prev,
                                        tagIDs: tIdArray,
                                    }
                                })
                            }}
                            onEnterNewValue={v => {
                                setPostState(prev => {
                                    const newTag: Tag = {
                                        id: new ObjectId().toJSON(),
                                        name: v,
                                        postIDs: [],
                                    }
                                    return {
                                        ...prev,
                                        tagIDs: [...prev.tagIDs, newTag.id],
                                    }
                                })
                            }}
                            placeholder="Search tags..."
                        />
                    </div>
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
