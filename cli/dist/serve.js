"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = serve;
var child_process_1 = require("child_process");
var tokenStore_1 = require("./tokenStore");
var REMOTE_MCP_URL = 'http://localhost:8787/mcp';
function serve() {
    var tokens = (0, tokenStore_1.getTokens)();
    if (!tokens) {
        // Write to stderr so Cursor can surface this as an error
        process.stderr.write('keep-mcp: Not logged in. Run "keep login" first.\n');
        process.exit(1);
    }
    var accessToken = tokens.accessToken, refreshToken = tokens.refreshToken;
    // mcp-remote bridges stdio ↔ HTTP for us.
    // We inject our auth headers here — Cursor never sees them directly.
    var child = (0, child_process_1.spawn)('mcp-remote', [
        REMOTE_MCP_URL,
        '--header',
        "Authorization: Bearer ".concat(accessToken),
        '--header',
        "x-refresh-token: ".concat(refreshToken),
    ], {
        stdio: 'inherit', // Cursor's stdin/stdout/stderr pass straight through
    });
    child.on('error', function (err) {
        process.stderr.write("keep-mcp: Failed to start proxy: ".concat(err.message, "\n"));
        process.exit(1);
    });
    child.on('exit', function (code) {
        process.exit(code !== null && code !== void 0 ? code : 0);
    });
}
