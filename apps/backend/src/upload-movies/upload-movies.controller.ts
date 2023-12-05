import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadMoviesService } from "./upload-movies.service";

@Controller("upload-movies")
export class UploadMoviesController {
  constructor(private uploadMoviesService: UploadMoviesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.uploadMoviesService.upload(file.originalname, file.buffer);
  }
}
