# Routing-konfiguration för Skyddad v2

## 📍 Översikt

Skyddad v2 är en Node.js-app som körs via Passenger på omega.hostup.se. Appen är integrerad i retea.se-strukturen och ligger under `/retea/skyddad/` (inte i root).

## 🗂️ Fysisk och webbmässig struktur

### Fysisk struktur på servern

```
/home/mackaneu/
├── skyddad-v2-app/              # App-katalog (utanför public_html)
│   ├── dist/
│   │   └── server.js            # Kompilerad Node.js-app
│   ├── .env.production           # Production environment variables
│   ├── package.json
│   └── ...
└── public_html/
    └── retea/
        ├── .htaccess            # Root .htaccess (retea-projektet)
        └── skyddad/
            └── .htaccess        # Passenger-konfiguration för Skyddad
```

### Webbmässig struktur

- **URL:** `https://retea.se/skyddad/`
- **Webb-sökväg:** `~/public_html/retea/skyddad/`
- **App-root:** `/home/mackaneu/skyddad-v2-app/`
- **Server:** `omega.hostup.se`
- **Användare:** `mackaneu`

## 🔄 Routing-flöde

När en användare besöker `https://retea.se/skyddad/`:

1. **Request kommer in:** `retea.se/skyddad/`
2. **Root .htaccess kontrollerar:** Är `/skyddad/` ett undantag? (JA - ska inte mappas till `/retea/`)
3. **Request dirigeras till:** `/retea/skyddad/`
4. **Passenger tar över:** `.htaccess` i `/retea/skyddad/` aktiverar Passenger
5. **Passenger startar appen:** Från `/home/mackaneu/skyddad-v2-app/dist/server.js`
6. **Express hanterar routing:** Appen hanterar alla routes under `/skyddad/`

```
retea.se/skyddad/
    ↓
Root .htaccess (retea-projektet)
    ↓ (om /skyddad/ är undantagen)
/retea/skyddad/
    ↓
/retea/skyddad/.htaccess (Passenger)
    ↓
Passenger → /home/mackaneu/skyddad-v2-app/dist/server.js
    ↓
Express app (hanterar alla routes)
```

## ⚠️ KRITISKT: Koordination med retea-projektet

**VIKTIGT:** Skyddad ligger i `/retea/skyddad/` (inte i root), vilket betyder att root `.htaccess` i retea-projektet (`~/public_html/.htaccess`) **MÅSTE** ha `/skyddad/` som **UNDANTAG** i STEG 7 (retea.se → /retea/ mapping), precis som `/pollify/` är undantagen.

### Root .htaccess-konfiguration (retea-projektet)

Root `.htaccess` i `~/public_html/.htaccess` måste innehålla:

```apache
# STEG 7: Mappa retea.se → /retea/
# UNDANTAG: /pollify/ och /skyddad/ ska INTE mappas

RewriteCond %{REQUEST_URI} !^/pollify/
RewriteCond %{REQUEST_URI} !^/skyddad/    # ← KRITISKT: Lägg till detta!
RewriteRule ^(.*)$ /retea/$1 [L]
```

**Ordningen är kritisk!** Undantagen måste komma **FÖRE** rewrite-regeln.

### Varför detta är viktigt

Om `/skyddad/` **INTE** är undantagen i root `.htaccess`:
- Request till `retea.se/skyddad/` mappas till `/retea/retea/skyddad/` (fel sökväg)
- Eller request hamnar på fel plats (t.ex. alumni-projektet)
- Passenger kan inte hitta appen
- Resultat: 404 eller 502 Bad Gateway

## 📝 .htaccess-konfiguration för Skyddad

### Fil: `~/public_html/retea/skyddad/.htaccess`

Denna fil hanterar Passenger-konfigurationen för Skyddad-appen:

```apache
# Passenger configuration for Skyddad v2
PassengerEnabled On
PassengerAppRoot /home/mackaneu/skyddad-v2-app
PassengerAppType node
PassengerStartupFile dist/server.js
PassengerNodejs /home/mackaneu/.nvm/versions/node/v18.x.x/bin/node

# Security headers (if not already in root .htaccess)
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory listing
Options -Indexes
```

