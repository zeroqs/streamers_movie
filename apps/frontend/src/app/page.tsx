import Video from 'next-video'

export default function Home() {
	// https://storage.yandexcloud.net/movie-first-m/nature/stream/master.m3u8
	return (
		<main className="flex flex-col gap-6 min-h-screen p-24">
			main
			<Video src="https://storage.yandexcloud.net/movie-first-m/nature/stream/master.m3u8" />
		</main>
	)
}
