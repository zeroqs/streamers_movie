import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "./moviesEntity/movieEntity";
import { S3ClientModule } from "src/s3-client/s3-client.module";

@Module({
  imports: [TypeOrmModule.forFeature([Movie]),S3ClientModule],
  controllers: [MoviesController],
	providers: [MoviesService],
	exports: [MoviesService],
})
export class MoviesModule {}
