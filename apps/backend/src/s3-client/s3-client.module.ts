import { Module } from '@nestjs/common';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { S3ClientController } from './s3-client.controller';

@Module({
	exports: [S3ClientService],
	providers: [S3ClientService],
	controllers: [S3ClientController],
})
export class S3ClientModule {}
