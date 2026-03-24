import axios, { AxiosError, Method } from "axios";

export class MCPAuth {
	private accessToken?: string;
	private refreshToken?: string;

	constructor(accessToken?: string, refreshToken?: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	setTokens(accessToken: string, refreshToken: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
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

			const config = {
				url: `http://localhost:2404/api/${endpoint}`,
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				...(method.toLowerCase() === "get" || method.toLowerCase() === "delete"
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
			throw error;
		}
	}
}
