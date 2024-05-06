import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { Movie } from "./movies.interface";

@Controller("movies")
export class MoviesController {
	constructor(private moviesService: MoviesService,	) {}

	@Get()
	getAll(): Promise<Movie[]> {
		return this.moviesService.findAll();
	}


	@Post()
	create(@Body() body: Movie): Promise<Movie> {
		return this.moviesService.create(body);
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return this.moviesService.delete(Number(id));
	}
}
