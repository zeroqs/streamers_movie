import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesModule } from "./movies/movies.module";
import { configModule } from "./config/configModule";
import { dbConfig } from "./config/dbConfig";
import { UploadMoviesModule } from './upload-movies/upload-movies.module';

@Module({
  imports: [configModule, dbConfig, MoviesModule, UploadMoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
