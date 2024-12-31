import { prisma } from '~/lib/db/_db.server'

/**
 * Tag and Category functions
 */
export const createCategory = async ({
    id,
    name,
}: {
    id: string
    name: string
}): Promise<{ category: typeof category }> => {
    const category = await prisma.category.create({
        data: { id, name },
    })
    return { category }
}

export const getCategories = async (): Promise<{
    categories: typeof categories
}> => {
    const categories = await prisma.category.findMany({
        include: { subCategories: true },
    })
    return { categories }
}
export type CategoriesFromDB = Awaited<
    ReturnType<typeof getCategories>
>['categories']

export const deleteCategory = async (
    id: string
): Promise<{ category: typeof category }> => {
    const category = await prisma.category.delete({
        where: { id },
    })
    return { category }
}

// Subcategory functions
export const createSubcategory = async (props: {
    id: string
    name: string
    categoryId: string
}): Promise<{ subcategory: typeof subcategory }> => {
    const subcategory = await prisma.subCategory.create({
        data: {
            id: props.id,
            name: props.name,
            categoryId: props.categoryId,
        },
    })
    return { subcategory }
}

export const getSubcategories = async (): Promise<{
    subcategories: typeof subcategories
}> => {
    const subcategories = await prisma.subCategory.findMany()
    return { subcategories }
}

export const deleteSubcategory = async (
    id: string
): Promise<{ subcategory: typeof subcategory }> => {
    const subcategory = await prisma.subCategory.delete({
        where: { id },
    })
    return { subcategory }
}

// Tag functions
export const createTag = async ({
    id,
    name,
}: {
    id: string
    name: string
}): Promise<{ tag: typeof tag }> => {
    const tag = await prisma.tag.create({
        data: { id, name },
    })
    return { tag }
}

export const getTags = async (): Promise<{ tags: typeof tags }> => {
    const tags = await prisma.tag.findMany()
    return { tags }
}
export type TagsFromDB = Awaited<ReturnType<typeof getTags>>['tags']

export const deleteTag = async (id: string): Promise<{ tag: typeof tag }> => {
    const tag = await prisma.tag.delete({
        where: { id },
    })
    return { tag }
}
