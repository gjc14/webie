import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { userIs } from '~/lib/db/auth.server'
import { createSEO } from '~/lib/db/seo.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'

export const SeoUpdateSchmea = z.object({
    title: z.string(),
    description: z.string(),
    route: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return json<ConventionalError>(
            { err: 'Method not allowed' },
            { status: 405 }
        )
    }

    await userIs(request.headers.get('Cookie'), 'ADMIN', '/admin/signin')

    const formData = await request.formData()
    const createSeoData = Object.fromEntries(formData)

    const zResult = SeoUpdateSchmea.safeParse(createSeoData)

    if (!zResult.success || !zResult.data) {
        const message = zResult.error.issues
            .map(issue => `${issue.message} ${issue.path[0]}`)
            .join(' & ')
        return json<ConventionalError>({ err: message }, { status: 400 })
    }

    try {
        const { seo } = await createSEO({
            title: zResult.data.title,
            description: zResult.data.description,
            route: zResult.data.route,
            autoGenerated: false,
        })
        return json<ConventionalSuccess>({
            msg: `SEO for ${seo.route || seo.title || 'unknown'} created`,
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { err: 'Failed to create SEO' },
            { status: 500 }
        )
    }
}
