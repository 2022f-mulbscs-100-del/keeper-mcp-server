import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";
import { Note } from "../types";

export function registerNoteTools(server: McpServer, auth: MCPAuth) {
	// notes_create
	server.tool(
		"notes_create",
		{
			title: z.string().describe("Title of the note").optional(),
			description: z.string().describe("Description of the note").optional(),
			pinned: z.boolean().describe("Whether the note is pinned").optional(),
			category: z.string().describe("Category of the note").optional(),
		},
		async (noteData) => {
			const note: Note = {
				id: (Date.now() + Math.floor(Math.random() * 1000)) % 100000,
				title: noteData.title,
				description: noteData.description,
				pinned: noteData.pinned,
				category: noteData.category,
			};

			await auth.callBackend("addnotes", "post", note);

			return {
				content: [{ type: "text", text: `Note created with ID: ${note.id}` }],
			};
		});

	// notes_list
	server.tool(
		"notes_list",
		{},
		async () => {
			const notes = await auth.callBackend("notes", "get");
			return {
				content: [{ type: "text", text: `Notes: ${JSON.stringify(notes)}` }]
			};
		}
	);

	// notes_update
	server.tool(
		"notes_update",
		{
			id: z.number().describe("Unique identifier for the note"),
			title: z.string().describe("Title of the note").optional(),
			description: z.string().describe("Description of the note").optional(),
			pinned: z.boolean().describe("Whether the note is pinned").optional(),
			category: z.string().describe("Category of the note").optional(),
		},
		async (noteData) => {
			const { id, ...updateData } = noteData;
			await auth.callBackend(`notes/${id}`, "put", updateData);
			return {
				content: [{ type: "text", text: `Note with ID ${id} updated` }]
			};
		}
	);

	// notes_delete_by_id
	server.tool(
		"notes_delete_by_id",
		{
			id: z.number().describe("Unique identifier for the note"),
		},
		async ({ id }) => {
			await auth.callBackend(`notes/${id}`, "delete");
			return {
				content: [{ type: "text", text: `Note with ID ${id} deleted` }]
			};
		}
	);

	// notes_empty_bin
	server.tool(
		"notes_empty_bin",
		{},
		async () => {
			await auth.callBackend("notes/emptybin", "delete");
			return {
				content: [{ type: "text", text: `Bin emptied` }]
			};
		}
	);

	// notes_list_deleted
	server.tool(
		"notes_list_deleted",
		{},
		async () => {
			const deletedNotes = await auth.callBackend("notes/deleted", "get");
			return {
				content: [{ type: "text", text: `Deleted notes: ${JSON.stringify(deletedNotes)}` }]
			};
		}
	);

	// notes_list_archived
	server.tool(
		"notes_list_archived",
		{},
		async () => {
			const archivedNotes = await auth.callBackend("notes/archived", "get");
			return {
				content: [{ type: "text", text: `Archived notes: ${JSON.stringify(archivedNotes)}` }]
			};
		}
	);

	// notes_get_by_id
	server.tool(
		"notes_get_by_id",
		{
			id: z.number().describe("Unique identifier for the note"),
		},
		async ({ id }) => {
			const note = await auth.callBackend(`notes/${id}`, "get");
			return {
				content: [{ type: "text", text: `Note details: ${JSON.stringify(note)}` }]
			};
		}
	);
}
