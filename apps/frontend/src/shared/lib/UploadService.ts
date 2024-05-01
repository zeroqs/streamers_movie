import { ApiService } from './ApiService'

export class UploadService {
	readonly bucketName: string
	readonly key: string
	private uploadId: string
	readonly eTags: string[] = []

	constructor(bucketName: string, key: string) {
		this.bucketName = bucketName
		this.key = key
	}

	async initiateMultipartUpload() {
		const uploadId = await ApiService.post('s3-service/initiate-upload', {
			json: { bucketName: this.bucketName, key: this.key },
		})
		this.uploadId = await uploadId.text()
	}

	async uploadPart(chunks: Blob[]) {
		// eslint-disable-next-line unicorn/no-for-loop
		for (let index = 0; index < chunks.length; index++) {
			const chunk = chunks[index]
			const eTag = await this.uploadPartRequest(chunk, index + 1)
			this.eTags.push(eTag)
		}

		return this.eTags
	}

	async uploadPartRequest(chunk: Blob, partNumber: number): Promise<string> {
		const formData = new FormData()
		formData.append('bucketName', this.bucketName)
		formData.append('key', this.key)
		formData.append('body', chunk)
		formData.append('partNumber', String(partNumber))
		formData.append('uploadId', this.uploadId)

		const response = await ApiService.post('s3-service/upload-part', {
			body: formData,
		})
		const eTag = (await response.json()) as string
		return eTag
	}

	async completeMultipartUpload(etags: string[]): Promise<string> {
		const location = await ApiService.post('s3-service/complete-upload', {
			json: {
				bucketName: this.bucketName,
				key: this.key,
				uploadId: this.uploadId,
				etags,
			},
		})
		return location.text()
	}
}
