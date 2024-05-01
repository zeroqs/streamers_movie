import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { s3CompleteUploadDto, s3InitialUploadDto, s3UploadPartDto } from "src/s3-client/dto";
import { S3ClientService } from "src/s3-client/s3-client.service";

@Controller("s3-service")
export class S3ClientController {
	constructor(private s3ClientService: S3ClientService) {}

	@Post("initiate-upload")
	async initiateUpload(@Body() body: s3InitialUploadDto) {
		const uploadId = await this.s3ClientService.initiateMultipartUpload(body.bucketName, body.key)
		
		return uploadId
	}

	@Post("upload-part")
	@UseInterceptors(FileInterceptor('body'))
	async uploadPart(@UploadedFile() file: Express.Multer.File, @Body() formData: s3UploadPartDto) {
		
		const chunk = file.buffer
		const bucketName = formData.bucketName
		const key = formData.key
		const partNumber = formData.partNumber
		const uploadId = formData.uploadId
		
		const eTag = await this.s3ClientService.uploadPart(bucketName, key, chunk, partNumber, uploadId)
		return String(eTag)
	}

	@Post("complete-upload")
	async completeUpload(@Body() body: s3CompleteUploadDto) {
		const fileLocation = await this.s3ClientService.completeMultipartUpload(body.bucketName, body.key, body.uploadId, body.etags)

		return fileLocation
	}
}
