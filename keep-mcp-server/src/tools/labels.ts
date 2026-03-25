import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerLabelTools(server: McpServer, auth: MCPAuth) {
	// labels_create
	server.tool(
		"labels_create",
		{
			categoryName: z.string().describe("Name of the label"),
			colorCode: z.string().describe("Color of the label in hex code").optional(),
		},
		async (labelData) => {
			const label = {
				categoryName: labelData.categoryName,
				colorCode: labelData.colorCode,
			};

		const response =	await auth.callBackend("createLabelCategories", "post", label);

			return {
				content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
			};
		}
	);

	// labels_update
	server.tool(
		"labels_update",
		{
			id: z.number().describe("Unique identifier for the label"),
			categoryName: z.string().describe("Name of the label").optional(),
			colorCode: z.string().describe("Color of the label in hex code").optional(),
		},
		async (labelData) => {
			const { id, ...updateData } = labelData;
			const response = await auth.callBackend(`updateLabelCategories`, "put", {
				id,
				...updateData,
			});
			return {
				content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
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
			await auth.callBackend(`deleteLabelCategories/${id}`, "delete");
			return {
				content: [{ type: "text", text: JSON.stringify({ id, message: "Label deleted" }, null, 2) }]
			};
		}
	);

	// labels_get_by_title
	server.tool(
		"labels_get_by_title",
		{
			title: z.string().describe("Name of the label to fetch"),
		},
		async ({ title }) => {
			const label = await auth.callBackend(`getLabelCategoriesByCategoryName/${title}`, "get");
			return {
				content: [{ type: "text", text: JSON.stringify(label, null, 2) }]
			};
		}
	); 

	// labels_list
	server.tool(
		"labels_list",
		{},
		async () => {
			const labels = await auth.callBackend("getLabelCategories", "get");
			return {
				content: [{ type: "text", text:  JSON.stringify(labels, null, 2) }]
			};
		}
	);
}
