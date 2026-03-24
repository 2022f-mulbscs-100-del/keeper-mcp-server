import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerCollaboratorTools(server: McpServer, auth: MCPAuth) {
	// collaborators_list
	server.tool(
		"collaborators_list",
		{},
		async () => {
			const collaborators = await auth.callBackend("collaborators", "get");
			return {
				content: [{ type: "text", text: `Collaborators: ${JSON.stringify(collaborators)}` }]
			};
		}
	);

	// collaborators_add
	server.tool(
		"collaborators_add",
		{
			email: z.string().email().describe("Email of the collaborator to add"),
		},
		async ({ email }) => {
			await auth.callBackend("collaborators", "post", { email });
			return {
				content: [{ type: "text", text: `Collaborator with email ${email} added` }]
			};
		}
	);

	// collaborators_remove
	server.tool(
		"collaborators_remove",
		{
			email: z.string().email().describe("Email of the collaborator to remove"),
		},
		async ({ email }) => {
			await auth.callBackend("collaborators", "delete", { email });
			return {
				content: [{ type: "text", text: `Collaborator with email ${email} removed` }]
			};
		}
	);
}
