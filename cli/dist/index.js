#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("./login");
var serve_1 = require("./serve");
var setup_1 = require("./setup");
var tokenStore_1 = require("./tokenStore");
var command = process.argv[2];
switch (command) {
    case 'login':
        (0, login_1.login)();
        break;
    case 'serve':
        (0, serve_1.serve)();
        break;
    case 'cursor-setup':
        (0, setup_1.cursorSetup)();
        break;
    case 'vscode-setup': // ← new
        (0, setup_1.vscodeSetup)();
        break;
    case 'status':
        var tokens = (0, tokenStore_1.getTokens)();
        console.log(tokens ? '✅ Logged in' : '❌ Not logged in. Run: keep login');
        break;
    default:
        console.log('Usage: keep login | serve | cursor-setup | vscode-setup | status');
}
