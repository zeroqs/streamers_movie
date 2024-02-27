import { Button, FileButton, Progress } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'

export const App = () => {
	const [value, setValue] = useState(0)

	const sendFile = useCallback((file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		fetch('http://localhost:3030/upload-movies', {
			method: 'POST',
			body: formData,
		})
	}, [])

	useEffect(() => {
		const eventSource = new EventSource(
			'http://localhost:3030/upload-movies/progress',
		)

		eventSource.addEventListener('error', (err) => {
			console.error('EventSource failed:', err)
		})

		eventSource.addEventListener('message', (event) => {
			const data = JSON.parse(event.data)
			const progress = data.progress
			setValue(progress)

			if (progress === 100) {
				eventSource.close()
			}
		})
	}, [sendFile])

	return (
		<>
			lets go
			<FileButton onChange={sendFile} accept="video/*">
				{(props) => <Button {...props}>Upload image</Button>}
			</FileButton>
			<div style={{ padding: '10px', width: 600 }}>
				<Progress value={value} size="lg" transitionDuration={200} />
			</div>
		</>
	)
}
