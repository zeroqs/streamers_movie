import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/shared/ui/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Movies',
	description: 'Watch movies online',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<>{children}</>
				</ThemeProvider>
			</body>
		</html>
	)
}
