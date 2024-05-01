import { Module } from '@nestjs/common';
import { StreamMoviesService } from './stream-movies.service';
import { S3ClientModule } from 'src/s3-client/s3-client.module';

@Module({
	imports: [S3ClientModule],
	providers: [StreamMoviesService],
	exports: [StreamMoviesService],
})
export class StreamMoviesModule {}
