import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesModule } from "./movies/movies.module";
import { configModule } from "./config/configModule";
import { dbConfig } from "./config/dbConfig";
import { UploadMoviesModule } from './upload-movies/upload-movies.module';
import { S3ClientService } from './s3-client/s3-client.service';
import { S3ClientModule } from './s3-client/s3-client.module';

@Module({
  imports: [configModule, dbConfig, MoviesModule, UploadMoviesModule, S3ClientModule],
  controllers: [AppController],
  providers: [AppService, S3ClientService],
})
export class AppModule {}

