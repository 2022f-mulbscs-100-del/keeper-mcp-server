import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerReminderTools(server: McpServer, auth: MCPAuth) {
	// reminders_create
	server.tool(
		"reminders_create",
		{
			title: z.string().describe("Title of the reminder"),
			datetime: z.string().describe("Date and time for the reminder in ISO format"),
			noteId: z.number().describe("ID of the note associated with the reminder").optional(),
		},
		async (reminderData) => {
			const reminder = {
				id: (Date.now() + Math.floor(Math.random() * 1000)) % 100000,
				title: reminderData.title,
				datetime: reminderData.datetime,
				noteId: reminderData.noteId,
			};

			await auth.callBackend("addreminders", "post", reminder);

			return {
				content: [{ type: "text", text: `Reminder created with ID: ${reminder.id}` }],
			};
		}
	);

	// reminders_list
	server.tool(
		"reminders_list",
		{},
		async () => {
			const reminders = await auth.callBackend("reminders", "get");
			return {
				content: [{ type: "text", text: `Reminders: ${JSON.stringify(reminders)}` }]
			};
		}
	);

	// reminders_get_by_note
	server.tool(
		"reminders_get_by_note",
		{
			noteId: z.number().describe("ID of the note to fetch reminders for"),
		},
		async ({ noteId }) => {
			const reminders = await auth.callBackend(`reminders/note/${noteId}`, "get");
			return {
				content: [{ type: "text", text: `Reminders for note ${noteId}: ${JSON.stringify(reminders)}` }]
			};
		}
	);

	// reminders_update
	server.tool(
		"reminders_update",
		{
			id: z.number().describe("Unique identifier for the reminder"),
			title: z.string().describe("Title of the reminder").optional(),
			datetime: z.string().describe("Date and time for the reminder in ISO format").optional(),
		},
		async (reminderData) => {
			const { id, ...updateData } = reminderData;
			await auth.callBackend(`reminders/${id}`, "put", updateData);
			return {
				content: [{ type: "text", text: `Reminder with ID ${id} updated` }]
			};
		}
	);
}
