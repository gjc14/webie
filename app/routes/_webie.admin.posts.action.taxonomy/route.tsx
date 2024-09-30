import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { json } from '@remix-run/react'
import {
    createCategory,
    createSubcategory,
    createTag,
    deleteCategory,
    deleteSubcategory,
    deleteTag,
} from '~/lib/db/blog-taxonomy.server'
import { decodedAdminToken } from '~/lib/db/auth.server'
import { z } from 'zod'

const intentSchema = z.enum(['category', 'subcategory', 'tag'])
export type Intents = z.infer<typeof intentSchema>

// Schema for both category and tag
const taxonomySchema = z.object({
    id: z.string(),
    name: z.string(),
})

const subTaxonomySchema = z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string(),
})

const deleteSchema = z.object({
    id: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST' && request.method !== 'DELETE') {
        throw new Response('Method not allowd', { status: 405 })
    }

    await decodedAdminToken(request.headers.get('Cookie'))

    const formData = await request.formData()
    const intent = formData.get('intent')

    const { data, success } = intentSchema.safeParse(intent)

    if (!success) {
        throw new Response('Invalid argument', { status: 400 })
    }

    const formObject = Object.fromEntries(formData)

    switch (data) {
        case 'category': {
            const deleteMesage = (name: string) => {
                return '類別 ' + name + ' 已刪除'
            }

            try {
                if (request.method === 'POST') {
                    const { id, name } = taxonomySchema.parse(formObject)
                    await createCategory({ id, name })
                    return null
                } else if (request.method === 'DELETE') {
                    const { id } = deleteSchema.parse(formObject)
                    const { category } = await deleteCategory(id)
                    return json({
                        msg: deleteMesage(category.name),
                    })
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return json({
                        err: 'Invalid argument',
                    })
                }
                console.error(error)
                return json({
                    err: 'Failed to delete category',
                })
            }
        }

        case 'subcategory': {
            const deleteMesage = (name: string) => {
                return '子類別 ' + name + ' 已刪除'
            }

            try {
                if (request.method === 'POST') {
                    const { id, name, parentId } =
                        subTaxonomySchema.parse(formObject)
                    await createSubcategory({ id, name, categoryId: parentId })
                    return null
                } else if (request.method === 'DELETE') {
                    const { id } = deleteSchema.parse(formObject)
                    const { subcategory } = await deleteSubcategory(id)
                    return json({
                        msg: deleteMesage(subcategory.name),
                    })
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return json({
                        err: 'Invalid argument',
                    })
                }
                console.error(error)
                return json({
                    err: 'Failed to delete category',
                })
            }
        }

        case 'tag': {
            const deleteMesage = (name: string) => {
                return '標籤 ' + name + ' 已刪除'
            }

            try {
                if (request.method === 'POST') {
                    const { id, name } = taxonomySchema.parse(formObject)
                    await createTag({ id, name })
                    return null
                } else if (request.method === 'DELETE') {
                    const { id } = deleteSchema.parse(formObject)
                    const { tag } = await deleteTag(id)
                    return json({
                        msg: deleteMesage(tag.name),
                    })
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return json({
                        err: 'Invalid argument',
                    })
                }
                console.error(error)
                return json({
                    err: 'Failed to delete tag',
                })
            }
        }

        default: {
            throw new Response('Invalid argument', { status: 400 })
        }
    }
}

export const loader = () => {
    return redirect('/admin/posts')
}

export default function AdminPostsActionTaxonomy() {
    return null
}
