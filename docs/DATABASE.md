# Database Documentation - Skyddad v2

Databasschema, migrations och backup/restore.

## Databas

- **Namn**: `skyddad_v2_db`
- **Typ**: MySQL 8.0+
- **Host**: Konfigureras via miljövariabler

## Schema

### Tabeller

#### `secrets`
- `id` (VARCHAR 32, PRIMARY KEY) - hex ID
- `encrypted_data` (TEXT) - AES-256-CBC krypterad data
- `pin_hash` (VARCHAR 255, NULLABLE) - bcrypt hash för PIN
- `views_left` (INT, DEFAULT 1) - antal visningar kvar
- `expires_at` (TIMESTAMP) - utgångstid
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `ip_address` (VARCHAR 45) - IP för skapande
- `pin_attempts` (INT, DEFAULT 0) - PIN-försök

**Indexes:**
- PRIMARY KEY på `id`
- INDEX på `expires_at` (för cleanup)
- INDEX på `created_at` (för statistik)

#### `log_events`
- `id` (BIGINT AUTO_INCREMENT PRIMARY KEY)
- `event_type` (VARCHAR 50) - 'created', 'viewed', 'expired', 'cleanup'
- `secret_id` (VARCHAR 32, INDEXED) - referens till secrets.id
- `ip_hash` (VARCHAR 64) - SHA-256 hash av IP
- `user_agent_hash` (VARCHAR 64) - Hash av user agent
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

**Indexes:**
- PRIMARY KEY på `id`
- INDEX på `secret_id` (för joins)
- INDEX på `event_type` (för filtrering)
- INDEX på `created_at` (för tidsbaserade queries)
- Composite INDEX på `(event_type, created_at)`

#### `migrations_history`
- `id` (INT AUTO_INCREMENT PRIMARY KEY)
- `migration_name` (VARCHAR 255, UNIQUE)
- `executed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Migrations

### Kör migrations
```bash
npm run migrate
```

### Skapa ny migration
```bash
npm run migrate:create
```

Migrations körs i ordning baserat på filnamn (001_, 002_, etc.).

## Backup och Restore

### Backup

**Manuell backup:**
```bash
mysqldump -u skyddad_user -p skyddad_v2_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Automatisk backup (cron):**
```bash
# Kör dagligen kl 02:00
0 2 * * * mysqldump -u skyddad_user -p skyddad_v2_db > /backups/skyddad_v2_$(date +\%Y\%m\%d).sql
```

**Retention**: 30 dagar

### Restore

```bash
mysql -u skyddad_user -p skyddad_v2_db < backup_YYYYMMDD_HHMMSS.sql
```

### Backup Checklist

- [ ] Backup körs dagligen
- [ ] Retention: 30 dagar
- [ ] Testa restore-processen kvartalsvis
- [ ] Verifiera backup-filer regelbundet

## Maintenance

### Cleanup

Körs automatiskt via cron (`scripts/cleanup-cron.js`):
- Tar bort utgångna secrets
- Raderar loggar äldre än 90 dagar
- Loggar cleanup-events

**Cron setup:**
```bash
0 * * * * cd /path/to/skyddad-v2 && node scripts/cleanup-cron.js
```

### Performance

**Indexes:**
- `secrets.expires_at` - för snabb cleanup
- `log_events.created_at` - för tidsbaserade queries
- `log_events.event_type` - för filtrering

**Query Optimization:**
- Använd parameteriserade queries
- Begränsa resultat med LIMIT
- Använd indexes för WHERE-klausuler

## Uppdateringshistorik

| Datum | Ändring | Användare |
|-------|---------|-----------|
| 2025-01-XX | Database documentation skapad | AI-assistent |

