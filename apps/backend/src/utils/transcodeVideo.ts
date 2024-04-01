/* eslint-disable @typescript-eslint/no-var-requires */

import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";
import * as fs from "fs";
const unlinkAsync = promisify(fs.unlink);


export async function transcodeVideo(video: string, quality: number): Promise<Buffer> {
		const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
		const ffmpeg = require("fluent-ffmpeg");

		ffmpeg.setFfmpegPath(ffmpegPath);

		const tmpFileName = `transcodedVideo_${quality}p.mp4`;
		const outputPath = join(tmpdir(), tmpFileName); // Путь к временному файлу

		return new Promise<Buffer>((resolve, reject) => {
			let resolution = "640x360"; // Предположим, что изначальное разрешение 360p
			if (Number(quality) === 1080) {
				resolution = "1920x1080";
			}

			// Здесь используются различные битрейты в зависимости от качества
			let bitrate = "750k"; // Пример битрейта для 360p
			if (Number(quality) === 1080) {
				bitrate = "3000k"; // Битрейт для 1080p
			}

			ffmpeg()
				.input(video)
				.inputFormat("mp4")
				.size(resolution) // Устанавливаем разрешение по высоте, чтобы сохранить соотношение сторон
				.videoCodec("libx264") // Устанавливаем видео кодек
				.videoBitrate(bitrate) // Устанавливаем битрейт видео
				.audioCodec("aac") // Устанавливаем аудио кодек
				.audioBitrate("128k") // Устанавливаем битрейт аудио
				.outputOptions("-strict -2") // Указываем строгий режим
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