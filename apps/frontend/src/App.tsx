/* eslint-disable jsx-a11y/media-has-caption */
import {
	Button,
	FileButton,
	FileInput,
	Group,
	Input,
	Progress,
	Text,
} from '@mantine/core'
import { useState } from 'react'

import { FileSplitterService } from './shared/lib/FileSplitterService'
import { UploadService } from './shared/lib/UploadService'

export const App = () => {
	const [value, setValue] = useState(0)
	const [video, setVideo] = useState<File | null>(null)
	const [videoTitle, setVideoTitle] = useState('')
	const [file, setFile] = useState<File | null>(null)

	const sendData = async () => {
		const fileSplitter = new FileSplitterService(video!)
		const chunks = fileSplitter.splitFileIntoChunks()

		const upload = new UploadService(
			'movie-first-m',
			`${videoTitle}/${videoTitle}.mp4`,
		)

		await upload.initiateMultipartUpload()
		const etags = await upload.uploadPart(chunks)
		const location = await upload.completeMultipartUpload(etags)
		// const formData = new FormData()
		// formData.append('movieFile', video!)
		// formData.append('title', videoTitle)
		// formData.append('imageFile', file!)
		// const response = fetch('http://localhost:3030/movies', {
		// 	method: 'POST',
		// 	body: formData,
		// })
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				width: 500,
				padding: '10px',
			}}
		>
			<Input
				value={videoTitle}
				onChange={(e) => setVideoTitle(e.target.value)}
			/>
			<FileInput
				value={video}
				onChange={setVideo}
				accept="video/*"
				label="Выбрать фильм"
				placeholder="Выбрать фильм"
			/>
			<div style={{ padding: '10px', width: 600 }}>
				<Progress value={value} size="lg" transitionDuration={200} />
			</div>
			<Group justify="center">
				<FileButton onChange={setFile} accept="image/png,image/jpeg">
					{(props) => <Button {...props}>Upload image</Button>}
				</FileButton>
			</Group>

			{file && (
				<Text size="sm" ta="center" mt="sm">
					Picked file: {file.name}
				</Text>
			)}
			<Button onClick={sendData} color="green">
				Сохранить
			</Button>

			<video
				width={500}
				height={300}
				controls
				// src="http://localhost:3030/stream-movies/2?quality=1080"
			/>
		</div>
	)
}
