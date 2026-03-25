"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = serve;
const child_process_1 = require("child_process");
const tokenStore_1 = require("./tokenStore");
const REMOTE_MCP_URL = process.env.KEEP_MCP_SERVER_URL ??
    'https://keep-mcp-server.2022f-mulbscs-100.workers.dev/mcp';
function serve() {
    const tokens = (0, tokenStore_1.getTokens)();
    if (!tokens) {
        // Write to stderr so Cursor can surface this as an error
        process.stderr.write('keep-mcp: Not logged in. Run "keep login" first.\n');
        process.exit(1);
    }
    const { accessToken, refreshToken } = tokens;
    // mcp-remote bridges stdio ↔ HTTP for us.
    // We inject our auth headers here — Cursor never sees them directly.
    const child = (0, child_process_1.spawn)('mcp-remote', [
        REMOTE_MCP_URL,
        '--header', `Authorization: Bearer ${accessToken}`,
        '--header', `x-refresh-token: ${refreshToken}`,
    ], {
        stdio: 'inherit', // Cursor's stdin/stdout/stderr pass straight through
    });
    child.on('error', (err) => {
        process.stderr.write(`keep-mcp: Failed to start proxy: ${err.message}\n`);
        process.exit(1);
    });
    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
}
