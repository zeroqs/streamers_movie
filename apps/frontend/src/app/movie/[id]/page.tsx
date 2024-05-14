interface Movie {
	id: number
	title: string
	movieSrc: string
	imageSrc: string
}

const fetchMovie = async (id: string) => {
	const res = await fetch(`http://localhost:3030/movies/${id}`)

	const data: Movie = await res.json()

	return data
}

export default async function Movie({ params }: { params: { id: string } }) {
	const movie = await fetchMovie(params.id)

	return (
		<div>
			{movie.movieSrc}
			<video width="320" height="240" controls preload="none">
				<source src={movie.movieSrc} type="" />
			</video>
		</div>
	)
}
