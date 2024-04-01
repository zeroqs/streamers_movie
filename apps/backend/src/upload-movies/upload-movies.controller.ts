import {
	Controller,
	Get,
	Res,
} from "@nestjs/common";
import { UploadMoviesService } from "./upload-movies.service";
import { Response } from "express";

@Controller("upload-movies")
export class UploadMoviesController {
	constructor(private uploadMoviesService: UploadMoviesService) {}

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
