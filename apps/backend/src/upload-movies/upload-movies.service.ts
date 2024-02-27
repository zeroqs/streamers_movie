import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadOutput } from "@aws-sdk/client-s3/dist-types/models/models_0";
import { Subject } from "rxjs";

@Injectable()
export class UploadMoviesService {
	constructor(
		private configService: ConfigService,
	) { }

	private readonly progressSubject = new Subject<number>();
	
	  public getProgressObservable() {
    return this.progressSubject.asObservable();
  }

	private readonly client = new S3Client({
		region: "ru-central1",
		endpoint: "https://storage.yandexcloud.net",
		credentials: {
			accessKeyId: this.configService.get("SECRET_KEY"),
			secretAccessKey: this.configService.get("ACCESS_KEY"),
		},
	});

	async upload(fileName: string, file: Buffer) {
		const uploadParams = {
			Bucket: "movie-first-m",
			Key: `${fileName}/${fileName}`,
			Body: file,
		};

		const upload = new Upload({
			client: this.client,
			params: uploadParams,
		});

		upload.on("httpUploadProgress", (progress) => {
			const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
      this.progressSubject.next(parseFloat(percent));
		});

		const fileUpload: CompleteMultipartUploadOutput = await upload.done();
		console.log(fileUpload);
		return fileUpload.Location;
	}
}
