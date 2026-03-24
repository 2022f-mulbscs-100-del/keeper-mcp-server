"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTokens = saveTokens;
exports.getTokens = getTokens;
exports.clearTokens = clearTokens;
var fs = require("fs");
var os = require("os");
var path = require("path");
// Store in home dir, not cwd, so it persists across projects
var TOKEN_FILE = path.join(os.homedir(), '.keep-mcp-tokens.json');
function saveTokens(accessToken, refreshToken) {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }, null, 2), { mode: 384 } // owner read/write only — keeps tokens private
    );
}
function getTokens() {
    if (!fs.existsSync(TOKEN_FILE))
        return null;
    try {
        return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    }
    catch (_a) {
        return null;
    }
}
function clearTokens() {
    if (fs.existsSync(TOKEN_FILE)) {
        fs.unlinkSync(TOKEN_FILE);
    }
}
