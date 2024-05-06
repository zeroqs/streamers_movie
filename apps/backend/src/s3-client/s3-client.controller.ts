import {
	Body,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	s3CompleteUploadDto,
	s3InitialUploadDto,
	s3UploadImageDto,
	s3UploadPartDto,
} from "src/s3-client/dto";
import { S3ClientService } from "src/s3-client/s3-client.service";

@Controller("s3-service")
export class S3ClientController {
	constructor(private s3ClientService: S3ClientService) {}

	@Post("upload-image")
	@UseInterceptors(FileInterceptor('imageFile'))
	async uploadImage(@Body() body: s3UploadImageDto, @UploadedFile() imageFile: Express.Multer.File) {
		const location = await this.s3ClientService.uploadPhoto(
			body.bucketName,
			body.key,
			imageFile.buffer,
		);

		return location;
	}

	@Post("initiate-upload")
	async initiateUpload(@Body() body: s3InitialUploadDto) {
		const key = `${body.key}/${body.key}.mp4`;
		const uploadId = await this.s3ClientService.initiateMultipartUpload(
			body.bucketName,
			key,
		);

		return uploadId;
	}

	@Post("upload-part")
	@UseInterceptors(FileInterceptor("body"))
	async uploadPart(
		@UploadedFile() file: Express.Multer.File,
		@Body() formData: s3UploadPartDto,
	) {
		const chunk = file.buffer;
		const bucketName = formData.bucketName;
		const key = `${formData.key}/${formData.key}.mp4`;
		const partNumber = formData.partNumber;

		const uploadId = formData.uploadId;

		const eTag = await this.s3ClientService.uploadPart(
			bucketName,
			key,
			chunk,
			partNumber,
			uploadId,
		);
		return String(eTag);
	}

	@Post("complete-upload")
	async completeUpload(@Body() body: s3CompleteUploadDto) {
		const key = `${body.key}/${body.key}.mp4`;

		const fileLocation = await this.s3ClientService.completeMultipartUpload(
			body.bucketName,
			key,
			body.uploadId,
			body.etags,
		);

		return fileLocation;
	}
}
