#!/usr/bin/env node
/*
  Wrapper to start chrome-devtools-mcp with a unique temporary Chrome user-data-dir per run.
  Writes temp dir under OS temp with prefix 'chrome-devtools-mcp-'.
  Forwards all CLI args to the underlying package and adds --user-data-dir <tmpdir>.
  Performs cleanup with retries/backoff to handle Windows file locks.

  Usage:
    node start-chrome-devtools-mcp.js [--headless=true] [--viewport=1920x1080] [...other flags]

  This file is intended for inclusion in workspace templates so consumers can copy it into their repo.
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

async function cleanupDir(dir) {
  if (!dir || !fs.existsSync(dir)) return;
  const maxAttempts = 6;
  let attempt = 0;
  const delays = [200, 500, 1000, 2000, 3000, 5000];

  while (attempt < maxAttempts) {
    try {
      // Node 14+ has fs.rmSync with force; prefer it, fallback to rmdirSync
      if (fs.rmSync) {
        fs.rmSync(dir, { recursive: true, force: true });
      } else {
        // older fallback
        fs.rmdirSync(dir, { recursive: true });
      }
      console.log('Removed temp profile directory:', dir);
      return;
    } catch (err) {
      attempt++;
      if (attempt === maxAttempts) {
        console.warn('Failed to remove temp profile directory after retries:', dir, err.message || err);
      } else {
        const wait = delays[Math.min(attempt - 1, delays.length - 1)];
        console.log(`Cleanup attempt ${attempt} failed, retrying in ${wait}ms...`);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
  }
}

function spawnMCP(userDataDir, extraArgs) {
  const cmd = 'npx';
  const args = ['chrome-devtools-mcp@latest', '--user-data-dir', userDataDir].concat(extraArgs || []);
  console.log('Spawning:', cmd, args.join(' '));

  const child = spawn(cmd, args, { stdio: 'inherit' });

  let shuttingDown = false;

  function killChild() {
    if (child && !child.killed) {
      try {
        // Try a graceful kill first
        child.kill('SIGINT');
        // Fallback to force after short timeout
        setTimeout(() => {
          if (!child.killed) {
            try {
              child.kill('SIGKILL');
            } catch (e) {
              // ignore
            }
          }
        }, 2000).unref();
      } catch (e) {
        try {
          child.kill();
        } catch (e) {
          // ignore
        }
      }
    }
  }

  function handleExit(code, signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    // Wait for child to exit then cleanup
    const finish = async () => {
      try {
        await cleanupDir(userDataDir);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
      if (signal) process.exit(1);
      process.exit(code || 0);
    };
    finish();
  }

  child.on('exit', (code, signal) => {
    console.log(`Child process exited with code=${code} signal=${signal}`);
    handleExit(code, signal);
  });

  child.on('error', (err) => {
    console.error('Failed to spawn npx chrome-devtools-mcp:', err);
    handleExit(1, 'error');
  });

  // Forward termination signals to child and attempt graceful shutdown.
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
    process.on(sig, () => {
      console.log(`Received ${sig}, shutting down child and cleaning up`);
      killChild();
      // cleanup will be done in exit handler
    });
  });

  // Best-effort sync cleanup on exit (if child already exited/cleanup didn't run)
  process.on('exit', () => {
    if (!shuttingDown) {
      try {
        if (fs.existsSync(userDataDir)) {
          cleanupDir(userDataDir).catch(() => {
            // ignore async errors on sync exit
          });
        }
      } catch (e) {
        // ignore
      }
    }
  });

  return child;
}

// Entry point
function main() {
  // Check for dry-run flag
  if (process.argv.includes('--dry-run')) {
    console.log('Dry-run mode: Would start chrome-devtools-mcp with isolated profile');
    console.log('Arguments:', process.argv.slice(2).filter(arg => arg !== '--dry-run').join(' '));
    process.exit(0);
  }

  const extraArgs = process.argv.slice(2);
  const userDataDir = mkTempDir();
  console.log('Created temporary Chrome user-data-dir:', userDataDir);
  spawnMCP(userDataDir, extraArgs);
}

main();
