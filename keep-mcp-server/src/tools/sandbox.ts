import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerSandboxTools(server: McpServer, auth: MCPAuth) {
	// sandbox_generate
	server.tool(
		"sandbox_generate",
		{
			numNotes: z.number().describe("number of items to generate"),
			useRandomData: z.boolean().describe("generate notes with random pinned").optional(),
		},
		async (generateData) => {
			const generatedData = await auth.callBackend("generateSandbox", "post", generateData);
			return {
				content: [{ type: "text", text: JSON.stringify(generatedData, null, 2) }]
			};
		}
	);

	// sandbox_delete
	server.tool(
		"sandbox_delete",
		{
		},
		async () => {
			await auth.callBackend("deleteSandbox", "delete");
			return {
				content: [{ type: "text", text: JSON.stringify({ message: "All sandbox data deleted" }, null, 2) }]
			};
		}
	);
}
