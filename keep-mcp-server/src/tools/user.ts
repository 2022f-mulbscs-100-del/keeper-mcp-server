import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerUserTools(server: McpServer, auth: MCPAuth) {
	// user_get_profile
	server.tool(
		"user_get_profile",
		{},
		async () => {
			const profile = await auth.callBackend("userProfile", "get");
			return {
				content: [{ type: "text", text: JSON.stringify(profile, null, 2)}]
			};
		}
	);

	// user_update_profile
	server.tool(
		"user_update_profile",
		{
			name: z.string().describe("Name of the user").optional(),
			profileImage: z.string().describe("Profile image URL of the user").optional(),
			isTwoFaEnabled: z.boolean().describe("Whether 2FA is enabled for the user").optional(),
			autoLogoutEnabled: z.boolean().describe("Whether auto-logout is enabled for the user").optional(),
			autoLogoutDuration: z.number().describe("Duration (in minutes) for auto-logout").optional(),
			theme: z.enum(["light", "dark", "system"]).describe("Preferred theme of the user").optional(),
			MfaEnabled: z.boolean().describe("Whether MFA is enabled for the user").optional(),
			layout: z.enum(["grid", "list"]).describe("Preferred layout of the user").optional(),
		},
		async (profileData) => {
			const updatedProfile = await auth.callBackend("updateProfile", "patch", profileData);
			return {
				content: [{ type: "text", text: JSON.stringify(updatedProfile, null, 2) }]
			};
		}
	);

	// user_delete_profile
	server.tool(
		"user_delete_profile",
		{
			password: z.string().describe("Password of the user for verification").optional(),
		},
		async (password) => {

			await auth.callBackend("deleteProfile", "delete",  password );
			return {
				content: [{ type: "text", text: JSON.stringify({ message: "User profile deleted" }, null, 2) }]
			};
		}
	);

	// user_get_by_email
	server.tool(
		"user_get_by_email",
		{
			email: z.email().describe("Email of the user to fetch"),
		},
		async ({ email }) => {
			const user = await auth.callBackend(`getUser/${encodeURIComponent(email)}`, "get");
			return {
				content: [{ type: "text", text: JSON.stringify(user, null, 2) }]
			};
		}
	);
}


// URLs have reserved characters:
// ? = & / # : + space
// If your data contains these, it can corrupt the request.
// can be fixed with uriencodeURIComponent()