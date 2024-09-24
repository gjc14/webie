import { json, LoaderFunctionArgs } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetchers,
	useLoaderData,
	useRevalidator,
} from '@remix-run/react'
import { parse } from 'cookie'
import { useEffect, useRef } from 'react'
import { toast, Toaster } from 'sonner'
import { customThemeCookieName, getCustomTheme, ThemeProvider, useTheme } from './lib/hooks/theme-provider'
import { ClientHintCheck, getHints } from './lib/client-hints/client-hints'
import { subscribeToSchemeChange } from './lib/client-hints/color-schema'
import { useCookieTheme } from './lib/hooks/useCookieTheme'
import { commitFlashSession, getFlashSession } from './lib/sessions.server'

export function Layout({ children }: { children: React.ReactNode }) {
	const theme = useCookieTheme()

	return (
		<html lang="en" className={theme}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ClientHintCheck />
			</head>
			<body>
				<ThemeProvider cookieTheme={theme}>
					{/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
					{children}
				</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const flashSession = await getFlashSession(request.headers.get('Cookie'))
	const successes = flashSession.get('success') ?? []
	const errors = flashSession.get('error') ?? []

	if (successes.length === 0 && errors.length === 0) {
		return json({
			successes,
			errors,
			requestInfo: {
				hints: getHints(request),
				customTheme: getCustomTheme(request),
			},
		})
	}

	return json(
		{
			successes,
			errors,
			requestInfo: {
				hints: getHints(request),
				customTheme: getCustomTheme(request),
			},
		},
		{
			headers: {
				'Set-Cookie': await commitFlashSession(flashSession),
			},
		}
	)
}

export default function App() {
	const { successes, errors } = useLoaderData<typeof loader>()
	const fetchers = useFetchers()
	const { revalidate } = useRevalidator()
	const { setTheme } = useTheme()

	const toastKeysRef = useRef<Map<string, number>>(new Map())

	// Action response handler for front-end submit `useSubmit()` (Like the function of session flash but front-end)
	useEffect(() => {
		if (fetchers.length > 0) {
			const currentTimestamp = Date.now()
			const expiry = 30000

			const cleanedKeys = new Map(
				Array.from(toastKeysRef.current.entries()).filter(
					([, timestamp]) => currentTimestamp - timestamp < expiry
				)
			)

			// Convention: actions return json({ data?, msg?, err? }) refer to README.md
			const actionResponses = fetchers.filter(fetcher => fetcher.state === 'loading' && fetcher.data)

			const successResponses = actionResponses.filter(
				fetcher => fetcher.data.msg && !cleanedKeys.has(fetcher.key)
			)
			const errorResponses = actionResponses.filter(fetcher => fetcher.data.err && !cleanedKeys.has(fetcher.key))

			successResponses.forEach(fetcher => {
				toast.success(fetcher.data.msg)
				cleanedKeys.set(fetcher.key, currentTimestamp)
			})
			errorResponses.forEach(fetcher => {
				console.error(fetcher.data.err)
				toast.error(fetcher.data.err)
				cleanedKeys.set(fetcher.key, currentTimestamp)
			})

			toastKeysRef.current = cleanedKeys
		}
	}, [fetchers])

	useEffect(() => {
		if (successes.length > 0) {
			toast.success(successes)
		}

		if (errors.length > 0) {
			toast.error(errors)
		}
	}, [successes, errors])

	// Subscribe to (prefers-color-scheme: dark), set cookie and revalidate when it changes
	useEffect(() => {
		subscribeToSchemeChange(theme => {
			// Do not set theme if custom theme is set
			const cookieHeader = document.cookie
			const parsedCustomTheme = cookieHeader && parse(cookieHeader)[customThemeCookieName]
			if (parsedCustomTheme) return revalidate()

			// Set theme to system theme
			setTheme(theme)
		})
	}, [])

	return (
		<>
			<Toaster
				position="top-right"
				closeButton
				toastOptions={{
					classNames: {
						closeButton: 'border border-primary',
					},
				}}
			/>
			<div className=" bg-blend-difference"></div>
			<Outlet />
		</>
	)
}
