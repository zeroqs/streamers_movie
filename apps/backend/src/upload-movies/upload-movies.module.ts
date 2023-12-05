import { Module } from '@nestjs/common';
import { UploadMoviesService } from './upload-movies.service';
import { UploadMoviesController } from './upload-movies.controller';

@Module({
  providers: [UploadMoviesService],
  controllers: [UploadMoviesController]
})
export class UploadMoviesModule {}
