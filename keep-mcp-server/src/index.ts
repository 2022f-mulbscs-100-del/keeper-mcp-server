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
};

export class MyMCP extends McpAgent<Env, unknown, AuthProps> {
	server = new McpServer({
		name: "keep-mcp-server",
		version: "1.0.0",
	});
	private auth!: MCPAuth;

	async init() {
		this.auth = new MCPAuth(this.props?.accessToken, this.props?.refreshToken);

		// Register all tool groups
		registerNoteTools(this.server, this.auth);
		registerLabelTools(this.server, this.auth);
		registerCollaboratorTools(this.server, this.auth);
		registerReminderTools(this.server, this.auth);
		registerBillingTools(this.server, this.auth);
		registerSandboxTools(this.server, this.auth);
		registerUserTools(this.server, this.auth);
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
