import Link from 'next/link'

import { ModeToggle } from '@/shared/ui/mode-toggle'

export const Header = () => {
	return (
		<header className="flex items-center justify-between p-4">
			<Link href="/">
				<h1 className="text-2xl font-bold">Movies</h1>
			</Link>
			<ModeToggle />
		</header>
	)
}
