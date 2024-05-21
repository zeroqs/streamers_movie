import Image from 'next/image'

import { Movie } from '@/app/movie/[id]/page'

interface MovieCardProps {
	movie: Movie
}

export const MovieCard = ({ movie }: MovieCardProps) => {
	return (
		<div className="relative group">
			<Image
				src={movie.imageSrc}
				alt="Picture of the movie"
				width={500}
				height={500}
				className="w-full h-full object-cover group-hover:brightness-50 transition duration-300 rounded-lg"
			/>
			<h1 className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition duration-300">
				{movie.title}
			</h1>
		</div>
	)
}
