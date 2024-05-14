interface Movie {
	id: number
	title: string
	movieSrc: string
	imageSrc: string
}

const fetchMovie = async (id: string) => {
	const res = await fetch(`http://localhost:3030/movies/${id}`)
	console.log(res)
	const data: Movie = await res.json()

	return data
}

export default async function Movie({ params }: { params: { id: string } }) {
	const movie = await fetchMovie(params.id)

	return <div></div>
}
