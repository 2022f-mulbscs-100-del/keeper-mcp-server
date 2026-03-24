import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type Editor = 'cursor' | 'vscode';

export function cursorSetup() {
  writeConfig('cursor');
}

export function vscodeSetup() {
  writeConfig('vscode');
}

function writeConfig(editor: Editor) {
  const configDir = path.join(
    os.homedir(),
    editor === 'cursor' ? '.cursor' : '.vscode'
  );
  const configPath = path.join(configDir, 'mcp.json');

  let config: any = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
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