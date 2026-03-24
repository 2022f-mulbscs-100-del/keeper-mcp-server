import { spawn } from 'child_process';
import { getTokens } from './tokenStore';

const REMOTE_MCP_URL = 'http://localhost:8787/mcp';

export function serve() {
  const tokens = getTokens();

  if (!tokens) {
    // Write to stderr so Cursor can surface this as an error
    process.stderr.write(
      'keep-mcp: Not logged in. Run "keep login" first.\n'
    );
    process.exit(1);
  }

  const { accessToken, refreshToken } = tokens;

  // mcp-remote bridges stdio ↔ HTTP for us.
  // We inject our auth headers here — Cursor never sees them directly.
  const child = spawn(
    'mcp-remote',
    [
      REMOTE_MCP_URL,
      '--header', `Authorization: Bearer ${accessToken}`,
      '--header', `x-refresh-token: ${refreshToken}`,
    ],
    {
      stdio: 'inherit', // Cursor's stdin/stdout/stderr pass straight through
    }
  );

  child.on('error', (err) => {
    process.stderr.write(`keep-mcp: Failed to start proxy: ${err.message}\n`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}