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
	const [imageFile, setImageFile] = useState<File | null>(null)

	const sendData = async () => {
		const fileSplitter = new FileSplitterService(video!)
		const chunks = fileSplitter.splitFileIntoChunks()

		const upload = new UploadService('movie-first-m', videoTitle, imageFile!)

		await upload.initiateMultipartUpload(chunks)
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
				<FileButton onChange={setImageFile} accept="image/png,image/jpeg">
					{(props) => <Button {...props}>Upload image</Button>}
				</FileButton>
			</Group>

			{imageFile && (
				<Text size="sm" ta="center" mt="sm">
					Picked file: {imageFile.name}
				</Text>
			)}
			<Button onClick={sendData} color="green">
				Сохранить
			</Button>

			<video
				width={500}
				height={300}
				controls
				src="http://localhost:3030/stream-movies/1"
			/>
		</div>
	)
}
