import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client as AWSClient, CompleteMultipartUploadCommand, CompleteMultipartUploadOutput, CreateMultipartUploadCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { Upload } from '@aws-sdk/lib-storage';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp  = require("sharp");

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


	
	async uploadPhoto(bucketName: string, key: string, imageFile: Buffer) { 
		const metadata = await sharp(imageFile).metadata();

		// Определяем формат изображения
		const format = metadata.format;

		let compressedImage;

		try {
			if (format === "jpeg" || format === "jpg") {
				compressedImage = await sharp(imageFile)
					.jpeg({ quality: 80, progressive: true, chromaSubsampling: "4:2:0" })
					.toBuffer();
			} else if (format === "png") {
				compressedImage = await sharp(imageFile)
					.png({ compressionLevel: 9, progressive: true })
					.toBuffer();
			} else {
				compressedImage = await sharp(imageFile).toBuffer();
			}

			

			const params = {
				Bucket: bucketName,
				Key: `${key}/${key}-poster.${format}`,
				Body: compressedImage,
			};

			const upload = new Upload({
				client: this.client,
				params: params,
			});

			const fileUpload: CompleteMultipartUploadOutput = await upload.done();

			return fileUpload.Location;
		} catch (error) {
			console.error("Error while compressing and uploading image:", error);
		}
	}

	async initiateMultipartUpload(bucketName: string, key: string)  { 
		try {
			const params = new CreateMultipartUploadCommand({ Bucket: bucketName, Key: key })

			const response = await this.client.send(params);

			return response.UploadId;
		} catch (error) { 
			console.log("initiateMultipartUpload:", error);
		}
	}

	async uploadPart(bucketName: string, key: string, body: Buffer, partNumber: number, uploadId: string) {
		try {
		const params = new UploadPartCommand({ Bucket: bucketName, Key: key, Body: body, PartNumber: partNumber, UploadId: uploadId })

		const response = await this.client.send(params);

		return response.ETag
		} catch (error) {
			console.log("uploadPart:", error);
		}
	}

	async completeMultipartUpload(bucketName: string, key: string, uploadId: string, etags: string[]) {
		try {
			const completedParts = etags.map((etag, index) => ({ PartNumber: index + 1, ETag: etag }));

		const command = new CompleteMultipartUploadCommand({ Bucket : bucketName, Key: key, UploadId: uploadId, MultipartUpload: { Parts: completedParts } });

		const response = await this.client.send(command);


    return response.Location; 
		} catch (error) {
			console.log("completeMultipartUpload:", error);
		}
	}
}
