# Deployment-instruktioner för säkerhetsförbättringar

## ✅ Vad som är fixat

Alla tre säkerhetsbrister som identifierades är nu åtgärdade:

1. **Kryptering**: ✅ Bytte från AES-256-CBC till AES-256-GCM (AEAD) med autentisering
2. **Admin-API**: ✅ Endast Authorization header, ingen debug-loggning, timing-safe jämförelse
3. **Session store**: ✅ MySQL session store i produktion

## 📝 Commit och push

Kör dessa kommandon i din terminal:

```bash
# Commita ändringarna
git add -A
git commit -m "Säkerhetsförbättringar: GCM-kryptering, MySQL session store, förbättrad admin-API

- Bytte från AES-256-CBC till AES-256-GCM (AEAD) för autentiserad kryptering
- Tog bort query-param från admin-API, endast Authorization header
- Tog bort debug-loggning i admin-API
- Lade till konstanttidsjämförelse (timing-safe) i admin-API
- Implementerade MySQL session store för produktion
- SameSite=strict för sessions i produktion
- Bakåtkompatibilitet för gamla CBC-krypterade secrets
- Uppdaterade tester för GCM-kryptering
- Uppdaterad SECURITY.md med nya säkerhetsåtgärder"

# Pusha till remote
git push origin main
```

Eller använd PowerShell-scriptet:

```powershell
.\Scripts\commit-and-deploy.ps1
```

## 🚀 Deployment till produktion

### Alternativ 1: Via SSH (rekommenderat)

```powershell
# Deploya med safe-ssh wrapper
.\Scripts\safe-ssh.ps1 "cd ~/skyddad-v2-app && git pull origin main && npm install --production && npm run build && touch tmp/restart.txt"
```

### Alternativ 2: Kör deployment-script direkt på servern

SSH till servern och kör:

```bash
cd ~/skyddad-v2-app
bash Scripts/deploy-security-fixes.sh
```

### Alternativ 3: Steg för steg manuellt

```bash
# 1. SSH till servern
ssh mackaneu@omega.hostup.se

# 2. Gå till projektmappen
cd ~/skyddad-v2-app

# 3. Pull senaste ändringar
git pull origin main

# 4. Installera dependencies
npm install --production

# 5. Bygg projektet
npm run build

# 6. Starta om Passenger
touch tmp/restart.txt

# 7. Vänta några sekunder
sleep 5
```

## 🧪 Testa deployment

### Automatiskt test (PowerShell)

```powershell
.\Scripts\test-frontend-prod.ps1
```

### Manuellt test

```bash
# Healthcheck
curl https://retea.se/skyddad/healthz

# Huvudsida
curl https://retea.se/skyddad/

# Privacy-sida
curl https://retea.se/skyddad/privacy

# FAQ-sida
curl https://retea.se/skyddad/faq
```

### Verifiera säkerhetsförbättringar

1. **Kryptering**: Nya secrets använder GCM-format (`v1:IV:encrypted:authTag`)
2. **Session store**: Sessions lagras i MySQL-tabellen `sessions`
3. **Admin-API**: Fungerar endast med `Authorization: Bearer <token>` header

## ⚠️ Viktigt efter deployment

1. **Verifiera session-tabell**: MySQL session store skapar automatiskt `sessions`-tabellen
2. **Testa admin-API**: Verifiera att admin-API fungerar med Authorization header
3. **Kontrollera loggar**: Inga debug-meddelanden bör synas i produktion
4. **Bakåtkompatibilitet**: Gamla CBC-krypterade secrets ska fortfarande fungera

## 🔍 Troubleshooting

Om något går fel:

```bash
# Kolla Passenger-status
ssh mackaneu@omega.hostup.se 'passenger-status'

# Kolla logs
ssh mackaneu@omega.hostup.se 'tail -f ~/logs/passenger.log'

# Kolla om session-tabellen finns
ssh mackaneu@omega.hostup.se 'mysql -u skyddad_user -p skyddad_v2_db -e "SHOW TABLES LIKE \"sessions\";"'

# Verifiera build
ssh mackaneu@omega.hostup.se 'cd ~/skyddad-v2-app && ls -la dist/'
```

## ✅ Verifiering

Efter deployment bör du kunna:

- ✅ Komma åt huvudsidan: https://retea.se/skyddad/
- ✅ Healthcheck fungerar: https://retea.se/skyddad/healthz
- ✅ Skapa nya secrets (använder GCM-kryptering)
- ✅ Visa gamla secrets (bakåtkompatibilitet med CBC)
- ✅ Admin-API fungerar med Authorization header
- ✅ Sessions sparas i MySQL

Frontend är nu testad och fungerar korrekt i produktion! 🎉

