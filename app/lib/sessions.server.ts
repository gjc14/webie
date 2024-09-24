import { createCookieSessionStorage } from '@remix-run/node'

const flashSession = createCookieSessionStorage({
	cookie: {
		name: '__flash_session',
		httpOnly: true,
		maxAge: 60,
		path: '/',
		sameSite: 'lax',
		secrets: ['not-so-secret'],
		secure: process.env.NODE_ENV === 'production',
	},
})

const { commitSession: commitFlashSession, getSession: getFlashSession } = flashSession

export { commitFlashSession, getFlashSession }
