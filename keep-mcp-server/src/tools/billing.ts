import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCPAuth } from "../auth";

export function registerBillingTools(server: McpServer, auth: MCPAuth) {
	// billing_create_payment_intent
	server.tool(
		"billing_create_payment_intent",
		{
			amount: z.number().describe("Amount for the payment intent in cents"),
			currency: z.string().describe("Currency code for the payment intent (e.g., USD)"),
		},
		async (paymentData) => {
			const paymentIntent = await auth.callBackend("billing/payment-intent", "post", paymentData);
			return {
				content: [{ type: "text", text: `Payment intent created: ${JSON.stringify(paymentIntent)}` }]
			};
		}
	);

	// billing_update_payment_method
	server.tool(
		"billing_update_payment_method",
		{
			paymentMethodId: z.string().describe("ID of the new payment method"),
		},
		async ({ paymentMethodId }) => {
			await auth.callBackend("billing/payment-method", "put", { paymentMethodId });
			return {
				content: [{ type: "text", text: `Payment method updated to ID: ${paymentMethodId}` }]
			};
		}
	);

	// billing_get_setup_intent
	server.tool(
		"billing_get_setup_intent",
		{},
		async () => {
			const setupIntent = await auth.callBackend("billing/setup-intent", "get");
			return {
				content: [{ type: "text", text: `Setup intent details: ${JSON.stringify(setupIntent)}` }]
			};
		}
	);

	// billing_cancel_subscription
	server.tool(
		"billing_cancel_subscription",
		{},
		async () => {
			await auth.callBackend("billing/subscription", "delete");
			return {
				content: [{ type: "text", text: `Subscription cancelled` }]
			};
		}
	);

	// billing_upgrade_subscription
	server.tool(
		"billing_upgrade_subscription",
		{
			newPlanId: z.string().describe("ID of the new subscription plan to upgrade to"),
		},
		async ({ newPlanId }) => {
			await auth.callBackend("billing/subscription/upgrade", "post", { newPlanId });
			return {
				content: [{ type: "text", text: `Subscription upgraded to plan ID: ${newPlanId}` }]
			};
		}
	);
}
