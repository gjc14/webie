import { ActionFunctionArgs } from '@remix-run/node'

import { userIs } from '~/lib/db/auth.server'
import { deleteSEO } from '~/lib/db/seo.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    if (request.method !== 'DELETE') {
        return {
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse
    }

    await userIs(request, ['ADMIN'])

    const id = params.seoId

    if (!id) {
        console.log('Invalid arguments', id)
        return { err: `Invalid arguments` } satisfies ConventionalActionResponse
    }

    try {
        const { seo } = await deleteSEO(id)
        return {
            msg: `SEO for ${seo.route || seo.title || 'unknown'} delete`,
        } satisfies ConventionalActionResponse
    } catch (error) {
        console.error(error)
        return {
            err: 'Failed to delete SEO',
        } satisfies ConventionalActionResponse
    }
}
