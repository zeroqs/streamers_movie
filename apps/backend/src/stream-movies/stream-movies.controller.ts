import {
	BadRequestException,
	Controller,
	Get,
	Header,
	Param,
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
		@Headers("range") range: string,
		@Res() response: Response,
	) {
		if (!range) {
			throw new BadRequestException("Invalid range header");
		}

		const movie = await this.moviesService.getMovie(Number(id));
		const movieTitle = movie.title;
		if (movie.movieSrc) {
			const { headers, movieStream } = await this.streamMoviesService.stream(
				range,
				movieTitle,
			);

			response.status(206);
			response.set(headers);
			movieStream.pipe(response);
		} else {
			throw new BadRequestException("Movie with this quality not found");
		}
	}
}
