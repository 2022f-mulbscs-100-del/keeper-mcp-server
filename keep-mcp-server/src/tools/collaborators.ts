import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerCollaboratorTools(server: McpServer, auth: MCPAuth) {


	// collaborators_add
	server.tool(
		"collaborators_add",
		{
			noteId: z.string().describe("ID of the note to add collaborator to"),
			collaborator: z.email().describe("Email of the collaborator to add"),
			role: z.enum(["viewer", "editor"]).describe("Role of the collaborator").optional(),
		},
		async ({ noteId, collaborator, role }) => {
			const response = await auth.callBackend("addCollaborator", "post", { noteId, collaborator, role });
			return {
				content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
			};
		}
	);

	// collaborators_by_note
	server.tool(
		"collaborators_by_note",
		{
			noteId: z.string().describe("ID of the note to fetch collaborators for"),
		},
		async ({ noteId }) => {
			const collaborators = await auth.callBackend(`getCollaborators/${encodeURIComponent(noteId)}`, "get");
			return {
				content: [{ type: "text", text: JSON.stringify(collaborators, null, 2) }]
			};
		}
	);

	// collaborators_remove
	server.tool(
		"collaborators_remove",
		{
			noteId: z.string().describe("ID of the note to remove collaborator from"),
			collaborator: z.email().describe("Email of the collaborator to remove"),
		},
		async ({ noteId, collaborator }) => {
			await auth.callBackend(`deleteCollaborator`, "delete", { noteId, collaborator });
			return {
				content: [{ type: "text", text: `Collaborator with email ${collaborator} removed from note ${noteId}` }]
			};
		}
	);
}
