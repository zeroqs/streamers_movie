/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'movie-first-m.storage.yandexcloud.net',
				port: '',
				pathname: './**',
			},
		],
	},
}

export default nextConfig
