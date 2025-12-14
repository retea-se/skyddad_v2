# Security Documentation - Skyddad v2

Säkerhetsåtgärder och best practices.

## Kryptering

### Secrets
- **Algoritm**: AES-256-CBC
- **IV**: Unik IV per secret (16 bytes, random)
- **Key**: 32 bytes (64 hex characters) från miljövariabel
- **Lagring**: IV + encrypted data (base64 encoded)

### PIN
- **Algoritm**: bcrypt
- **Cost factor**: 12
- **Lagring**: Hash i databas (aldrig plaintext)

## Säkerhetsåtgärder

### CSRF Protection
- **Metod**: Session-baserad token
- **Implementation**: `middleware/csrf.ts`
- **Användning**: Alla POST/PUT/DELETE requests
- **Token-generering**: Unik token per session
- **Validering**: Timing-safe comparison

### Rate Limiting
- **Create secrets**: 10 per timme per IP
- **View secrets**: 20 per timme per IP
- **PIN attempts**: 5 per 15 minuter per secret+IP
- **Admin API**: 100 per timme (med API key)

### Input Validation
- **Secret text**: Max 10000 tecken, required
- **PIN**: 4-20 alphanumeric characters
- **Sanitization**: XSS-skydd via Handlebars auto-escaping
- **SQL Injection**: Parameteriserade queries (mysql2)

### Secure Headers (Helmet)
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- HSTS (i production)

### Session Security
- **Cookie flags**:
  - `Secure`: Endast HTTPS (production)
  - `HttpOnly`: Ingen JavaScript-åtkomst
  - `SameSite`: `Lax`
  - `Max-Age`: 1 timme

## PIN Brute-Force Protection

- **Max försök**: 5 per secret
- **Lagring**: `pin_attempts` kolumn i `secrets` tabell
- **Efter 5 försök**: Secret låses, neutralt felmeddelande
- **Rate limiting**: Ytterligare skydd via middleware

## Admin API Security

- **Autentisering**: API key (Bearer token eller query param)
- **Lagring**: Miljövariabel (`ADMIN_API_KEY`)
- **Rate limiting**: 100 requests per timme
- **Endpoints**: Alla under `/admin/api/*` skyddade

## Data Anonymisering

### IP Addresses
- Hashas med SHA-256 direkt vid loggning
- Original IP sparas aldrig
- Används endast för säkerhetsanalys

### User Agent
- Delvis anonymisering (endast browser type)
- Hashas med SHA-256
- Ingen version eller OS-information

## Säkerhetschecklista

- ✅ AES-256-CBC kryptering för secrets
- ✅ bcrypt för PIN-hash
- ✅ CSRF-skydd för POST/PUT/DELETE
- ✅ Rate limiting konfigurerad
- ✅ Input validation och sanitization
- ✅ SQL injection-skydd (parameterized queries)
- ✅ XSS-skydd (Handlebars auto-escaping)
- ✅ Secure headers (Helmet)
- ✅ Session security (Secure, HttpOnly cookies)
- ✅ PIN brute-force protection
- ✅ Admin API autentisering
- ✅ IP och user agent anonymisering

## Incident Response

Vid säkerhetsincident:

1. **Identifiera**: Analysera loggar och Sentry
2. **Isolera**: Blockera IP om nödvändigt
3. **Rapportera**: Kontakta retea.se team
4. **Åtgärda**: Rotera nycklar om komprometterade
5. **Dokumentera**: Logga incident och åtgärder

## Uppdateringshistorik

| Datum | Ändring | Användare |
|-------|---------|-----------|
| 2025-01-XX | Security documentation skapad | AI-assistent |




