import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { MCPAuth } from "./auth";
import { registerNoteTools } from "./tools/notes";
import { registerLabelTools } from "./tools/labels";
import { registerCollaboratorTools } from "./tools/collaborators";
import { registerReminderTools } from "./tools/reminders";
import { registerBillingTools } from "./tools/billing";
import { registerSandboxTools } from "./tools/sandbox";
import { registerUserTools } from "./tools/user";

type AuthProps = Record<string, unknown> & {
	accessToken?: string;
	refreshToken?: string;
	apiKey?: string;
};

export class MyMCP extends McpAgent<Env, unknown, AuthProps> {
	server = new McpServer({
		name: "keep-mcp-server",
		version: "1.0.0",
	});
	private auth!: MCPAuth;

	async init() {
		this.auth = new MCPAuth(this.props?.accessToken, this.props?.refreshToken, this.props?.apiKey);

		// Register all tool groups
		registerNoteTools(this.server, this.auth); //done
		registerLabelTools(this.server, this.auth); //done
		registerCollaboratorTools(this.server, this.auth); //done
		registerReminderTools(this.server, this.auth); //done
		registerBillingTools(this.server, this.auth);
		registerSandboxTools(this.server, this.auth); // Done 
		registerUserTools(this.server, this.auth); // Done
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			const runtimeEnv = (globalThis as any).process?.env ?? (import.meta as any).env ?? {};
			const envVars = env as Env & { ACCESS_TOKEN?: string; REFRESH_TOKEN?: string; API_KEY?: string };
			const rawAuthToken = request.headers
				.get("authorization")
				?.replace(/^Bearer\s+/i, "");
			const accessTokenFromHeader = rawAuthToken && rawAuthToken.split(".").length === 3 ? rawAuthToken : undefined;
			const accessToken = envVars.ACCESS_TOKEN || runtimeEnv.ACCESS_TOKEN || runtimeEnv.accessToken || accessTokenFromHeader;
			const cookieHeader = request.headers.get("cookie") ?? "";
			const refreshToken = request.headers.get("x-refresh-token") ?? envVars.REFRESH_TOKEN ?? runtimeEnv.REFRESH_TOKEN ?? runtimeEnv.refreshToken;
			const apiKeyFromHeader = request.headers.get("x-api-key") ?? "";
			const apiKey = envVars.API_KEY || runtimeEnv.API_KEY || runtimeEnv.apiKey || apiKeyFromHeader;

			const ctxWithProps = ctx as ExecutionContext & { props?: AuthProps };
			ctxWithProps.props = { accessToken, refreshToken, apiKey };
			return MyMCP.serve("/mcp").fetch(request, env, ctxWithProps);

		}

		return new Response("Not found", { status: 404 });
	},
};