### Konfigurationsparametrar

| Parameter | Värde | Beskrivning |
|-----------|-------|-------------|
| `PassengerEnabled` | `On` | Aktiverar Passenger för denna katalog |
| `PassengerAppRoot` | `/home/mackaneu/skyddad-v2-app` | Absolut sökväg till app-root |
| `PassengerAppType` | `node` | Anger att det är en Node.js-app |
| `PassengerStartupFile` | `dist/server.js` | Startfil för appen |
| `PassengerNodejs` | `/home/mackaneu/.nvm/versions/node/v18.x.x/bin/node` | Sökväg till Node.js (uppdatera vid behov) |

**Viktigt:** `PassengerNodejs` måste peka på korrekt Node.js-sökväg. Kontrollera med:
```bash
which node
# eller om du använder nvm:
source ~/.nvm/nvm.sh
which node
```

## 🔧 Deployment-struktur (som pollify)

Skyddad använder samma deployment-struktur som pollify:

- **App utanför public_html:** Appen ligger i `~/skyddad-v2-app/` (inte i `public_html`)
- **Passenger via .htaccess:** Passenger konfigureras via `.htaccess` i `~/public_html/retea/skyddad/`
- **Symlink (valfritt):** Om appen har en `public/`-katalog kan en symlink skapas, men det är inte nödvändigt eftersom Passenger hanterar routing

## 🔍 Verifiering av routing-konfiguration

### 1. Kontrollera root .htaccess (retea-projektet)

```bash
ssh mackaneu@omega.hostup.se
cat ~/public_html/.htaccess | grep -A 5 "STEG 7\|retea.se"
```

**Förväntat resultat:**
```apache
RewriteCond %{REQUEST_URI} !^/pollify/
RewriteCond %{REQUEST_URI} !^/skyddad/
RewriteRule ^(.*)$ /retea/$1 [L]
```

### 2. Kontrollera Skyddad .htaccess

```bash
cat ~/public_html/retea/skyddad/.htaccess
```

**Förväntat resultat:** Se konfigurationen ovan.

### 3. Testa routing

```bash
# Testa healthcheck
curl https://retea.se/skyddad/healthz

# Förväntat svar:
# {"status":"ok","database":"connected","timestamp":"..."}
```

### 4. Kontrollera Passenger status

```bash
passenger-status
```

## 🐛 Troubleshooting

### Problem: retea.se/skyddad/ hamnar på alumni eller annat projekt

**Symptom:**
- `https://retea.se/skyddad/` visar fel innehåll (t.ex. alumni-projektet)
- 404 på alla routes under `/skyddad/`

**Orsak:**
- `/skyddad/` är **INTE** undantagen i root `.htaccess` i retea-projektet
- Request mappas fel (t.ex. till `/retea/retea/skyddad/`)

**Lösning:**
1. SSH till servern: `ssh mackaneu@omega.hostup.se`
2. Kontrollera root `.htaccess`: `cat ~/public_html/.htaccess`
3. Lägg till `/skyddad/` som undantag **FÖRE** rewrite-regeln:
   ```apache
   RewriteCond %{REQUEST_URI} !^/pollify/
   RewriteCond %{REQUEST_URI} !^/skyddad/    # ← Lägg till detta
   RewriteRule ^(.*)$ /retea/$1 [L]
   ```
4. Testa igen: `curl https://retea.se/skyddad/healthz`

### Problem: /skyddad/ ger 404

**Symptom:**
- `https://retea.se/skyddad/` ger 404 Not Found
- Healthcheck svarar inte

**Möjliga orsaker:**
1. Passenger-konfigurationen saknas eller är felaktig
2. `dist/server.js` finns inte
3. Node.js-sökväg är felaktig

**Lösning:**
1. Kontrollera att `.htaccess` finns:
   ```bash
   ls -la ~/public_html/retea/skyddad/.htaccess
   ```
