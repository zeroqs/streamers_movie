/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import 'video.js/dist/video-js.css'

import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'

import { Button } from '@/shared/ui/button'

interface MoviePlayerProps {
	src: string
}

export const MoviePlayer: React.FC<MoviePlayerProps> = ({ src }) => {
	const videoRef = useRef<HTMLDivElement | null>(null)
	const playerRef = useRef<any | null>(null)

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
				videojs.log('player is ready')
			})

			console.log(playerRef.current)

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
			<div data-vjs-player>
				<div ref={videoRef} />
			</div>

			<Button onClick={() => playerRef.current?.requestFullscreen()}>
				play
			</Button>
		</>
	)
}
