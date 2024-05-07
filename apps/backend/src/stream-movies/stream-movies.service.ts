/* eslint-disable @typescript-eslint/no-var-requires */
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { S3ClientService } from "src/s3-client/s3-client.service";
const { Readable } = require("stream");

const CHUNK_SIZE = 10 ** 6; // 1MB

@Injectable()
export class StreamMoviesService {
	constructor(private s3Client: S3ClientService) {}

	async stream(
		range: string,
		title: string,
	) {
		const params = {
			Bucket: "movie-first-m",
			Key: `${title}/${title}.mp4`,
		};

		const headParams = { ...params };
		const headCommand = new HeadObjectCommand(headParams);
		const headResponse = await this.s3Client.client.send(headCommand);
		const contentLength = headResponse.ContentLength;

		const start = Number(range.replace(/\D/g, ""));
		const end = Math.min(start + CHUNK_SIZE, contentLength - 1);
		const contentRange = `bytes ${start}-${end}/${contentLength}`;
		const contentLengthToSend = end - start + 1;

		const headers = {
			"Content-Range": contentRange,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLengthToSend,
			"Content-Type": "video/mp4",
		};

		 const getParams = {
        ...params,
        Range: `bytes=${start}-${end}`
    };

		const getCommand = new GetObjectCommand(getParams);
    const response = await this.s3Client.client.send(getCommand);

    const buffer = await response.Body.transformToByteArray();
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null); // Завершаем поток

    return { headers, movieStream: bufferStream };

	}
}
