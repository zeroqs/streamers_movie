import {
	Controller,
	Get,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadMoviesService } from "./upload-movies.service";
import { Response } from "express";

@Controller("upload-movies")
export class UploadMoviesController {
	constructor(private uploadMoviesService: UploadMoviesService) {}

	@Post()
	@UseInterceptors(FileInterceptor("file"))
	async upload(@UploadedFile() file: Express.Multer.File) {
		await this.uploadMoviesService.upload(file.originalname, file.buffer);
	}

	@Get("progress")
	getProgress(@Res() res: Response) {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");

		this.uploadMoviesService.getProgressObservable().subscribe((progress) => {
			res.write(`data: ${JSON.stringify({ progress })}\n\n`);
		});
	}
}
