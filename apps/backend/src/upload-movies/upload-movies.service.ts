import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadOutput } from "@aws-sdk/client-s3/dist-types/models/models_0";

@Injectable()
export class UploadMoviesService {
  constructor(private configService: ConfigService) {}

  private readonly client = new S3Client({
    region: "ru-central1",
    endpoint: "https://storage.yandexcloud.net",
    credentials: {
      accessKeyId: this.configService.get("YA_SECRET_KEY"),
      secretAccessKey: this.configService.get("YA_SECRET_ACCESS_KEY"),
    },
  });

  async upload(fileName: string, file: Buffer) {
    const uploadParams = {
      Bucket: "movie-first-m",
      Key: fileName,
      Body: file,
    };

    const upload = new Upload({
      client: this.client,
      params: uploadParams,
    });

    upload.on("httpUploadProgress", (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Uploaded ${percent.toFixed(2)}%`);
    });

    const fileUpload: CompleteMultipartUploadOutput = await upload.done();
    console.log(fileUpload);
    return fileUpload.Location;
  }
}
