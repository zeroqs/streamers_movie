import { Button, FileButton, Group, Progress } from '@mantine/core'
import { useEffect } from 'react'

const downLoadHandler = () => {
	const eventSource = new EventSource(
		'http://localhost:3030/upload-movies/progress',
	)

	eventSource.onerror = function (err) {
		console.error('EventSource failed:', err)
	}

	eventSource.onmessage = function (event) {
		const data = JSON.parse(event.data)
		const progress = data.progress
		console.log('Upload progress:', progress)
	}
}

export const App = () => {
	const sendFile = (file: File) => {
		downLoadHandler()

		const formData = new FormData()
		formData.append('file', file)
		fetch('http://localhost:3030/upload-movies', {
			method: 'POST',
			body: formData,
		})
	}

	return (
		<>
			lets go
			<FileButton onChange={sendFile} accept="video/*">
				{(props) => <Button {...props}>Upload image</Button>}
			</FileButton>
		</>
	)
}
