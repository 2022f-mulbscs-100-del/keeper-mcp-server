#!/usr/bin/env node

import { login } from './login';
import { serve } from './serve';
import { cursorSetup, vscodeSetup } from './setup';
import { getTokens } from './tokenStore';

const command = process.argv[2];


switch (command) {
  case 'login':
    login();
    break;
  case 'serve':
    serve();
    break;
  case 'cursor-setup':
    cursorSetup();
    break;
  case 'vscode-setup':       // ← new
    vscodeSetup();
    break;
  case 'status':
    const tokens = getTokens();
    console.log(tokens ? '✅ Logged in' : '❌ Not logged in. Run: keep login');
    break;
  default:
    console.log('Usage: keep login | serve | cursor-setup | vscode-setup | status');
}