export class FileSplitterService {
	readonly file: File
	readonly CHUNK_SIZE = 10 * 1024 * 1024 // 10MB

	constructor(file: File) {
		this.file = file
	}

	splitFileIntoChunks() {
		const chunks: Blob[] = []
		const totalChunks = Math.ceil(this.file.size / this.CHUNK_SIZE)

		for (let i = 0; i < totalChunks; i++) {
			const start = i * this.CHUNK_SIZE
			const end = Math.min(start + this.CHUNK_SIZE, this.file.size)
			const chunk = this.file.slice(start, end)
			chunks.push(chunk)
		}

		return chunks
	}
}
