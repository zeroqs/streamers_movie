/* eslint-disable @typescript-eslint/no-var-requires */

import { Readable, PassThrough } from "stream";


export async function transcodeVideo(videoStream: Readable, quality: number): Promise<Buffer> {
    const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
    const ffmpeg = require("fluent-ffmpeg");

    ffmpeg.setFfmpegPath(ffmpegPath);

    return new Promise<Buffer>((resolve, reject) => {
        const transcoder = ffmpeg()
            .input(videoStream)
            .inputFormat("mp4")
            .videoCodec("libx264") // Устанавливаем видео кодек
            .audioCodec("aac") // Устанавливаем аудио кодек
            .audioBitrate("128k") // Устанавливаем битрейт аудио
            .outputOptions("-strict -2") // Указываем строгий режим
            .outputFormat("mp4");

        // Устанавливаем разрешение и битрейт в зависимости от качества
        if (quality === 1080) {
            transcoder.size("1920x1080").videoBitrate("3000k");
        } else {
            transcoder.size("640x360").videoBitrate("750k");
        }

        transcoder.on("error", (err: Error) => {
            reject(err);
        })
        .on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        const chunks: Buffer[] = [];
        const outputStream = new PassThrough();
        outputStream.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });

        transcoder.pipe(outputStream, { end: true });
    });
}