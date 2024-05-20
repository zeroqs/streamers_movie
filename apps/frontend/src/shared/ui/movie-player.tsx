/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import 'video.js/dist/video-js.css'

import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'

import { Button } from '@/shared/ui/button'

interface MoviePlayerProps {
	src: string
}

// playerRef.current.setCurrentTime()

export const MoviePlayer: React.FC<MoviePlayerProps> = ({ src }) => {
	const videoRef = useRef<HTMLDivElement | null>(null)
	const playerRef = useRef<any | null>(null)

	const [progress, setProgress] = useState(0)
	const [buffered, setBuffered] = useState(0)
	const [duration, setDuration] = useState(0)

	useEffect(() => {
		// Make sure Video.js player is only initialized once
		if (!playerRef.current && videoRef.current) {
			// The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
			const videoElement = document.createElement('video-js')
			videoElement.classList.add('vjs-big-play-centered')
			videoRef.current.append(videoElement)

			const playerOptions: unknown = {
				sources: [
					{
						src,
						type: 'application/x-mpegURL',
					},
				],
			}

			playerRef.current = videojs(videoElement, playerOptions, () => {
				setDuration(playerRef.current.duration())

				if (playerRef.current.readyState() < 1) {
					// wait for loadedmetdata event
					playerRef.current.one('loadedmetadata', onLoadedMetadata)
				} else {
					// metadata already loaded
					onLoadedMetadata()
				}

				function onLoadedMetadata() {
					setDuration(playerRef.current.duration())
				}

				playerRef.current.on('timeupdate', () => {
					setProgress(playerRef.current.currentTime())
					const buffered = playerRef.current.buffered()
					let bufferedTime = 0
					for (let i = 0; i < buffered.length; i++) {
						bufferedTime += buffered.end(i) - buffered.start(i)
					}

					setBuffered(bufferedTime)
				})
			})

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
	const progressPercentage = duration ? (progress / duration) * 100 : 0
	const bufferedPercentage = duration ? (buffered / duration) * 100 : 0

	return (
		<>
			<div data-vjs-player>
				<div ref={videoRef} />
			</div>

			<div className="flex gap-8 mt-14">
				<Button onClick={() => playerRef.current?.play()}>play</Button>
				<Button onClick={() => playerRef.current?.pause()}>pause</Button>
				<Button onClick={() => playerRef.current?.requestFullscreen()}>
					full screen
				</Button>
			</div>

			<div className="relative w-full h-2 bg-gray-300">
				<div
					className="absolute h-full bg-gray-500"
					style={{ width: `${bufferedPercentage}%` }}
				/>
				<div
					className="absolute h-full bg-blue-500"
					style={{ width: `${progressPercentage}%` }}
				/>
			</div>
		</>
	)
}
