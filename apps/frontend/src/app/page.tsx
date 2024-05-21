import Link from 'next/link'

import { Movie } from '@/app/movie/[id]/page'
import { MovieCard } from '@/shared/ui/movie-card'

const fetchMovies = async () => {
	const res = await fetch(`http://176.109.101.147:3000/movies`)

	if (!res.ok) {
		throw new Error('Failed to fetch data')
	}

	const data: Movie[] = await res.json()

	return data
}

export default async function Home() {
	const movies = await fetchMovies()

	return (
		<>
			<main className="flex flex-col gap-6 min-h-screen">
				<div className="grid grid-cols-movies items-center gap-6">
					{movies.map((movie) => (
						<Link key={movie.id} href={`/movie/${movie.id}`}>
							<MovieCard movie={movie} />
						</Link>
					))}
				</div>
			</main>
		</>
	)
}
