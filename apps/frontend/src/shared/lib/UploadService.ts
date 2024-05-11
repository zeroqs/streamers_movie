import { ApiService } from './ApiService'

export class UploadService {
	readonly bucketName: string
	readonly key: string
	readonly imageFile: File
	private uploadId: string | undefined
	private eTags: string[] = []

	private imageFileLocation: string | undefined
	private movieTitle: string

	constructor(bucketName: string, key: string, imageFile: File) {
		this.bucketName = bucketName
		this.key = key
		this.imageFile = imageFile
		this.movieTitle = key
	}

	async imageFileUpload() {
		const formData = new FormData()
		formData.append('imageFile', this.imageFile)
		formData.append('bucketName', this.bucketName)
		formData.append('key', this.key)

		const response = await ApiService.post('s3-service/upload-image', {
			body: formData,
		})
		const imageUrl = await response.text()

		this.imageFileLocation = imageUrl
	}

	async initiateMultipartUpload(chunks: Blob[]) {
		const uploadId = await ApiService.post('s3-service/initiate-upload', {
			json: { bucketName: this.bucketName, key: this.key },
		})
		this.uploadId = await uploadId.text()

		await this.imageFileUpload()

		this.uploadPart(chunks)
	}

	async uploadPart(chunks: Blob[]) {
		// eslint-disable-next-line unicorn/no-for-loop
		for (let index = 0; index < chunks.length; index++) {
			const chunk = chunks[index]
			const eTag = await this.uploadPartRequest(chunk, index + 1)
			this.eTags.push(eTag)
		}

		this.completeMultipartUpload(this.eTags)
	}

	async uploadPartRequest(chunk: Blob, partNumber: number): Promise<string> {
		const formData = new FormData()
		formData.append('bucketName', this.bucketName)
		formData.append('key', this.key)
		formData.append('body', chunk)
		formData.append('partNumber', String(partNumber))
		formData.append('uploadId', this.uploadId!)

		const response = await ApiService.post('s3-service/upload-part', {
			body: formData,
		})
		const eTag = (await response.json()) as string
		return eTag
	}

	async completeMultipartUpload(etags: string[]) {
		const response = await ApiService.post('s3-service/complete-upload', {
			json: {
				bucketName: this.bucketName,
				key: this.key,
				uploadId: this.uploadId,
				etags,
			},
		})
		const movieLocation = await response.text()

		await ApiService.post('movies', {
			json: {
				title: this.movieTitle,
				imageSrc: this.imageFileLocation,
				movieSrc: movieLocation,
			},
		})
	}
}
