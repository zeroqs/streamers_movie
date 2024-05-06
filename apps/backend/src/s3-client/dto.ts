export interface s3UploadImageDto {
	bucketName: string;
	key: string;
	imageFile: Buffer
}

export interface s3InitialUploadDto {
	bucketName: string;
	key: string;
}

export interface s3UploadPartDto {
	bucketName: string;
	key: string;
	partNumber: number;
	uploadId: string;
}

export interface s3CompleteUploadDto {
	bucketName: string;
	key: string;
	uploadId: string;
	etags: string[];
}

