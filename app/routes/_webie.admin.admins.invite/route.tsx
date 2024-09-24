import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { getToken, sendMagicLink } from '~/lib/db/auth.server'
import { createUser } from '~/lib/db/user.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== 'POST') {
		return json({ err: 'Method not allowed' }, { status: 405 })
	}

	const formData = await request.formData()
	const email = formData.get('email')

	if (!email || typeof email !== 'string') {
		return json({ err: 'Invalid email' }, { status: 400 })
	}

	try {
		const { user } = await createUser(email, 'ADMIN', 'INACTIVE')

		const token = await getToken(user.id, user.email)
		await sendMagicLink(token, user.email, new URL(request.url).origin, {
			searchParams: { role: user.role },
		})

		return json({ msg: `Success invite ${email}` })
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return json({ msg: 'Email already exists' }, { status: 200 })
			}
		} else {
			console.error('Error creating user:', error)
			return json({ msg: 'Failed to invite' }, { status: 500 })
		}
	}
}
