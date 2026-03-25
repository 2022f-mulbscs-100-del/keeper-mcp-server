import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

const repeatSchema = z
	.union([
		z.enum(["daily", "weekly", "monthly", "yearly"]),
		z.literal("null"),
		z.literal("none"),
		z.null(),
	])
	.optional();

const normalizeRepeat = (repeat: z.infer<typeof repeatSchema>) => {
	if (repeat === undefined) return undefined;
	if (repeat === null || repeat === "null" || repeat === "none") return null;
	return repeat;
};

export function registerReminderTools(server: McpServer, auth: MCPAuth) {
	// reminders_create
	server.tool(
		"reminders_create",
		{
			noteId: z.string().describe("ID of the note associated with the reminder"),
			title: z.string().describe("Title of the reminder"),
			date: z.string().describe("Date and time for the reminder in ISO format"),
			time: z.string().describe("Time for the reminder in ISO format"),
			repeat: repeatSchema.describe("Repeat pattern for the reminder"),
		},
		async (reminderData) => {
			const reminder = {
				title: reminderData.title,
				date: reminderData.date,
				time: reminderData.time,
				noteId: reminderData.noteId,
				repeat: normalizeRepeat(reminderData.repeat),
			};

			const response = await auth.callBackend("createReminder", "post", reminder);

			return {
				content: [{ type: "text", text: JSON.stringify(response) }],
			};
		}
	);

	// reminders_list
	server.tool(
		"reminders_list",
		{},
		async () => {
			const reminders = await auth.callBackend("getRemainderNotes", "get");
			return {
				content: [{ type: "text", text: JSON.stringify(reminders) }]
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
			const reminders = await auth.callBackend(`remainder-notes/${noteId}`, "get");
			return {
				content: [{ type: "text", text: JSON.stringify(reminders) }]
			};
		}
	);

	// reminders_update
	server.tool(
		"reminders_update",
		{
			reminderId: z.string().describe("ID of the reminder to update"),
			title: z.string().describe("Title of the reminder"),
			date: z.string().describe("Date and time for the reminder in ISO format"),
			time: z.string().describe("Time for the reminder in ISO format"),
			repeat: repeatSchema.describe("Repeat pattern for the reminder"),
		},
		async (reminderData) => {
			const updatePayload = {
				title: reminderData.title,
				date: reminderData.date,
				time: reminderData.time,
				repeat: normalizeRepeat(reminderData.repeat),
			};

			const response = await auth.callBackend(`remainder-notes/update/${reminderData.reminderId}`, "put", updatePayload);
			return {
				content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
			};
		}
	);
	
}
