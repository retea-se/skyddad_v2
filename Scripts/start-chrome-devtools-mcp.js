/*
  Wrapper to start chrome-devtools-mcp with a unique temporary Chrome user-data-dir per run.
  Usage:
    node Scripts/start-chrome-devtools-mcp.js [--headless=true] [--viewport=1920x1080] [...other flags]
    node Scripts/start-chrome-devtools-mcp.js --dry-run

  --dry-run: Only create and clean up a temp profile dir, print actions, do not launch npx/chrome.
*/
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function mkTempDir() {
  const prefix = path.join(os.tmpdir(), 'chrome-devtools-mcp-');
  try {
    return fs.mkdtempSync(prefix);
  } catch (err) {
    console.error('Failed to create temporary directory:', err);
    process.exit(1);
  }
}

function cleanupDir(dir) {
  if (!dir || !fs.existsSync(dir)) return;
  const delays = [200, 500, 1000, 2000, 3000, 5000];
  for (let i = 0; i < delays.length; i++) {
    try {
      if (fs.rmSync) {
        fs.rmSync(dir, { recursive: true, force: true });
      } else {
        fs.rmdirSync(dir, { recursive: true });
      }
      console.log('Removed temp profile directory:', dir);
      return;
    } catch (err) {
      if (i === delays.length - 1) {
        console.warn('Failed to remove temp profile directory after retries:', dir, err.message || err);
      } else {
        console.log(`Cleanup attempt ${i + 1} failed, retrying in ${delays[i]}ms...`);
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delays[i]);
      }
    }
  }
}

function spawnMCP(userDataDir, extraArgs) {
  const cmd = 'npx';
  // Pin version for reproducibility, change as needed
  const args = ['chrome-devtools-mcp@0.9.0', '--user-data-dir', userDataDir].concat(extraArgs || []);
  console.log('Spawning:', cmd, args.join(' '));

  const child = spawn(cmd, args, { stdio: 'inherit' });

  child.on('exit', (code, signal) => {
    console.log(`Child process exited with code=${code} signal=${signal}`);
    try { cleanupDir(userDataDir); } catch (err) { console.warn('Cleanup error:', err && err.message ? err.message : err); }
    if (typeof code === 'number') process.exit(code);
    if (signal) process.exit(1);
    process.exit(0);
  });

  const forwardSignal = (sig) => {
    if (!child.killed) {
      try { console.log('Forwarding signal', sig, 'to child PID', child.pid); child.kill(sig); } catch (e) {}
    }
    setTimeout(() => { if (!child.killed) { try { child.kill('SIGKILL'); } catch (e) {} } }, 3000).unref();
  };
  process.on('SIGINT', () => forwardSignal('SIGINT'));
  process.on('SIGTERM', () => forwardSignal('SIGTERM'));
  process.on('SIGHUP', () => forwardSignal('SIGHUP'));
  process.on('exit', () => { try { if (fs.existsSync(userDataDir)) { cleanupDir(userDataDir); } } catch (e) {} });
  return child;
}

function main() {
  const extraArgs = process.argv.slice(2);
  const dryRun = extraArgs.includes('--dry-run');
  const filteredArgs = extraArgs.filter(arg => arg !== '--dry-run');
  const userDataDir = mkTempDir();
  console.log('Created temporary Chrome user-data-dir:', userDataDir);
  if (dryRun) {
    console.log('[DRY RUN] Would launch chrome-devtools-mcp with --user-data-dir', userDataDir, 'and args:', filteredArgs);
    cleanupDir(userDataDir);
    process.exit(0);
  }
  spawnMCP(userDataDir, filteredArgs);
}

main();
