import { MoviePlayer } from '@/shared/ui/movie-player'

interface Movie {
	id: number
	title: string
	movieSrc: string
	imageSrc: string
}

const fetchMovie = async (id: string) => {
	const res = await fetch(`http://176.109.101.147:3030/movies/${id}`)

	const data: Movie = await res.json()

	return data
}

export default async function Movie({ params }: { params: { id: string } }) {
	const movie = await fetchMovie(params.id)

	return (
		<div>
			<MoviePlayer src={movie.movieSrc} />
		</div>
	)
}
