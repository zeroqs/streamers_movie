/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
	S3Client as AWSClient,
	CompleteMultipartUploadCommand,
	CompleteMultipartUploadOutput,
	CreateMultipartUploadCommand,
	UploadPartCommand,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { exec } = require('node:child_process')

// const util = require('node:util');
// const exec = util.promisify(require('node:child_process').exec);

@Injectable()
export class S3ClientService {
	constructor(private configService: ConfigService) { }

	readonly client = new AWSClient({
		region: 'ru-central1',
		endpoint: 'https://storage.yandexcloud.net',
		credentials: {
			accessKeyId: this.configService.get('SECRET_KEY'),
			secretAccessKey: this.configService.get('ACCESS_KEY'),
		},
	})

	async uploadPhoto(bucketName: string, key: string, imageFile: Buffer) {
		const metadata = await sharp(imageFile).metadata()

		// Определяем формат изображения
		const format = metadata.format

		let compressedImage

		try {
			if (format === 'jpeg' || format === 'jpg') {
				compressedImage = await sharp(imageFile)
					.jpeg({ quality: 80, progressive: true, chromaSubsampling: '4:2:0' })
					.toBuffer()
			} else if (format === 'png') {
				compressedImage = await sharp(imageFile)
					.png({ compressionLevel: 9, progressive: true })
					.toBuffer()
			} else {
				compressedImage = await sharp(imageFile).toBuffer()
			}

			const params = {
				Bucket: bucketName,
				Key: `${key}/${key}-poster.${format}`,
				Body: compressedImage,
			}

			const upload = new Upload({
				client: this.client,
				params: params,
			})

			const fileUpload: CompleteMultipartUploadOutput = await upload.done()

			return fileUpload.Location
		} catch (error) {
			console.error('Error while compressing and uploading image:', error)
		}
	}

	async initiateMultipartUpload(bucketName: string, key: string) {
		try {
			const params = new CreateMultipartUploadCommand({
				Bucket: bucketName,
				Key: key,
			})

			const response = await this.client.send(params)

			return response.UploadId
		} catch (error) {
			console.log('initiateMultipartUpload:', error)
		}
	}

	async uploadPart(
		bucketName: string,
		key: string,
		body: Buffer,
		partNumber: number,
		uploadId: string,
	) {
		try {
			const params = new UploadPartCommand({
				Bucket: bucketName,
				Key: key,
				Body: body,
				PartNumber: partNumber,
				UploadId: uploadId,
			})

			const response = await this.client.send(params)

			return response.ETag
		} catch (error) {
			console.log('uploadPart:', error)
		}
	}

	async completeMultipartUpload(
		bucketName: string,
		key: string,
		uploadId: string,
		etags: string[],
	) {
		try {
			const completedParts = etags.map((etag, index) => ({
				PartNumber: index + 1,
				ETag: etag,
			}))

			const keyParam = `${key}/${key}.mp4`

			const command = new CompleteMultipartUploadCommand({
				Bucket: bucketName,
				Key: keyParam,
				UploadId: uploadId,
				MultipartUpload: { Parts: completedParts },
			})

			const response = await this.client.send(command)

			this.createHlsFragments(response.Location, bucketName, key)

			return response.Location
		} catch (error) {
			console.log('completeMultipartUpload:', error)
		}
	}

	async createHlsFragments(videoUrl: string, bucketName: string, key: string) {
		const hlsFolder = `public/video/test`

		const command = `ffmpeg -y -i ${videoUrl} -preset slow -g 48 -sc_threshold 0 -map 0:0 -map 0:1 -map 0:0 -map 0:1 -map 0:0 -map 0:1 -s:v:0 1280x720 -b:v:0 850k -s:v:1 630x360 -b:v:1 550k -s:v:2 1920x1080 -b:v:2 1200k -c:a aac -var_stream_map "v:0,a:0,name:720p v:1,a:1,name:360p v:2,a:2,name:1080p" -master_pl_name master.m3u8 -f hls -hls_time 10 -hls_playlist_type vod -hls_list_size 0 -hls_segment_filename "public/video/test/%v/segmentNo%d.ts" -hls_playlist "1" public/video/test/%v/index.m3u8`

		// const command = `ffmpeg -y -i ${videoUrl} -preset slow -g 48 -sc_threshold 0 -map 0:v:0 -s:v:0 1280x720 -b:v:0 850k -map 0:v:0 -s:v:1 630x360 -b:v:1 550k -map 0:v:0 -s:v:2 1920x1080 -b:v:2 1200k -c:a aac -var_stream_map "v:0,name:720p v:1,name:360p v:2,name:1080p" -master_pl_name master.m3u8 -f hls -hls_time 10 -hls_playlist_type vod -hls_list_size 0 -hls_segment_filename "public/video/test/%v/segmentNo%d.ts" -hls_playlist "1" public/video/test/%v/index.m3u8`
		// await new Promise((resolve,reject) => {
		// 	exec(command).on('exit', resolve).on('error', reject)
		// })

		exec(command).on("error", (e) => console.log(e) ).on('exit', async () => {
			const files = fs.readdirSync(hlsFolder, { withFileTypes: true })

			for (const file of files) {
				const itemPath = path.join(hlsFolder, file.name)


				// Получение списка файлов и папок в текущей директории, загрузка master плейлиста и папок
				if (file.isDirectory()) {
					this.uploadFolder(itemPath, bucketName, key)
				} else {
					const fileStream = fs.createReadStream(itemPath)

					const uploadParams = {
						Bucket: bucketName,
						Key: `${key}/stream/${file.name}`,
						Body: fileStream,
						ContentType: 'application/x-mpegURL',
					}

					const command = new Upload({
						client: this.client,
						params: uploadParams,
					})

					await command.done()
					fs.rmSync("public/video", { recursive: true, force: true });

				}
			}
		})

		// Получение списка файлов и папок в текущей директории
		// const files = fs.readdirSync(hlsFolder, { withFileTypes: true })
		// console.log(files)
		// for (const file of files) {
		// 	if (file.isDirectory()) continue

		// 	const filePath = path.join(hlsFolder, file.name)

		// 	const fileStream = fs.createReadStream(filePath)

		// 	const uploadParams = {
		// 		Bucket: bucketName,
		// 		Key: `${key}/stream/${file}`,
		// 		Body: fileStream,
		// 		ContentType: file.name.endsWith('.ts')
		// 			? 'video/mp2t'
		// 			: file.name.endsWith('.m3u8')
		// 				? 'application/x-mpegURL'
		// 				: null,
		// 	}
		// 	// await s3.upload(uploadParams).promise()
		// 	fs.unlinkSync(filePath)
		// }
	}

	async uploadFolder(filePath: string, bucketName: string, key: string) {
		const files = fs.readdirSync(filePath, { withFileTypes: true })
		const fileQuality = filePath.split('/')[filePath.split('/').length - 1]

		for (const file of files) {
			const itemPath = path.join(filePath, file.name)

			// Получение списка файлов и папок в текущей директории, загрузка master плейлиста и папок
				const fileStream = fs.createReadStream(itemPath)

				const uploadParams = {
					Bucket: bucketName,
					Key: `${key}/stream/${fileQuality}/${file.name}`,
					Body: fileStream,
					ContentType: 'application/x-mpegURL',
				}

				const command = new Upload({
					client: this.client,
					params: uploadParams,
				})

				command.done()
		
		}
	
	}

}
