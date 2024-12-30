import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { z } from 'zod'

import { TurnstileSiteVerify } from '~/components/captchas/turnstile'
import { createUser } from '~/lib/db/user.server'
import { ConventionalActionResponse } from '~/lib/utils'
import { UserRole, UserStatus } from '~/schema/database'

const captchaSchema = z.enum(['turnstile', 'recaptcha', 'hcaptcha'])

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return Response.json({
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse)
    }

    const formData = await request.formData()

    // Verify
    const captcha = formData.get('captcha')
    const zCaptchaResult = captchaSchema.safeParse(captcha)

    if (!zCaptchaResult.success) {
        return Response.json({
            err: 'Invalid arguments, missing captcha',
        } satisfies ConventionalActionResponse)
    }

    switch (zCaptchaResult.data) {
        case 'turnstile': {
            const turnstileResponse = formData.get('cf-turnstile-response')

            const zTurnstileResult = z.string().safeParse(turnstileResponse)
            if (!zTurnstileResult.success) {
                return Response.json({
                    err: 'Invalid arguments',
                } satisfies ConventionalActionResponse)
            }

            const passed = await TurnstileSiteVerify(
                zTurnstileResult.data,
                process.env.TURNSTILE_SECRET_KEY ?? ''
            )
            if (!passed) {
                return Response.json({
                    err: 'CAPTCHA Failed! Please try again',
                } satisfies ConventionalActionResponse)
            }
            break
        }
        case 'recaptcha': {
            return Response.json({
                err: 'Recaptcha not implemented',
            } satisfies ConventionalActionResponse)
        }
        case 'hcaptcha': {
            return Response.json({
                err: 'Hcaptcha not implemented',
            } satisfies ConventionalActionResponse)
        }
    }

    // Create
    const email = formData.get('email')
    const zResult = z.string().trim().email().safeParse(email)
    if (!zResult.success) {
        return Response.json({
            err: 'Invalid arguments',
        } satisfies ConventionalActionResponse)
    }

    const { role, status } = {
        role: 'SUBSCRIBER',
        status: 'ACTIVE',
    } satisfies { role: UserRole; status: UserStatus }
    try {
        const { user } = await createUser(zResult.data, role, status)

        return Response.json({
            msg: `Welcom! Subscribed with ${user.email}!`,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return Response.json({
                    err: 'Email already exists',
                } satisfies ConventionalActionResponse)
            }
        }
        console.error('Error creating user:', error)
        return Response.json({
            err: 'Failed to subscribe',
        } satisfies ConventionalActionResponse)
    }
}

export const loader = () => {
    return redirect('/blog', { status: 308 })
}