2. Kontrollera Passenger-konfiguration:
   ```bash
   cat ~/public_html/retea/skyddad/.htaccess
   ```
3. Kontrollera att appen är byggd:
   ```bash
   ls -la ~/skyddad-v2-app/dist/server.js
   ```
4. Kontrollera Node.js-sökväg:
   ```bash
   which node
   # Uppdatera PassengerNodejs i .htaccess om nödvändigt
   ```
5. Kontrollera Passenger logs:
   ```bash
   tail -f ~/logs/passenger.log
   ```

### Problem: /skyddad/ mappas fel (t.ex. till /retea/retea/skyddad/)

**Symptom:**
- Request till `retea.se/skyddad/` mappas till fel sökväg
- 404 eller fel routing

**Orsak:**
- Root `.htaccess` mappar `/skyddad/` trots att det ska vara undantagen
- Ordningen på rewrite-regler är fel

**Lösning:**
1. Kontrollera root `.htaccess`:
   ```bash
   cat ~/public_html/.htaccess
   ```
2. Se till att undantagen kommer **FÖRE** rewrite-regeln:
   ```apache
   # RÄTT ordning:
   RewriteCond %{REQUEST_URI} !^/pollify/
   RewriteCond %{REQUEST_URI} !^/skyddad/
   RewriteRule ^(.*)$ /retea/$1 [L]

   # FEL ordning (kommer inte fungera):
   RewriteRule ^(.*)$ /retea/$1 [L]
   RewriteCond %{REQUEST_URI} !^/skyddad/  # ← För sent!
   ```

### Problem: 502 Bad Gateway

**Symptom:**
- `https://retea.se/skyddad/` ger 502 Bad Gateway
- Passenger kan inte starta appen

**Möjliga orsaker:**
1. Node.js-sökväg är felaktig
2. `dist/server.js` finns inte eller är korrupt
3. `.env.production` saknas eller är felaktig
4. Appen kraschar vid start

**Lösning:**
1. Kontrollera Node.js-sökväg:
   ```bash
   which node
   # Uppdatera PassengerNodejs i .htaccess
   ```
2. Testa appen manuellt:
   ```bash
   cd ~/skyddad-v2-app
   node dist/server.js
   ```
3. Kontrollera `.env.production`:
   ```bash
   ls -la ~/skyddad-v2-app/.env.production
   ```
4. Kontrollera Passenger logs:
   ```bash
   tail -f ~/logs/passenger.log
   # eller
   passenger-status
   ```

## 📋 Checklista för deployment

När du deployar eller uppdaterar Skyddad, kontrollera:

- [ ] Root `.htaccess` i retea-projektet har `/skyddad/` som undantag
- [ ] Undantagen kommer **FÖRE** rewrite-regeln i root `.htaccess`
- [ ] `/retea/skyddad/.htaccess` finns och är korrekt konfigurerad
- [ ] `PassengerAppRoot` pekar på `/home/mackaneu/skyddad-v2-app`
- [ ] `PassengerNodejs` pekar på korrekt Node.js-sökväg
- [ ] `dist/server.js` finns och är uppdaterad
- [ ] `.env.production` finns och är korrekt konfigurerad
- [ ] Healthcheck svarar: `curl https://retea.se/skyddad/healthz`

## 🔗 Relaterade dokument

- `docs/DEPLOYMENT_OMEGA.md` - Fullständig deployment-guide
- `docs/DEPLOYMENT_NEXT_STEPS.md` - Nästa steg efter deployment
- `.htaccess.example` - Exempel på Passenger-konfiguration
- `Scripts/setup-passenger.sh` - Script för att sätta upp Passenger

## 📝 Noteringar

- Skyddad använder samma deployment-mönster som pollify
- Root `.htaccess` i retea-projektet måste uppdateras manuellt (ligger utanför detta repo)
- Om du ändrar Node.js-version, uppdatera `PassengerNodejs` i `.htaccess`
- Om du flyttar app-katalogen, uppdatera `PassengerAppRoot` i `.htaccess`

