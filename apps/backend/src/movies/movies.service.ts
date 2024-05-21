import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Movie as MovieType } from './movies.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Movie } from './moviesEntity/movieEntity'
import { Repository } from 'typeorm'

@Injectable()
export class MoviesService {
	constructor(
		@InjectRepository(Movie)
		private movieRepository: Repository<Movie>,
	) {}

	findAll(): Promise<MovieType[]> {
		return this.movieRepository.find()
	}

	getMovie(id: number | string): Promise<MovieType> {
		const movie = this.movieRepository.findOne({
			where: { id: Number(id) },
		})
		if (!movie) {
			throw new HttpException('Movie not found', HttpStatus.NOT_FOUND)
		}

		return movie
	}

	async create(dto: MovieType) {
		const newMovie = this.movieRepository.create(dto)
		await this.movieRepository.save(newMovie)
		return newMovie
	}

	async delete(id: number) {
		const deleteResponse = await this.movieRepository.delete(id)
		if (!deleteResponse.affected) {
			throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
		}
	}
}
