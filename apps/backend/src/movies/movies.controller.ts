import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { Movies } from "./movies.interface";
import { UploadMoviesService } from "src/upload-movies/upload-movies.service";
import {
	FileFieldsInterceptor,
	FileInterceptor,
	FilesInterceptor,
} from "@nestjs/platform-express";

@Controller("movies")
export class MoviesController {
	constructor(
		private moviesService: MoviesService,
		private uploadMovieService: UploadMoviesService,
	) {}

	@Get()
	getAll(): Promise<Movies[]> {
		return this.moviesService.findAll();
	}

	@Post()
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: "movieFile", maxCount: 1 },
			{ name: "imageFile", maxCount: 1 },
		]),
	)
	async create(
		@UploadedFiles()
		files: {
			movieFile?: Express.Multer.File;
			imageFile?: Express.Multer.File;
		},
		@Body("title") title: string,
	) {
		await this.uploadMovieService.upload(
			title,
			files.movieFile[0].buffer,
			files.imageFile[0].buffer,
		);
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return this.moviesService.delete(Number(id));
	}
}
