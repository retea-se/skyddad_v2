# Chrome DevTools MCP Setup - Skyddad v2

Dokumentation för Chrome DevTools MCP integration i Skyddad v2-projektet.

## Översikt

Chrome DevTools MCP används för att testa och debugga webbapplikationen via isolerade Chrome-profiler.

## Installation

Chrome DevTools MCP är redan konfigurerat i projektet:

- **Wrapper script**: `tools/start-chrome-devtools-mcp.js`
- **MCP config**: `tools/mcp.json`
- **Dependencies**: `chrome-devtools-mcp` i `package.json`

## Användning

### Starta Chrome DevTools MCP

```bash
# Via npm script
npm run mcp:chrome:start

# Eller direkt
node tools/start-chrome-devtools-mcp.js --headless=true --viewport=1920x1080
```

### Dry-run (testa utan att starta)

```bash
npm run mcp:chrome:dry
```

## Konfiguration

### Isolerade Profiler

Varje instans skapar en unik temporär Chrome-profil i systemets temp-mapp för att undvika "profile in use"-fel vid parallella körningar.

**Profil-mapp**: `%TEMP%\chrome-devtools-mcp-<unique-id>` (Windows)

### MCP Config (`tools/mcp.json`)

```json
{
  "chrome-devtools": {
    "command": "node",
    "args": ["tools/start-chrome-devtools-mcp.js", "--headless=true", "--viewport=1920x1080"],
    "env": {}
  }
}
```

## Testa Lokalt

1. Starta development server:
   ```bash
   npm run dev
   ```

2. Starta Chrome DevTools MCP:
   ```bash
   npm run mcp:chrome:start
   ```

3. Testa mot localhost:3000

## Cleanup

Wrappern försöker automatiskt rensa temporära profiler när processen avslutas. Om cleanup misslyckas kan manuell rensning behövas:

```powershell
# Windows
Get-ChildItem $env:TEMP -Directory | Where-Object Name -Like 'chrome-devtools-mcp-*' | Remove-Item -Recurse -Force
```

## Felsökning

### Problem: "Profile in use"
**Lösning**: Wrappern skapar unika profiler automatiskt. Om problemet kvarstår, kontrollera att inga Chrome-processer fortfarande körs.

### Problem: MCP startar inte
**Lösning**:
- Kontrollera att Node.js är installerat
- Verifiera att `chrome-devtools-mcp` är installerat: `npm list chrome-devtools-mcp`
- Kolla att porten inte är upptagen

### Problem: Cleanup misslyckas
**Lösning**:
- Vänta några sekunder och försök igen
- Stäng alla Chrome-processer manuellt
- Rensa temp-mappen manuellt (se ovan)

## Integration med Cursor

Chrome DevTools MCP är konfigurerad för användning med Cursor IDE via MCP-integrationen.

## Uppdateringshistorik

| Datum | Ändring | Användare |
|-------|---------|-----------|
| 2025-01-XX | Chrome DevTools MCP setup dokumenterad | AI-assistent |

