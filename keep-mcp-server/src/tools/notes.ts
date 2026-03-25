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
				content: [{ type: "text", text: JSON.stringify(note, null, 2) }],
			};
		});

	// notes_update
	server.tool(
		"notes_update",
		{
			id: z.number().describe("Unique identifier for the note"),
			title: z.string().describe("Title of the note").optional(),
			description: z.string().describe("Description of the note").optional(),
			pinned: z.boolean().describe("Whether the note is pinned").optional(),
			isArchived: z.boolean().optional().describe("Whether the note is archived"),
			imageUrl: z.string().optional().describe("Image URL for the note"),
			isDeleted: z.boolean().optional().describe("Whether the note is deleted"),
			bgColor: z.string().optional().describe("Background color of the note"),
		},
		async (noteData) => {
			const { id, ...updateData } = noteData;
			const note = await auth.callBackend(`UpdateNotes/${id}`, "put", updateData);
			return {
				content: [{ type: "text", text: JSON.stringify(note, null, 2) }]
			};
		}
	);

	// notes_list
	server.tool(
		"notes_list",
		{},
		async () => {
			const notes = await auth.callBackend("notes", "get");
			return {
				content: [{ type: "text", text: JSON.stringify(notes, null, 2) }]
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
				content: [{ type: "text", text:  JSON.stringify(note, null, 2) }]
			};
		}
	);

	// notes_list_archived
	server.tool(
		"notes_list_archived",
		{},
		async () => {
			const archivedNotes = await auth.callBackend("archivedNotes", "get");
			return {
				content: [{ type: "text", text: JSON.stringify(archivedNotes, null, 2) }]
			};
		}
	);

	// notes_list_deleted
	server.tool(
		"notes_list_deleted",
		{},
		async () => {
			const deletedNotes = await auth.callBackend("deletedNotes", "get");
			return {
				content: [{ type: "text", text: JSON.stringify(deletedNotes, null, 2) }]
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
			await auth.callBackend(`deleteNotes/${id}`, "delete");
			return {
				content: [{ type: "text", text: JSON.stringify({ id, message: "Note deleted" }, null, 2) }]
			};
		}
	);

	// notes_empty_bin
	server.tool(
		"notes_empty_bin",
		{},
		async () => {
			await auth.callBackend("deleteNotes", "delete");
			return {
				content: [{ type: "text", text: JSON.stringify({ message: "Bin emptied" }, null, 2) }]
			};
		}
	);

}
