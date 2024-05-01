import { Injectable } from "@nestjs/common";
import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadOutput } from "@aws-sdk/client-s3/dist-types/models/models_0";
import { Subject } from "rxjs";

import { MoviesService } from "src/movies/movies.service";
import { addResolutionToFileName } from "src/utils/addResultionToFileName";
import { S3ClientService } from "src/s3-client/s3-client.service";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require("sharp");

const qualities = [360, 1080];

@Injectable()
export class UploadMoviesService {
	constructor(
		private moviesService: MoviesService,
		private s3Client: S3ClientService,
	) {}

	private readonly progressSubject = new Subject<number>();

	public getProgressObservable() {
		return this.progressSubject.asObservable();
	}

	async uploadVideoToS3(
		folderName: string,
		fileName: string,
		file: Buffer,
		isOriginal: boolean,
		type?: number,
	) {
		const typeKey = type ? type : "original";
		const newFileName = addResolutionToFileName(fileName, String(typeKey));

		const uploadParams = {
			Bucket: "movie-first-m",
			Key: `${folderName}/${newFileName}`,
			Body: file,
		};

		const upload = new Upload({
			client: this.s3Client.client,
			params: uploadParams,
		});

		if (isOriginal) {
			upload.on("httpUploadProgress", (progress) => {
				const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
				this.progressSubject.next(parseFloat(percent));
			});
		}

		const fileUpload: CompleteMultipartUploadOutput = await upload.done();

		return fileUpload.Location;
	}

	async uploadImageToS3(folderName: string, fileName: string, file: Buffer) {
		const metadata = await sharp(file).metadata();

		// Определяем формат изображения
		const format = metadata.format;

		let compressedImage;

		try {
			if (format === "jpeg" || format === "jpg") {
				compressedImage = await sharp(file)
					.jpeg({ quality: 80, progressive: true, chromaSubsampling: "4:2:0" })
					.toBuffer();
			} else if (format === "png") {
				compressedImage = await sharp(file)
					.png({ compressionLevel: 9, progressive: true })
					.toBuffer();
			} else {
				compressedImage = await sharp(file).toBuffer();
			}

			const uploadParams = {
				Bucket: "movie-first-m",
				Key: `${folderName}/${fileName}-poster.${format}`,
				Body: compressedImage,
			};

			const upload = new Upload({
				client: this.s3Client.client,
				params: uploadParams,
			});

			const fileUpload: CompleteMultipartUploadOutput = await upload.done();

			return fileUpload.Location;
		} catch (error) {
			console.error("Error while compressing and uploading image:", error);
			throw error;
		}
	}

	async uploadWithQuality(fileName: string) {
		const folderName = fileName;

		// for (const quality of qualities) {
		// 	const transcodedVideo = await transcodeVideo(originalVideo, quality);
		// 	const location = await this.uploadVideoToS3(
		// 		folderName,
		// 		fileName,
		// 		transcodedVideo,
		// 		false,
		// 		quality,
		// 	);
		// 	await this.moviesService.addMovieWithQuality(fileName, quality, location);
		// }
		const deleteParams = {
			Bucket: "movie-first-m",
			Key: `${folderName}/${fileName}`,
		};

		try {
			await this.s3Client.client.send(new DeleteObjectCommand(deleteParams));
		} catch (err) {
			console.log("Error deleting file", err);
		}
	}

	async upload(fileName: string, movieFile: Buffer, imageFile: Buffer) {
		const folderName = fileName;

		try {
			const originalVideo = await this.uploadVideoToS3(
				folderName,
				fileName,
				movieFile,
				true,
			);
			const moviePoster = await this.uploadImageToS3(
				folderName,
				fileName,
				imageFile,
			);
			await this.moviesService.create({
				title: fileName,
				imageSrc: moviePoster,
			});
			// await this.uploadWithQuality(fileName, originalVideo, qualities);
		} catch (error) {
			console.error(error);
			return new Error("Failed to upload movie");
		}
	}
}
