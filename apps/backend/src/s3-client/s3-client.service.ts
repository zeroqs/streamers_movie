import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client as AWSClient } from "@aws-sdk/client-s3";

@Injectable()
export class S3ClientService {
	constructor(private configService: ConfigService) {}

	readonly client = new AWSClient({
		region: "ru-central1",
		endpoint: "https://storage.yandexcloud.net",
		credentials: {
			accessKeyId: this.configService.get("SECRET_KEY"),
			secretAccessKey: this.configService.get("ACCESS_KEY"),
		},
	});
}

