#!/usr/bin/env node
/*
  ai-commit.js
  ----------------------------------------------------
  Generates commit messages using AI CLI context.
  Reads git diff, builds prompt, and logs it to session_history.
  Also triggers log-session.js for persistent history.
  ----------------------------------------------------
*/
const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧩 Generating AI commit message...");

try {
  const diff = execSync("git diff --staged", { encoding: "utf8" });
  if (!diff.trim()) {
    console.error("No staged changes found.");
    process.exit(1);
  }

  const prompt = `Generate a clear Conventional Commit message based on this diff:
  ${diff}
  Follow rules in instructions/git-commit-policy.md`;

  // Ensure session_history exists
  const logDir = path.join(process.cwd(), "session_history");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  // Save latest prompt (overwrite)
  fs.writeFileSync(path.join(logDir, "last_prompt.txt"), prompt, "utf8");

  // Also append an entry in chronological history
  const historyFile = path.join(logDir, "commit-history.log");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(
    historyFile,
    `[${timestamp}] Commit prompt generated\n`,
    "utf8"
  );

  // Call log-session.js for separate timestamped log file
  const logMessage = `Commit prompt captured at ${timestamp}\n---\n${prompt}`;
  spawnSync("node", ["tools/log-session.js", logMessage], { stdio: "inherit" });

  console.log("✅ Diff captured for AI CLI. Run your preferred AI tool (e.g. claude code commit).");
} catch (err) {
  console.error("❌ Error:", err.message);
}
