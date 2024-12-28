import { ActionFunctionArgs, json } from '@remix-run/node'
import { userIs } from '~/lib/db/auth.server'
import { deleteSEO } from '~/lib/db/seo.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    if (request.method !== 'DELETE') {
        return json<ConventionalError>(
            { err: 'Method not allowed' },
            { status: 405 }
        )
    }

    await userIs(request, ['ADMIN'])

    const id = params.seoId

    if (!id) {
        console.log('Invalid arguments', id)
        return json<ConventionalError>(
            { err: `Invalid arguments` },
            { status: 400 }
        )
    }

    try {
        const { seo } = await deleteSEO(id)
        return json<ConventionalSuccess>({
            msg: `SEO for ${seo.route || seo.title || 'unknown'} delete`,
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { err: 'Failed to delete SEO' },
            { status: 500 }
        )
    }
}
