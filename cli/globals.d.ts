declare const process: {
  env: Record<string, string | undefined>;
  argv: string[];
  stderr: { write: (message: string) => void };
  exit: (code?: number) => never;
};

declare module 'fs';
declare module 'os';
declare module 'path';
declare module 'child_process';
