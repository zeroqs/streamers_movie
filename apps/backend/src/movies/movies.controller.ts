import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Res,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { Movies } from "./movies.interface";
import { UploadMoviesService } from "src/upload-movies/upload-movies.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

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

	@Get("progress")
	getProgress(@Res() res: Response) {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");

		this.uploadMovieService.getProgressObservable().subscribe((progress) => {
			res.write(`data: ${JSON.stringify({ progress })}\n\n`);
		});
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return this.moviesService.delete(Number(id));
	}
}
