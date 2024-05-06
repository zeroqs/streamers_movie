import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesModule } from "./movies/movies.module";
import { configModule } from "./config/configModule";
import { dbConfig } from "./config/dbConfig";
import { S3ClientService } from './s3-client/s3-client.service';
import { S3ClientModule } from './s3-client/s3-client.module';
import { StreamMoviesController } from './stream-movies/stream-movies.controller';
import { StreamMoviesModule } from './stream-movies/stream-movies.module';

@Module({
  imports: [configModule, dbConfig, MoviesModule, S3ClientModule, StreamMoviesModule],
  controllers: [AppController, StreamMoviesController],
  providers: [AppService, S3ClientService],
})
export class AppModule {}

