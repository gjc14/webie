import { ActionFunctionArgs, json } from '@remix-run/node'
import { userIs } from '~/lib/db/auth.server'
import { deleteSEO } from '~/lib/db/seo.server'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    if (request.method !== 'DELETE') {
        return json({ err: 'Method not allowed' }, { status: 405 })
    }

    await userIs(request.headers.get('Cookie'), 'ADMIN', '/admin/signin')

    const id = params.seoId

    if (!id) {
        console.log('Invalid arguments', id)
        return json({ err: `Invalid arguments` }, { status: 400 })
    }

    try {
        const { seo } = await deleteSEO(id)
        return json({
            msg: `SEO for ${seo.route || seo.title || 'unknown'} delete`,
        })
    } catch (error) {
        console.error(error)
        return json({ err: 'Failed to delete SEO' }, { status: 500 })
    }
}
