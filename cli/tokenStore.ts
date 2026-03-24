import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Store in home dir, not cwd, so it persists across projects
const TOKEN_FILE = path.join(os.homedir(), '.keep-mcp-tokens.json');

export function saveTokens(accessToken: string, refreshToken: string) {
  fs.writeFileSync(
    TOKEN_FILE,
    JSON.stringify({ accessToken, refreshToken }, null, 2),
    { mode: 0o600 } // owner read/write only — keeps tokens private
  );
}

export function getTokens(): { accessToken: string; refreshToken: string } | null {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  } catch {
    return null;
  }
}

export function clearTokens() {
  if (fs.existsSync(TOKEN_FILE)) {
    fs.unlinkSync(TOKEN_FILE);
  }
}