import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerSandboxTools(server: McpServer, auth: MCPAuth) {
	// sandbox_generate
	server.tool(
		"sandbox_generate",
		{
			type: z.enum(["note", "label", "collaborator", "reminder"]).describe("Type of data to generate"),
			count: z.number().describe("Number of items to generate").optional(),
		},
		async (generateData) => {
			const generatedData = await auth.callBackend("sandbox/generate", "post", generateData);
			return {
				content: [{ type: "text", text: `Generated data: ${JSON.stringify(generatedData)}` }]
			};
		}
	);

	// sandbox_delete
	server.tool(
		"sandbox_delete",
		{
			type: z.enum(["note", "label", "collaborator", "reminder"]).describe("Type of data to delete"),
		},
		async ({ type }) => {
			await auth.callBackend("sandbox/delete", "delete", { type });
			return {
				content: [{ type: "text", text: `Deleted all sandbox data of type: ${type}` }]
			};
		}
	);
}
