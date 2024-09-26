import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'
import { TurnstileSiteVerify } from '~/components/web/captchas/turnstile'
import { createUser } from '~/lib/db/user.server'
import { UserRole, UserStatus } from '~/schema/database'

const captchaSchema = z.enum(['turnstile', 'recaptcha', 'hcaptcha'])

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== 'POST') {
		return json({ err: 'Method not allowed' }, { status: 405 })
	}

	const formData = await request.formData()

	// Verify
	const captcha = formData.get('captcha')
	const zCaptchaResult = captchaSchema.safeParse(captcha)

	if (!zCaptchaResult.success) {
		return json(
			{ msg: 'Invalid arguments, missing captcha' },
			{ status: 400 }
		)
	}

	switch (zCaptchaResult.data) {
		case 'turnstile': {
			const turnstileResponse = formData.get('cf-turnstile-response')

			const zTurnstileResult = z.string().safeParse(turnstileResponse)
			if (!zTurnstileResult.success) {
				return json({ msg: 'Invalid arguments' }, { status: 400 })
			}

			const passed = await TurnstileSiteVerify(
				zTurnstileResult.data,
				process.env.TURNSTILE_SECRET_KEY ?? ''
			)
			if (!passed) {
				return json(
					{ msg: 'CAPTCHA Failed! Please try again' },
					{ status: 400 }
				)
			}
			break
		}
		case 'recaptcha': {
			return json({ msg: 'Recaptcha not implemented' }, { status: 501 })
		}
		case 'hcaptcha': {
			return json({ msg: 'Hcaptcha not implemented' }, { status: 501 })
		}
	}

	// Create
	const email = formData.get('email')
	const zResult = z.string().trim().email().safeParse(email)
	if (!zResult.success) {
		return json({ msg: 'Invalid arguments' }, { status: 400 })
	}

	const { role, status } = {
		role: 'SUBSCRIBER',
		status: 'ACTIVE',
	} satisfies { role: UserRole; status: UserStatus }
	try {
		const { user } = await createUser(zResult.data, role, status)

		return json({ msg: `Welcom! Subscribed with ${user.email}!` })
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return json({ msg: 'Email already exists' }, { status: 200 })
			}
		}
		console.error('Error creating user:', error)
		return json({ msg: 'Failed to subscribe' }, { status: 500 })
	}
}

export const loader = () => {
	return redirect('/blog', { status: 308 })
}
