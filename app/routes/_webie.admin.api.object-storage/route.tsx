import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { userIs } from '~/lib/db/auth.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
import { getSignedUrl } from './get-presigned-url'

export const ActionResponseSchema = z.object({
    url: z.string().url(),
})
export type ActionResponseData = z.infer<typeof ActionResponseSchema>

// Presign url for uploading assets
export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    const jsonData = await request.json()
    console.log('jsonData', jsonData)

    const prsignURL = await getSignedUrl({ key: 'my-first-obj' })
    console.log('prsignURL', prsignURL)
    if (!prsignURL) {
        return json<ConventionalError>({
            err: 'Cloud storage not available, please try again',
        })
    }

    const data: ActionResponseData = {
        url: prsignURL,
    }
    const responseData: ConventionalSuccess = {
        msg: 'Presign url success',
        data,
        options: {
            preventAlert: true,
        },
    }
    return json(responseData)
}
