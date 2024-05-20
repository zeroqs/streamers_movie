/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import 'video.js/dist/video-js.css'

import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'

require('videojs-hls-quality-selector')

interface MoviePlayerProps {
	src: string
}

// playerRef.current.setCurrentTime()

export const MoviePlayer: React.FC<MoviePlayerProps> = ({ src }) => {
	const videoRef = useRef<HTMLDivElement | null>(null)
	const playerRef = useRef<any | null>(null)
	// const progressBarRef = useRef(null)

	// const [progress, setProgress] = useState(0)
	// const [buffered, setBuffered] = useState(0)
	// const [duration, setDuration] = useState(0)
	// const [isDragging, setIsDragging] = useState(false)

	// const handleClick = (e) => {
	// 	const rect = progressBarRef.current.getBoundingClientRect()
	// 	const offsetX = e.clientX - rect.left
	// 	const newProgress = (offsetX / rect.width) * duration
	// 	playerRef.current?.currentTime(newProgress)
	// }

	useEffect(() => {
		// Make sure Video.js player is only initialized once
		if (!playerRef.current && videoRef.current) {
			// The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
			const videoElement = document.createElement('video-js')
			videoElement.classList.add('vjs-big-play-centered')
			videoRef.current.append(videoElement)

			const playerOptions: unknown = {
				controls: true,
				sources: [
					{
						src,
						type: 'application/x-mpegURL',
					},
				],
			}

			playerRef.current = videojs(videoElement, playerOptions, () => {
				// setDuration(playerRef.current.duration())
				// if (playerRef.current.readyState() < 1) {
				// 	// wait for loadedmetdata event
				// 	playerRef.current.one('loadedmetadata', () =>
				// 		setDuration(playerRef.current.duration()),
				// 	)
				// } else {
				// 	// metadata already loaded
				// 	setDuration(playerRef.current.duration())
				// }
				// playerRef.current.on('timeupdate', () => {
				// 	setProgress(playerRef.current.currentTime())
				// 	const buffered = playerRef.current.buffered()
				// 	let bufferedTime = 0
				// 	for (let i = 0; i < buffered.length; i++) {
				// 		bufferedTime += buffered.end(i) - buffered.start(i)
				// 	}
				// 	setBuffered(bufferedTime)
				// })
			})
			playerRef.current.hlsQualitySelector()
			// You could update an existing player in the `else` block here
			// on prop change, for example:
		} else if (playerRef.current) {
			const player = playerRef.current
			player.src({ src, type: 'application/x-mpegURL' })
		}
	}, [src])

	useEffect(() => {
		const player = playerRef.current

		return () => {
			if (player && !player.isDisposed()) {
				player.dispose()
				playerRef.current = null
			}
		}
	}, [])

	return (
		<>
			<div className="relative w-fit" data-vjs-player>
				<div ref={videoRef} />
				{/* <div className="absolute bottom-0 left-0 right-0 w-full p-1">
					<input
						className="w-full"
						onMouseMove={handleMouseMove}
						onChange={(e) => playerRef.current?.currentTime(e.target.value)}
						value={progress}
						min={0}
						max={duration}
						type="range"
					/>
				</div> */}
			</div>

			{/* <div className="flex gap-8 mt-14">
				<Button onClick={() => playerRef.current?.play()}>play</Button>
				<Button onClick={() => playerRef.current?.pause()}>pause</Button>
				<Button onClick={() => playerRef.current?.requestFullscreen()}>
					full screen
				</Button>
			</div> */}

			{/* <div
				className="group w-full h-1 bg-gray-300 relative cursor-pointer rounded mt-14"
				onClick={handleClick}
				ref={progressBarRef}
			>
				<div
					className="rounded h-full bg-red-600 transition-all duration-300 ease-in-out"
					style={{ width: `${(progress / duration) * 100}%` }}
				/>
				<div
					className="hidden group-hover:block absolute top-0 left-0 h-3 w-3 bg-red-600 border border-red-600 rounded-full transform -translate-x-1/2 -translate-y-1 transition-transform duration-300 ease-in-out"
					style={{ left: `${(progress / duration) * 100}%` }}
				/>
			</div> */}
		</>
	)
}
