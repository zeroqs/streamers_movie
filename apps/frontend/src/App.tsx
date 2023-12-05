import { Button, FileButton, Group, Progress } from '@mantine/core'
import { useState } from 'react'

export const App = () => {
	const [value, setValue] = useState(66)

	const sendFile = (file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		fetch('http://localhost:3000/upload-movies', {
			method: 'POST',
			body: formData,
		})
	}

	return (
		<>
			<Group justify="center">
				<FileButton onChange={sendFile} accept="video/*">
					{(props) => <Button {...props}>Upload image</Button>}
				</FileButton>
			</Group>

			<video
				controls
				src="https://storage.yandexcloud.net/movie-first-m/Squad%202023.08.03%20-%2019.10.47.02.DVR.mp4"
				poster="frontend.jpg"
				width="580"
			/>

			<div style={{ width: '900px' }}>
				<Progress value={value} />
			</div>
		</>
	)
}
