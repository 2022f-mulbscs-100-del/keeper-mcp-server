import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import axios, { AxiosError } from "axios";
import { z } from "zod";

// Define our MCP agent with tools

interface Note {
	id: number;
	title?: string;
	description?: string;
	pinned?: boolean;
	category?: string;
	list?: string;
}

type AuthProps = Record<string, unknown> & {
	accessToken?: string;
	refreshToken?: string;
};

class MCPAuth {
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



	async callBackend(endpoint: string, data: any): Promise<any> {
		try {
			return await axios.post(`http://localhost:2404/api/${endpoint}`, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${await this.AccessToken}`,
					"x-api-key": process.env.MCP_API_KEY,
				},
			});
		} catch (error) {
			if ((error as AxiosError).response?.status === 401) {
				await this.fetcchAccessToken();
				return this.callBackend(endpoint, data);
			}
		}
	}
}

export class MyMCP extends McpAgent<Env, unknown, AuthProps> {
	server = new McpServer({
		name: "keep-mcp-server",
		version: "1.0.0",
	});
	private auth!: MCPAuth;


	async init() {
		this.auth = new MCPAuth(this.props?.accessToken, this.props?.refreshToken);

		this.server.tool(
			"createNote",
			{
				// id: z.number().describe("Unique identifier for the note"),
				title: z.string().describe("Title of the note").optional(),
				description: z.string().describe("Description of the note").optional(),
				pinned: z.boolean().describe("Whether the note is pinned").optional(),
				category: z.string().describe("Category of the note").optional(),
				// list: z.string().describe("List to which the note belongs").optional(),
			},

			async (noteData) => {
				const note: Note = {
					id: (Date.now() + Math.floor(Math.random() * 1000)) % 100000,
					title: noteData.title,
					description: noteData.description,
					pinned: noteData.pinned,
					category: noteData.category,
					// list: noteData.list,
				};

				await this.auth.callBackend("notes", note);

				return {
					content: [{ type: "text", text: `Note created with ID: ${note.id}` }],
				};
			});


		// Simple addition tool
		this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
			content: [{ type: "text", text: String(a + b) }],
		}));

		// Calculator tool with multiple operations
		this.server.tool(
			"calculate",
			{
				operation: z.enum(["add", "subtract", "multiply", "divide"]),
				a: z.number(),
				b: z.number(),
			},
			async ({ operation, a, b }) => {
				let result: number;
				switch (operation) {
					case "add":
						result = a + b;
						break;
					case "subtract":
						result = a - b;
						break;
					case "multiply":
						result = a * b;
						break;
					case "divide":
						if (b === 0)
							return {
								content: [
									{
										type: "text",
										text: "Error: Cannot divide by zero",
									},
								],
							};
						result = a / b;
						break;
				}
				return { content: [{ type: "text", text: String(result) }] };
			},
		);

	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			const accessToken = request.headers
				.get("authorization")
				?.replace(/^Bearer\s+/i, "");
			const cookieHeader = request.headers.get("cookie") ?? "";
			const refreshToken = request.headers.get("x-refresh-token") ?? "";

			const ctxWithProps = ctx as ExecutionContext & { props?: AuthProps };
			ctxWithProps.props = { accessToken, refreshToken };
			return MyMCP.serve("/mcp").fetch(request, env, ctxWithProps);

		}

		return new Response("Not found", { status: 404 });
	},
};
