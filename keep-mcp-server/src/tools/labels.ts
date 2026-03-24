import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerLabelTools(server: McpServer, auth: MCPAuth) {
	// labels_create
	server.tool(
		"labels_create",
		{
			name: z.string().describe("Name of the label"),
			color: z.string().describe("Color of the label in hex code").optional(),
		},
		async (labelData) => {
			const label = {
				id: (Date.now() + Math.floor(Math.random() * 1000)) % 100000,
				name: labelData.name,
				color: labelData.color,
			};

			await auth.callBackend("addlabels", "post", label);

			return {
				content: [{ type: "text", text: `Label created with ID: ${label.id}` }],
			};
		}
	);

	// labels_update
	server.tool(
		"labels_update",
		{
			id: z.number().describe("Unique identifier for the label"),
			name: z.string().describe("Name of the label").optional(),
			color: z.string().describe("Color of the label in hex code").optional(),
		},
		async (labelData) => {
			const { id, ...updateData } = labelData;
			await auth.callBackend(`labels/${id}`, "put", updateData);
			return {
				content: [{ type: "text", text: `Label with ID ${id} updated` }]
			};
		}
	);

	// labels_delete
	server.tool(
		"labels_delete",
		{
			id: z.number().describe("Unique identifier for the label"),
		},
		async ({ id }) => {
			await auth.callBackend(`labels/${id}`, "delete");
			return {
				content: [{ type: "text", text: `Label with ID ${id} deleted` }]
			};
		}
	);

	// labels_get_by_title
	server.tool(
		"labels_get_by_title",
		{
			name: z.string().describe("Name of the label to fetch"),
		},
		async ({ name }) => {
			const label = await auth.callBackend(`labels/name/${name}`, "get");
			return {
				content: [{ type: "text", text: `Label details: ${JSON.stringify(label)}` }]
			};
		}
	);

	// labels_list
	server.tool(
		"labels_list",
		{},
		async () => {
			const labels = await auth.callBackend("labels", "get");
			return {
				content: [{ type: "text", text: `Labels: ${JSON.stringify(labels)}` }]
			};
		}
	);
}
