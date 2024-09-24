import { useRouteLoaderData } from '@remix-run/react'
import { loader as rootLoader } from '~/root'

export type Theme = 'light' | 'dark'

export const useHints = () => {
	const data = useRouteLoaderData<typeof rootLoader>('root')
	return data?.requestInfo.hints
}

export const useCustomTheme = (): Theme | undefined => {
	const data = useRouteLoaderData<typeof rootLoader>('root')
	return data?.requestInfo.customTheme
}

export const useCookieTheme = (): Theme => {
	const hints = useHints()
	const customTheme = useCustomTheme()

	return customTheme ?? hints?.theme ?? 'dark' // The fallback theme
}
