/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_S3_SECRET_KEY: string
	readonly VITE_S3_ACCESS_KEY: string
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
