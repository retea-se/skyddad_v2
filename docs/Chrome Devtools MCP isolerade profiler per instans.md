# Chrome DevTools MCP — isolerade profiler per instans

## Syfte

Kör flera parallella instanser av Chrome DevTools MCP utan att de delar samma Chrome-profil (undvik "profile in use"-fel). Vi uppnår detta genom att skapa en unik temporär Chrome `user-data-dir` per start.

## Vad som finns i mallen

- `tools/start-chrome-devtools-mcp.js` — wrapper som skapar en unik temporär profil och startar `npx chrome-devtools-mcp` med `--user-data-dir`.
- `.mcp.json` — innehåller en `chrome-devtools`-entry som kör wrappern via `node`.
- `docs/CHROME_DEVTOOLS_MCP_PROFILE.md` — mer detaljerad dokumentation (kan kopieras in i repo).

## Snabbstart — hur man använder

1. Se till att Node.js (`node` och `npx`) finns i `PATH`.
2. Starta MCP via wrappern (PowerShell-exempel):

```powershell
# Starta i bakgrunden och få PID
$p = Start-Process -FilePath node -ArgumentList 'tools/start-chrome-devtools-mcp.js','--headless=true','--viewport=1920x1080' -PassThru
$p.Id
```

3. Kontrollera att en temporär profil skapats:

```powershell
Get-ChildItem $env:TEMP -Directory | Where-Object Name -Like 'chrome-devtools-mcp-*' | Select-Object Name,FullName
```

4. Stoppa instansen (wrappern försöker då rensa profilen):

```powershell
Stop-Process -Id <PID> -Force
```

5. Verifiera att profilen raderats (cleanup):

```powershell
Get-ChildItem $env:TEMP -Directory | Where-Object Name -Like 'chrome-devtools-mcp-*' | Select-Object Name,FullName
# Förväntat: inga nyligen skapade mappar kvar
```

## Konfigurationsexempel (`.mcp.json`)

```json
"chrome-devtools": {
	"command": "node",
	"args": ["tools/start-chrome-devtools-mcp.js", "--headless=true", "--viewport=1920x1080"],
	"env": {}
}
```

## Alternativ: skript att lägga i repo (om du inte vill köra PS direkt)

Följande exempel kan läggas i `scripts/` i din workspace — välj det format som passar (PowerShell, Bash, CMD eller npm script).

### 1) PowerShell script: `scripts/start-chrome-devtools-mcp.ps1`

```powershell
Param(
	[string]$Headless = 'true',
	[string]$Viewport = '1920x1080'
)

Write-Output "Starting chrome-devtools-mcp (headless=$Headless, viewport=$Viewport)"
Start-Process -FilePath node -ArgumentList "tools/start-chrome-devtools-mcp.js","--headless=$Headless","--viewport=$Viewport" -PassThru
```

### 2) POSIX / Bash script: `scripts/start-chrome-devtools-mcp.sh`

```bash
#!/usr/bin/env bash
HEADLESS=${1:-true}
VIEWPORT=${2:-1920x1080}

echo "Starting chrome-devtools-mcp (headless=${HEADLESS}, viewport=${VIEWPORT})"
node tools/start-chrome-devtools-mcp.js --headless=${HEADLESS} --viewport=${VIEWPORT} &
echo "PID: $!"
```

Gör filen körbar:

```bash
chmod +x scripts/start-chrome-devtools-mcp.sh
```

### 3) Windows CMD (batch) `scripts\\start-chrome-devtools-mcp.cmd`

```bat
@echo off
set HEADLESS=true
set VIEWPORT=1920x1080

echo Starting chrome-devtools-mcp (headless=%HEADLESS%, viewport=%VIEWPORT%)
start "chrome-devtools-mcp" node tools\\start-chrome-devtools-mcp.js --headless=%HEADLESS% --viewport=%VIEWPORT%
```

### 4) `package.json`-scripts (rekommenderat för enkel körning via npm/yarn)

```json
"scripts": {
	"mcp:chrome:start": "node tools/start-chrome-devtools-mcp.js --headless=true --viewport=1920x1080",
	"mcp:chrome:start:detached": "node tools/start-chrome-devtools-mcp.js --headless=true --viewport=1920x1080 &"
}
```

## Tekniska detaljer & beteende

- Wrappern skapar en unik katalog i operativsystemets temp (t.ex. `%TEMP%\\chrome-devtools-mcp-xxxx` på Windows).
- Den kör `npx chrome-devtools-mcp@latest --user-data-dir <unik_katalog> ...` och vidarebefordrar övriga argument.
- När processen avslutas försöker wrappern ta bort katalogen med retries/backoff för att hantera låsta filer på Windows.
- Signaler (Ctrl+C, SIGTERM) fångas upp för att stoppa barnprocessen och försöka rensa katalogen.

## Tips och valfria förbättringar

- Lås version: ändra `chrome-devtools-mcp@latest` i wrappern till t.ex. `chrome-devtools-mcp@0.9.0` om ni vill ha en stabil version.
- Om cleanup ibland misslyckas pga. lås:
  - Låt wrappern vänta tills underliggande Chrome-processer släpper filerna (kan implementeras).
  - Kör en periodisk rensning av äldre `chrome-devtools-mcp-*`-mappar i `%TEMP%`.
- Lägg till en `--dry-run`-flag i wrappern för att testa beteendet utan att faktiskt köra `npx`.

## Checklist före commit i ny workspace

1. Kopiera `tools/start-chrome-devtools-mcp.js` till repot.
2. Lägg till `chrome-devtools`-entryn i `.mcp.json` (se exempel ovan).
3. Testa start + stop och verifiera att temp-profil skapas och raderas.
4. (Valfritt) Lås `chrome-devtools-mcp`-version om stabilitet krävs.

## Felsökning

- Om inget händer: kontrollera att `node` och `npx` är installerade och i `PATH`.
- Om `npx` hämtar paket första gången: första start kan ta längre tid.
- Om profil-rensning aldrig lyckas: inspektera processlistan (Task Manager / `Get-Process`) för att se om Chrome-processer fortfarande körs och håller filer öppna.

---

Spara denna fil i ditt mallbibliotek så kan du snabbt återanvända den i nya workspaces.
