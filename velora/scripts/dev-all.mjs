import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env };

const api = spawn(process.execPath, ['server/index.js'], { cwd, env, stdio: 'inherit' });
const web = spawn('npx', ['vite', '--port', '5178'], { cwd, env, stdio: 'inherit', shell: true });

const stop = () => {
  api.kill();
  web.kill();
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
