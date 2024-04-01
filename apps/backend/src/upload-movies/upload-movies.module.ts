import { Module } from '@nestjs/common';
import { UploadMoviesService } from './upload-movies.service';
import { UploadMoviesController } from './upload-movies.controller';
import { MoviesModule } from 'src/movies/movies.module';
import { S3ClientModule } from 'src/s3-client/s3-client.module';

@Module({
	imports: [MoviesModule,S3ClientModule],
	providers: [UploadMoviesService],
	controllers: [UploadMoviesController],
})
export class UploadMoviesModule {}
