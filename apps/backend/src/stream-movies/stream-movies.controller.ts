import {
	BadRequestException,
	Controller,
	Get,
	Header,
	Param,
	Query,
	Headers,
	Res,
} from "@nestjs/common";
import { MoviesService } from "src/movies/movies.service";
import { StreamMoviesService } from "src/stream-movies/stream-movies.service";
import { Response } from "express";

@Controller("stream-movies")
export class StreamMoviesController {
	constructor(
		private moviesService: MoviesService,
		private streamMoviesService: StreamMoviesService,
	) {}
	@Get(":id")
	@Header("Accept-Ranges", "bytes")
	async streamMovie(
		@Param("id") id: string,
		@Query() query: { quality: string },
		@Headers("range") range: string,
		@Res() response: Response,
	) {
		if (!range) {
			throw new BadRequestException("Invalid range header");
		}

		const movie = await this.moviesService.getMovie(Number(id));
		const movieTitle = movie.title
		const {
			url: movieSrc,
			quality,
		} = movie.qualities.find((q) => q.quality == Number(query.quality));
		if (movieSrc) {
			const { headers, movieStream } = await this.streamMoviesService.stream(
				movieSrc,
				range,
				quality,
				movieTitle
			);

			response.status(206);
			response.set(headers);
			movieStream.pipe(response);
		} else {
			throw new BadRequestException("Movie with this quality not found");
		}
	}
}