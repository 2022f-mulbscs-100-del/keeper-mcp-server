# MCP API Tool List (Frontend + Backend Audit)

This file lists the APIs to expose as MCP tools after checking both frontend usage and backend routes.

## Base Notes
- Backend base path: `/api/*`
- Refresh endpoint is outside `/api`: `/refresh`
- Most endpoints require auth cookie/JWT via backend middleware.

## 1) MCP Tools To Build First (Used By Frontend + Implemented In Backend)

### Auth and Session
- `POST /api/signup` -> `auth_signup`
- `POST /api/login` -> `auth_login`
- `GET /api/logout` -> `auth_logout`
- `GET /refresh` -> `auth_refresh`
- `POST /api/signUpConfirmation` -> `auth_signup_confirm`
- `POST /api/code-check` -> `auth_code_check`
- `POST /api/forget-password-token` -> `auth_forgot_password_token`
- `POST /api/reset-password` -> `auth_reset_password`
- `POST /api/login-verify-mfa` -> `auth_login_verify_mfa`
- `POST /api/2fa-login` -> `auth_2fa_login`
- `POST /api/MFA-generate` -> `auth_mfa_generate`
- `POST /api/verify-mfa` -> `auth_mfa_verify`
- `GET /api/auth/google` -> `auth_google_start`
- `GET /api/auth/github` -> `auth_github_start`

### User Profile
- `GET /api/userProfile` -> `user_get_profile`
- `PATCH /api/updateProfile` -> `user_update_profile`
- `DELETE /api/deleteProfile` -> `user_delete_profile`
- `GET /api/getUser/:email` -> `user_get_by_email`

### Notes
- `GET /api/notes` -> `notes_list`
- `POST /api/addnotes` -> `notes_create`
- `PUT /api/UpdateNotes/:id` -> `notes_update`
- `DELETE /api/deleteNotes/:id` -> `notes_delete_by_id`
- `DELETE /api/deleteNotes` -> `notes_empty_bin`
- `GET /api/deletedNotes` -> `notes_list_deleted`
- `GET /api/archivedNotes` -> `notes_list_archived`

### Collaborators
- `GET /api/getCollaborators/:noteId` -> `collaborators_list`
- `POST /api/addCollaborator` -> `collaborators_add`
- `DELETE /api/deleteCollaborator` -> `collaborators_remove`

### Reminders
- `POST /api/createReminder` -> `reminders_create`
- `GET /api/getRemainderNotes` -> `reminders_list`
- `GET /api/remainder-notes/:noteId` -> `reminders_get_by_note`
- `PUT /api/remainder-notes/update/:remainderId` -> `reminders_update`

### Label Categories
- `POST /api/createLabelCategories` -> `labels_create`
- `GET /api/getLabelCategories` -> `labels_list`

### Payments and Subscription
- `POST /api/create-payment-intent` -> `billing_create_payment_intent`
- `POST /api/update-method-payment` -> `billing_update_payment_method`
- `GET /api/setUpIntent` -> `billing_get_setup_intent`
- `GET /api/cancel-subscription` -> `billing_cancel_subscription`
- `GET /api/upgrade-subscription` -> `billing_upgrade_subscription`



### API Keys
- `POST /api/generateApiKey` -> `apikeys_generate`
- `GET /api/api-keys` -> `apikeys_list`
- `PATCH /api/api-keys/:apiKeyId/last-used` -> `apikeys_mark_last_used`
- `PATCH /api/api-keys/:apiKeyId/revoke` -> `apikeys_revoke`

### Security and Utility
- `POST /api/turnstile-verify` -> `security_verify_turnstile`
- `POST /api/send-email` -> `email_send`
- `POST /api/passkey-registration` -> `passkey_register`
- `POST /api/passkey-verification` -> `passkey_verify`
- `POST /api/generateSandbox` -> `sandbox_generate`
- `DELETE /api/deleteSandbox` -> `sandbox_delete`

## 2) Backend APIs Available But Not Clearly Used In Frontend
- `GET /api/notes/:id` -> `notes_get_by_id`
- `PUT /api/updateLabelCategories` -> `labels_update`
- `GET /api/deleteLabelCategories/:id` -> `labels_delete` (implemented as GET in backend)----------------
- `GET /api/getLabelCategoriesByCategoryName/:title` -> `labels_get_by_title`
- `GET /api/auth/google/callback` -> `auth_google_callback` (OAuth callback)
- `GET /api/auth/github/callback` -> `auth_github_callback` (OAuth callback)
- `POST /api/revokeApiKey` -> `apikeys_revoke_legacy`

## 3) Non-MCP/Internal Endpoints (Usually Do Not Expose As MCP Tools)
- `POST /api/stripe/webhook` (provider webhook receiver)

## 4) Suggested MCP Tool Build Order
1. Auth/session + profile tools
2. Notes CRUD + reminders + collaborators
3. Label category tools
4. Billing/subscription tools
5. API key tools
6. Optional backend-only tools

## 5) Naming Pattern Recommendation
Use stable snake_case names with domain prefixes:
- `auth_*`, `user_*`, `notes_*`, `collaborators_*`, `reminders_*`, `labels_*`, `billing_*`, `apikeys_*`, `security_*`, `sandbox_*`, `email_*`








