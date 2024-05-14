import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/shared/ui/header'
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
					<Header />
					<div className="max-w-6xl mx-auto p-6">{children}</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
