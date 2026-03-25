"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorSetup = cursorSetup;
exports.vscodeSetup = vscodeSetup;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function cursorSetup() {
    writeConfig('cursor');
}
function vscodeSetup() {
    writeConfig('vscode');
}
function writeConfig(editor) {
    const configDir = path.join(os.homedir(), editor === 'cursor' ? '.cursor' : '.vscode');
    const configPath = path.join(configDir, 'mcp.json');
    let config = {};
    if (fs.existsSync(configPath)) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        catch {
            console.warn('Warning: existing mcp.json was invalid, starting fresh.');
        }
    }
    // VS Code uses "servers", Cursor uses "mcpServers"
    const key = editor === 'vscode' ? 'servers' : 'mcpServers';
    config[key] = config[key] ?? {};
    config[key]['keep'] = {
        command: 'keep',
        args: ['serve'],
    };
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ ${editor === 'vscode' ? 'VS Code' : 'Cursor'} configured!`);
    console.log(`   Config written to: ${configPath}`);
    console.log('');
    console.log('Restart the editor to apply the change.');
}
