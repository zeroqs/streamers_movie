/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadOutput } from "@aws-sdk/client-s3/dist-types/models/models_0";
import { Subject } from "rxjs";
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
const unlinkAsync = promisify(fs.unlink);

const qualities = [360, 480, 720, 1080];

@Injectable()
export class UploadMoviesService {
	constructor(private configService: ConfigService) {}

	private readonly client = new S3Client({
		region: "ru-central1",
		endpoint: "https://storage.yandexcloud.net",
		credentials: {
			accessKeyId: this.configService.get("SECRET_KEY"),
			secretAccessKey: this.configService.get("ACCESS_KEY"),
		},
	});

	private readonly progressSubject = new Subject<number>();

	public getProgressObservable() {
		return this.progressSubject.asObservable();
	}

	addResolutionToFileName(fileName: string, resolution: string): string {
		const extensionIndex = fileName.lastIndexOf(".");
		if (extensionIndex === -1) {
			throw new Error("Invalid file name");
		}

		const nameWithoutExtension = fileName.substring(0, extensionIndex);
		const extension = fileName.substring(extensionIndex);

		if (resolution === "original") {
			return fileName; // Если требуется оригинальное разрешение, возвращаем исходное имя файла
		} else {
			return `${nameWithoutExtension}_${resolution}${extension}`;
		}
	}

	async uploadVideo(
		folderName: string,
		fileName: string,
		file: Buffer,
		isOriginal: boolean,
		type?: number,
	) {
		const typeKey = type ? type : "original";
		const newFileName = this.addResolutionToFileName(fileName, String(typeKey));

		const uploadParams = {
			Bucket: "movie-first-m",
			Key: `${folderName}/${newFileName}`,
			Body: file,
		};

		const upload = new Upload({
			client: this.client,
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

	async uploadWithQuality(
		fileName: string,
		originalVideo: string,
		qualities: number[],
	) {
		const folderName = fileName;

		for (const quality of qualities) {
			const transcodedVideo = await this.transcodeVideo(originalVideo, quality);
			const location = await this.uploadVideo(folderName, fileName, transcodedVideo, false, quality);
		}
		
	}

async transcodeVideo(video: string, quality: number): Promise<Buffer> {
    const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
		const ffmpeg = require("fluent-ffmpeg");
	
    ffmpeg.setFfmpegPath(ffmpegPath);

  const tmpFileName = `transcodedVideo_${quality}p.mp4`;
	const outputPath = join(tmpdir(), tmpFileName); // Путь к временному файлу
	
	return new Promise<Buffer>((resolve, reject) => {
			 let resolution = '640x360'; // Предположим, что изначальное разрешение 360p
        if (quality === 720) {
            resolution = '1280x720';
        } else if (quality === 1080) {
            resolution = '1920x1080';
        }

        // Здесь используются различные битрейты в зависимости от качества
        let bitrate = '500k'; // Пример битрейта для 480p
        if (quality === 720) {
            bitrate = '1500k'; // Битрейт для 720p
        } else if (quality === 1080) {
            bitrate = '3000k'; // Битрейт для 1080p
		}
		
        ffmpeg()
            .input(video)
            .inputFormat("mp4")
            .size(resolution) // Устанавливаем разрешение по высоте, чтобы сохранить соотношение сторон
            .videoCodec('libx264') // Устанавливаем видео кодек
            .videoBitrate(bitrate) // Устанавливаем битрейт видео
            .audioCodec('aac') // Устанавливаем аудио кодек
            .audioBitrate('128k') // Устанавливаем битрейт аудио
            .outputOptions('-strict -2') // Указываем строгий режим
            .outputFormat("mp4")
            .on("error", (err: Error) => {
                reject(err);
            })
            .on("end", () => {
                fs.readFile(outputPath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        unlinkAsync(outputPath); // Удаляем временный файл после чтения его содержимого
                        resolve(data);
                    }
                });
            })
            .save(outputPath); // Сохраняем выходные данные в файл
    });
}


	async upload(fileName: string, file: Buffer) {
		const folderName = fileName;

		const originalVideo = await this.uploadVideo(
			folderName,
			fileName,
			file,
			true,
		);
		await this.uploadWithQuality(fileName, originalVideo, qualities);
	}
}
