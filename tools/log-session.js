#!/usr/bin/env node
/*
  log-session.js
  ----------------------------------------------------
  Universal session logger for AI-CLI environments.
  Saves logs in /session_history with timestamped filenames.
  Usage examples:
    node tools/log-session.js "Message text"
    echo "Something happened" | node tools/log-session.js
  ----------------------------------------------------
*/

const fs = require("fs");
const path = require("path");

// Path to the session_history folder
const logDir = path.join(process.cwd(), "session_history");

// Ensure folder exists
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    console.error(`Created directory: ${logDir}`);
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    process.exit(1);
  }
}

// Prepare timestamp and filename
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const filename = `log-${timestamp}.txt`;
const filePath = path.join(logDir, filename);

// Gather message (from args or stdin)
const argsMessage = process.argv.slice(2).join(" ").trim();
let inputData = "";

if (argsMessage) {
  // Log from arguments
  try {
    const logContent = `[${new Date().toISOString()}] ${argsMessage}\n`;
    fs.writeFileSync(filePath, logContent, "utf8");
    // Write to both stderr and stdout for visibility
    const message = `🧾 Log saved: ${filePath}\n`;
    console.error(message);
    console.log(message);
    // Verify file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ File verified: ${stats.size} bytes`);
    }
    // Exit successfully
    process.exit(0);
  } catch (err) {
    const errorMsg = `❌ Error writing log file: ${err.message}\n`;
    process.stderr.write(errorMsg);
    process.stdout.write(errorMsg);
    process.exit(1);
  }
} else {
  // Log from piped input
  process.stdin.on("data", chunk => (inputData += chunk));
  process.stdin.on("end", () => {
    try {
      const content = inputData.trim() || "(no input)";
      const logContent = `[${new Date().toISOString()}] ${content}\n`;
      fs.writeFileSync(filePath, logContent, "utf8");
      process.stderr.write(`🧾 Log saved: ${filePath}\n`);
      process.stdout.write(`${filePath}\n`);
    } catch (err) {
      process.stderr.write(`❌ Error writing log file: ${err.message}\n`);
      process.exit(1);
    }
  });

  // Handle case where stdin is closed immediately
  if (process.stdin.isTTY) {
    process.stdin.end();
  }
}
