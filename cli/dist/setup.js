"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorSetup = cursorSetup;
exports.vscodeSetup = vscodeSetup;
var fs = require("fs");
var os = require("os");
var path = require("path");
function cursorSetup() {
    writeConfig('cursor');
}
function vscodeSetup() {
    writeConfig('vscode');
}
function writeConfig(editor) {
    var _a;
    var configDir = path.join(os.homedir(), editor === 'cursor' ? '.cursor' : '.vscode');
    var configPath = path.join(configDir, 'mcp.json');
    var config = {};
    if (fs.existsSync(configPath)) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        catch (_b) {
            console.warn('Warning: existing mcp.json was invalid, starting fresh.');
        }
    }
    // VS Code uses "servers", Cursor uses "mcpServers"
    var key = editor === 'vscode' ? 'servers' : 'mcpServers';
    config[key] = (_a = config[key]) !== null && _a !== void 0 ? _a : {};
    config[key]['keep'] = {
        command: 'keep',
        args: ['serve'],
    };
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("\u2705 ".concat(editor === 'vscode' ? 'VS Code' : 'Cursor', " configured!"));
    console.log("   Config written to: ".concat(configPath));
    console.log('');
    console.log('Restart the editor to apply the change.');
}
