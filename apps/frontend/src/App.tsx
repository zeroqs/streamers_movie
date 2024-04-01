import {
	Button,
	FileButton,
	FileInput,
	Group,
	Input,
	Progress,
	Text,
} from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'

export const App = () => {
	const [value, setValue] = useState(0)
	const [video, setVideo] = useState<File | null>(null)
	const [videoTitle, setVideoTitle] = useState('')
	const [file, setFile] = useState<File | null>(null)

	const sendData = async () => {
		const formData = new FormData()
		formData.append('movieFile', video!)
		formData.append('title', videoTitle)
		formData.append('imageFile', file!)

		const response = fetch('http://localhost:3030/movies', {
			method: 'POST',
			body: formData,
		})
		const data = (await response).json()
		console.log(data)
	}
	// 	const response = fetch('http://localhost:3030/movies', {
	// 		method: 'GET',
	// 	})
	// 	const data = (await response).json()
	// 	console.log(data)
	// }

	// useEffect(() => {
	// 	const eventSource = new EventSource(
	// 		'http://localhost:3030/upload-movies/progress',
	// 	)

	// 	eventSource.addEventListener('error', (err) => {
	// 		console.error('EventSource failed:', err)
	// 	})

	// 	eventSource.addEventListener('message', (event) => {
	// 		const data = JSON.parse(event.data)
	// 		const progress = data.progress
	// 		setValue(progress)

	// 		if (progress === 100) {
	// 			eventSource.close()
	// 		}
	// 	})
	// }, [sendData])

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
		</div>
	)
}
