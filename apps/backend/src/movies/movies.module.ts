import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie, VideoQuality } from "./moviesEntity/movieEntity";
import { UploadMoviesService } from "src/upload-movies/upload-movies.service";
import { S3ClientModule } from "src/s3-client/s3-client.module";

@Module({
  imports: [TypeOrmModule.forFeature([Movie,VideoQuality]),S3ClientModule],
  controllers: [MoviesController],
	providers: [MoviesService, UploadMoviesService],
	exports: [MoviesService],
})
export class MoviesModule {}
