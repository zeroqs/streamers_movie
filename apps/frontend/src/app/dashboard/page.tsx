'use client'

import { useState } from 'react'

import { FileSplitterService } from '@/shared/lib/FileSplitterService'
import { UploadService } from '@/shared/lib/UploadService'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export default function Dashboard() {
	const [video, setVideo] = useState<File | null>(null)
	const [videoTitle, setVideoTitle] = useState('')
	const [imageFile, setImageFile] = useState<File | null>(null)

	const sendData = async () => {
		const fileSplitter = new FileSplitterService(video!)
		const chunks = fileSplitter.splitFileIntoChunks()

		const upload = new UploadService('movie-first-m', videoTitle, imageFile!)

		await upload.initiateMultipartUpload(chunks)
	}

	return (
		<main className="flex flex-col gap-6 min-h-screen p-24">
			<div>
				<Label htmlFor="picture">Movie</Label>
				<Input
					accept="video/*"
					className="max-w-sm"
					onChange={(event) => setVideo(event.target.files![0])}
					id="picture"
					type="file"
				/>
			</div>
			<div>
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					className="max-w-sm"
					value={videoTitle}
					onChange={(event) => setVideoTitle(event.target.value)}
					type="text"
					placeholder="Title"
				/>
			</div>
			<div>
				<Label htmlFor="picture">Picture</Label>
				<Input
					className="max-w-sm"
					accept="image/*"
					onChange={(event) => setImageFile(event.target.files![0])}
					id="picture"
					type="file"
				/>
			</div>

			<Button className="max-w-sm" size="lg" onClick={sendData}>
				Send
			</Button>
		</main>
	)
}
