import axios, { AxiosError, Method } from "axios";

export class MCPAuth {
	private accessToken?: string;
	private refreshToken?: string;
	private apiKey?: string;

	constructor(accessToken?: string, refreshToken?: string, apiKey?: string) {
	
		this.accessToken = accessToken 
		this.refreshToken = refreshToken 
		this.apiKey = apiKey 
	}

	setTokens(accessToken: string, refreshToken: string, apiKey: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.apiKey = apiKey;
	}

	get AccessToken() {
		return this.accessToken;
	}

	get RefreshToken() {
		return this.refreshToken;
	}

	async fetcchAccessToken() {
		const response = await axios.get("http://localhost:2404/api/refresh", {
			headers: {
				Cookie: `refreshToken=${this.RefreshToken}`,
			}
		})
		this.accessToken = response.data.accessToken;
		return this.accessToken;
	}

	async callBackend(
		endpoint: string,
		method: Method = "get",
		data?: any
	): Promise<any> {

		try {
			const token = this.AccessToken; 
			const apiKey = this.apiKey;

			const config = {
				url: `http://localhost:2404/api/${endpoint}`,
				method,
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
					...(apiKey ? { "x-api-key": apiKey } : {})
				},
				...(method.toLowerCase() === "get" 
					? { params: data }
					: { data }),
			};

			const res = await axios(config);
			return res.data;

		} catch (error) {
			if ((error as AxiosError).response?.status === 401) {
				await this.fetcchAccessToken();
				return this.callBackend(endpoint, method, data);
			}
			if (axios.isAxiosError(error)) {
				const details = {
					request: `${method.toUpperCase()} http://localhost:2404/api/${endpoint}`,
					status: error.response?.status,
					statusText: error.response?.statusText,
					responseData: error.response?.data,
					message: error.message,
				};

				throw new Error(`Backend request failed: ${JSON.stringify(details, null, 2)}`);
			}

			throw error;
		}
	}
}
