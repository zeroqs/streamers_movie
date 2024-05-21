import ky, { Options, ResponsePromise } from 'ky'

export class ApiService {
	static readonly baseUrl: string = 'http://176.109.101.147:3030'

	static async get(url?: string, options?: Options): Promise<ResponsePromise> {
		try {
			return await ky.get(`${this.baseUrl}/${url}`, options)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	static async post(url?: string, options?: Options): Promise<ResponsePromise> {
		try {
			return await ky.post(`${this.baseUrl}/${url}`, options)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	static async put(url?: string, options?: Options): Promise<ResponsePromise> {
		try {
			return await ky.put(`${this.baseUrl}/${url}`, options)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	static async delete(
		url?: string,
		options?: Options,
	): Promise<ResponsePromise> {
		try {
			return await ky.delete(`${this.baseUrl}/${url}`, options)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
