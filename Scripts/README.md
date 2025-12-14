# Scripts Directory

Denna mapp innehåller essentiella scripts för deployment och serverhantering.

## Viktigt: Använd safe-wrapper scripts för SSH/SCP

**ALDRIG kör SSH eller SCP direkt via terminal tools** - detta hänger sig och blockerar chat-sessionen.

### Använd istället:

#### SSH-kommandon
```powershell
.\Scripts\safe-ssh.ps1 "ls -la"
.\Scripts\safe-ssh.ps1 "npm run migrate"
```

#### SCP (file copy)
```powershell
.\Scripts\safe-scp.ps1 -Source ".htaccess" -Destination "~/public_html/retea/skyddad/.htaccess"
```

Dessa scripts har inbyggda timeouts (30 sek för SSH, 60 sek för SCP) och körs i bakgrunden så de kan inte hänga sig.

## Essentiella Scripts

### Deployment
- `deploy.sh` - Deployment-script för Linux/Mac
- `verify-deployment.sh` - Verifiera deployment
- `test-deployment-simple.ps1` - Testa deployment (Windows)

### Setup
- `setup-production-env.sh` - Konfigurera produktionsmiljö
- `setup-admin-proxy.sh` - Konfigurera admin-proxy
- `setup-cleanup-cron.sh` - Konfigurera cleanup cron job
- `setup-passenger.sh` - Konfigurera Passenger
- `run-all-setup.sh` - Kör alla setup-scripts

### Database & Maintenance
- `run-migrations.js` - Kör databasmigreringar
- `cleanup-cron.js` - Cleanup av utgångna secrets (cron job)

### Utilities
- `safe-ssh.ps1` - Säker SSH-wrapper med timeout
- `safe-scp.ps1` - Säker SCP-wrapper med timeout
