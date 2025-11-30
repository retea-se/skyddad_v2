# Verktyg & mall för Chrome DevTools MCP

## Snabbstart

1. Kopiera hela denna mallstruktur till din nya workspace.
2. Kör wrappern:
   - PowerShell: `node Scripts/start-chrome-devtools-mcp.js --headless=true`
   - Bash: `node Scripts/start-chrome-devtools-mcp.js --headless=true`
   - Testa: `node Scripts/start-chrome-devtools-mcp.js --dry-run`
3. Konfigurera `.mcp.json` enligt exempel nedan.

## Vad finns här?

- `Scripts/start-chrome-devtools-mcp.js` — wrapper som skapar unik temp-profil och startar MCP.
- `tools/mcp.json` — exempel på MCP-konfiguration.
- `.gitignore` — ignorerar tempfiler, node_modules, editorfiler.

## Exempel på .mcp.json

```json
{
  "chrome-devtools": {
    "command": "node",
    "args": [
      "Scripts/start-chrome-devtools-mcp.js",
      "--headless=true",
      "--viewport=1920x1080"
    ],
    "env": {}
  }
}
```

## Tips

- Lägg till egna npm-skript i `package.json` för snabbstart:
  ```json
  "scripts": {
    "mcp:chrome:start": "node Scripts/start-chrome-devtools-mcp.js --headless=true --viewport=1920x1080",
    "mcp:chrome:dry": "node Scripts/start-chrome-devtools-mcp.js --dry-run"
  }
  ```
- Pin MCP-versionen i wrappern för stabilitet (ändra version i JS-filen).
- Cleanup sker automatiskt, men om temp-mappar blir kvar: stäng alla Chrome-processer och ta bort manuellt.

## Felsökning

- Kontrollera att Node.js och npx finns i PATH.
- Vid "profile in use"-fel: se till att varje instans får egen temp-profil.
- Vid problem med borttagning av temp-mappar: kontrollera att inga processer använder dem.
