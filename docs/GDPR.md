# GDPR Compliance - Skyddad v2

Dokumentation för GDPR-kompatibilitet och dataskydd.

## Översikt

Skyddad v2 är designad för att vara GDPR-kompatibel genom dataminimering, anonymisering och automatisk radering av data.

## Datainsamling

### Vilken data samlas in?

1. **Krypterad text** (AES-256-CBC)
   - Lagras tills meddelandet visas eller går ut
   - Automatisk radering efter visning eller expiration

2. **IP-adresser** (SHA-256 hash)
   - Hashas direkt vid loggning
   - Original IP sparas aldrig
   - Används för säkerhetsanalys

3. **User Agent** (delvis anonymiserad)
   - Endast webbläsartyp (Chrome, Firefox, Safari, etc.)
   - Ingen version eller OS-information
   - Hashas med SHA-256

4. **PIN-hash** (bcrypt)
   - Endast om användaren väljer PIN-skydd
   - Lagras med bcrypt (cost factor 12)

### Vad samlas INTE in?

- ❌ Email-adresser
- ❌ Namn eller annan identifierbar information
- ❌ Tracking cookies (utan samtycke)
- ❌ Original IP-adresser (endast hash)
- ❌ Fullständig user agent-information

## Databevarande

### Secrets (hemligheter)
- **Lagringstid**: Tills visning eller expiration
- **Raderingsprocess**: Automatisk vid visning eller när `expires_at` passerar
- **Cleanup**: Körs varje timme via cron job

### Log Events
- **Lagringstid**: 90 dagar
- **Raderingsprocess**: Automatisk cleanup efter 90 dagar
- **Anonymisering**: IP och user agent hashas direkt vid loggning

## Anonymisering

### IP-adresser
```typescript
// Hash IP med SHA-256 direkt vid loggning
const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
```

### User Agent
```typescript
// Extrahera endast webbläsartyp, hash sedan
const browserType = extractBrowserType(userAgent); // Chrome, Firefox, etc.
const userAgentHash = crypto.createHash('sha256').update(browserType).digest('hex');
```

## Cookie Consent

### Implementation
- Cookie consent banner visas första gången (eller efter 12 månader)
- Två val: "Endast nödvändiga" och "Acceptera alla"
- Nödvändiga cookies: Session, CSRF-token (ingen consent behövs)
- Optional cookies: Analytics (endast med samtycke)
- Samtycke sparas i cookie och localStorage

### Cookie-typer
1. **Nödvändiga** (ingen consent behövs):
   - Session cookies
   - CSRF tokens
   - Språkval (locale)

2. **Optional** (kräver samtycke):
   - Analytics cookies (om implementerat)

## Användarens Rättigheter (GDPR Artikel 15-22)

### Rätt till information (Art. 15)
Användare kan begära information om vilken data vi har. Eftersom vi inte samlar in PII (Personally Identifiable Information) och all data är anonymiserad, kan vi ofta inte identifiera en specifik persons data.

**Process:**
1. Användare kontaktar via retea.se/kontakt
2. Om användare kan ge specifik `secret_id` kan den raderas
3. Loggar är anonymiserade och kan inte kopplas till specifik person

### Rätt till radering (Art. 17)
Användare kan begära radering av sin data.

**Process:**
1. Användare kontaktar via retea.se/kontakt
2. Om `secret_id` anges kan secret raderas direkt
3. Loggar raderas automatiskt efter 90 dagar
4. Eftersom data är anonymiserad kan vi ofta inte identifiera specifik persons data

### Rätt till dataportabilitet (Art. 20)
Användare kan begära export av sin data.

**Process:**
1. Användare kontaktar via retea.se/kontakt
2. Om `secret_id` anges kan krypterad data exporteras (om inte redan raderad)
3. Loggar exporteras i anonymiserad form

### Rätt till invändning (Art. 21)
Användare kan invända mot behandling av data.

**Process:**
1. Användare kontaktar via retea.se/kontakt
2. Om `secret_id` anges kan secret raderas
3. Framtida loggning kan stoppas för specifik secret (om identifierbar)

## Kontakt för Dataskyddsfrågor

**Kontaktinformation:**
- **Webbplats**: https://retea.se/kontakt
- **Email**: Via kontaktformulär på retea.se

**Vad kan levereras/raderas:**
- Eftersom ingen PII kopplas till en person är svaret ofta att vi inte kan identifiera en enskild persons data
- Om användare kan ge specifik `secret_id` kan den raderas
- Loggar är anonymiserade och kan inte kopplas till specifik person utan `secret_id`

## Register över Behandling

### Syfte
Tillfällig överföring av hemlig text via säker engångsdelning.

### Kategorier av data
- **Krypterad text** (AES-256-CBC)
- **IP-hash** (SHA-256, inte original IP)
- **User agent-hash** (delvis anonymiserad)
- **PIN-hash** (bcrypt, endast om PIN används)

### Lagringstider
- **Secrets**: Tills expiration eller visning
- **Loggar**: 90 dagar (automatisk cleanup)

### Personuppgiftsbiträde
- **Webbhotell**: omega.hostup.se
- **Databas**: MySQL på omega.hostup.se

### Rättslig grund
- **Art. 6.1.f GDPR**: Berättigat intresse (säker överföring av hemligheter)

## Säkerhetsåtgärder

### Tekniska åtgärder
- AES-256-CBC kryptering för secrets
- bcrypt för PIN-hash (cost factor 12)
- SHA-256 hash för IP och user agent
- Parameteriserade SQL queries (SQL injection-skydd)
- CSRF-skydd
- Rate limiting
- Secure headers (Helmet)

### Organisatoriska åtgärder
- Automatisk cleanup av utgångna secrets
- Automatisk radering av gamla loggar (90 dagar)
- Dokumenterad process för användarrättigheter
- Tydlig integritetspolicy

## Compliance Checklist

- ✅ Dataminimering (endast nödvändig data)
- ✅ Anonymisering av IP-adresser (SHA-256 hash)
- ✅ Delvis anonymisering av user agent
- ✅ Automatisk cleanup av gamla data
- ✅ Cookie consent banner
- ✅ Tydlig integritetspolicy (tvåspråkig)
- ✅ Kontaktinformation för dataskyddsfrågor
- ✅ Process för användarrättigheter dokumenterad
- ✅ Register över behandling dokumenterat
- ✅ Ingen tracking utan samtycke
- ✅ Data retention policy (90 dagar för loggar)

## Uppdateringshistorik

| Datum | Ändring | Användare |
|-------|---------|-----------|
| 2025-01-XX | GDPR-dokumentation skapad | AI-assistent |

