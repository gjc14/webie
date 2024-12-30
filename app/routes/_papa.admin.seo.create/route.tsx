import { ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'

import { userIs } from '~/lib/db/auth.server'
import { createSEO } from '~/lib/db/seo.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const SeoUpdateSchmea = z.object({
    title: z.string(),
    description: z.string(),
    route: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return Response.json({
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse)
    }

    await userIs(request, ['ADMIN'])

    const formData = await request.formData()
    const createSeoData = Object.fromEntries(formData)

    const zResult = SeoUpdateSchmea.safeParse(createSeoData)

    if (!zResult.success || !zResult.data) {
        const message = zResult.error.issues
            .map(issue => `${issue.message} ${issue.path[0]}`)
            .join(' & ')
        return Response.json({
            err: message,
        } satisfies ConventionalActionResponse)
    }

    try {
        const { seo } = await createSEO({
            title: zResult.data.title,
            description: zResult.data.description,
            route: zResult.data.route,
            autoGenerated: false,
        })
        return Response.json({
            msg: `SEO for ${seo.route || seo.title || 'unknown'} created`,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        console.error(error)
        return Response.json({
            err: 'Failed to create SEO',
        } satisfies ConventionalActionResponse)
    }
}
