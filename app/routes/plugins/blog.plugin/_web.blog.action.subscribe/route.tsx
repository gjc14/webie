import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'

import { TurnstileSiteVerify } from '~/components/captchas/turnstile'
import { createUser } from '~/lib/db/user.server'
import { ConventionalError, ConventionalSuccess } from '~/lib/utils'
import { UserRole, UserStatus } from '~/schema/database'

const captchaSchema = z.enum(['turnstile', 'recaptcha', 'hcaptcha'])

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return json<ConventionalError>(
            { err: 'Method not allowed' },
            { status: 405 }
        )
    }

    const formData = await request.formData()

    // Verify
    const captcha = formData.get('captcha')
    const zCaptchaResult = captchaSchema.safeParse(captcha)

    if (!zCaptchaResult.success) {
        return json<ConventionalError>(
            { err: 'Invalid arguments, missing captcha' },
            { status: 400 }
        )
    }

    switch (zCaptchaResult.data) {
        case 'turnstile': {
            const turnstileResponse = formData.get('cf-turnstile-response')

            const zTurnstileResult = z.string().safeParse(turnstileResponse)
            if (!zTurnstileResult.success) {
                return json<ConventionalError>(
                    { err: 'Invalid arguments' },
                    { status: 400 }
                )
            }

            const passed = await TurnstileSiteVerify(
                zTurnstileResult.data,
                process.env.TURNSTILE_SECRET_KEY ?? ''
            )
            if (!passed) {
                return json<ConventionalError>(
                    { err: 'CAPTCHA Failed! Please try again' },
                    { status: 400 }
                )
            }
            break
        }
        case 'recaptcha': {
            return json<ConventionalError>(
                { err: 'Recaptcha not implemented' },
                { status: 501 }
            )
        }
        case 'hcaptcha': {
            return json<ConventionalError>(
                { err: 'Hcaptcha not implemented' },
                { status: 501 }
            )
        }
    }

    // Create
    const email = formData.get('email')
    const zResult = z.string().trim().email().safeParse(email)
    if (!zResult.success) {
        return json<ConventionalError>(
            { err: 'Invalid arguments' },
            { status: 400 }
        )
    }

    const { role, status } = {
        role: 'SUBSCRIBER',
        status: 'ACTIVE',
    } satisfies { role: UserRole; status: UserStatus }
    try {
        const { user } = await createUser(zResult.data, role, status)

        return json<ConventionalSuccess>({
            msg: `Welcom! Subscribed with ${user.email}!`,
        })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return json<ConventionalError>(
                    { err: 'Email already exists' },
                    { status: 200 }
                )
            }
        }
        console.error('Error creating user:', error)
        return json<ConventionalError>(
            { err: 'Failed to subscribe' },
            { status: 500 }
        )
    }
}

export const loader = () => {
    return redirect('/blog', { status: 308 })
}
