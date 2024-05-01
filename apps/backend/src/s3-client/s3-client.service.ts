import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client as AWSClient, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, UploadPartCommand } from "@aws-sdk/client-s3";

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

	async initiateMultipartUpload(bucketName: string, key: string)  { 
		const params = new CreateMultipartUploadCommand({ Bucket: bucketName, Key: key })

		const response = await this.client.send(params);

		return response.UploadId;
	}

	async uploadPart(bucketName: string, key: string, body: Buffer, partNumber: number, uploadId: string) {
		const params = new UploadPartCommand({ Bucket: bucketName, Key: key, Body: body, PartNumber: partNumber, UploadId: uploadId })

		const response = await this.client.send(params);

		return response.ETag
	}

	async completeMultipartUpload(bucketName: string, key: string, uploadId: string, etags: string[]) {
    const completedParts = etags.map((etag, index) => ({ PartNumber: index + 1, ETag: etag }));

		const command = new CompleteMultipartUploadCommand({ Bucket : bucketName, Key: key, UploadId: uploadId, MultipartUpload: { Parts: completedParts } });

		const response = await this.client.send(command);


    return response.Location; 
	}
}
