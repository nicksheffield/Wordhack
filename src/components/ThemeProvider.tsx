'use client'

import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'
import { type PropsWithChildren, useEffect } from 'react'

function ThemeWatcher() {
	const { resolvedTheme, setTheme } = useTheme()

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)')

		function onMediaChange() {
			const systemTheme = media.matches ? 'dark' : 'light'
			if (resolvedTheme === systemTheme) {
				setTheme('system')
			}
		}

		onMediaChange()
		media.addEventListener('change', onMediaChange)

		return () => {
			media.removeEventListener('change', onMediaChange)
		}
	}, [resolvedTheme, setTheme])

	return null
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	return (
		<NextThemeProvider attribute="class">
			<ThemeWatcher />
			{children}
		</NextThemeProvider>
	)
}
