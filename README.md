# Skyddad v2

[![CI Lint](https://github.com/retea-se/skyddad_v2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/retea-se/skyddad_v2/actions/workflows/ci.yml)
[![CI Test](https://github.com/retea-se/skyddad_v2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/retea-se/skyddad_v2/actions/workflows/ci.yml)
[![CI Build](https://github.com/retea-se/skyddad_v2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/retea-se/skyddad_v2/actions/workflows/ci.yml)

---

## 🇸🇪 Svenska

**Skyddad** är en säker tjänst för engångsdelning av hemligheter. Dela känslig information med trygghet, vetskapen om att den automatiskt raderas efter visning eller utgångstid.

### Funktioner

- 🔒 **AES-256-CBC kryptering** – All data krypteras med militärgrad säkerhet
- 🔐 **Valfritt PIN-skydd** – Ytterligare säkerhetslager för känslig information
- ⏱️ **Automatisk utgångstid** – Meddelanden försvinner automatiskt efter angiven tid
- 🗑️ **Självförstörande** – Meddelanden raderas permanent efter första visningen
- 📱 **Mobil-först design** – Fungerar perfekt på alla enheter
- 🌍 **Tvåspråkig** – Svenska och engelska
- ✅ **GDPR-kompatibel** – Fullt kompatibel med dataskyddsförordningen
- 🛡️ **Säkerhet först** – CSRF-skydd, rate limiting och input-validering

### Teknisk Stack

- **Backend**: Node.js + Express
- **Språk**: TypeScript
- **Templating**: Handlebars
- **Databas**: MySQL
- **Säkerhet**: bcrypt för PIN-hashing, AES-256-CBC för kryptering
- **Monitoring**: Sentry för error tracking

### Installation

```bash
# Klona repository
git clone https://github.com/retea-se/skyddad_v2.git
cd skyddad_v2

# Installera dependencies
npm install

# Konfigurera miljövariabler
cp .env.example .env.development
# Redigera .env.development med dina värden

# Kör databasmigreringar
npm run migrate

# Starta utvecklingsserver
npm run dev
```

### Utveckling

```bash
# Utvecklingsserver med hot reload
npm run dev

# Bygg för produktion
npm run build

# Kör tester
npm test

# Linting
npm run lint

# Formatering
npm run format
```

### Dokumentation

Se `docs/`-mappen för detaljerad dokumentation:

- [Setup Guide](docs/SETUP.md) – Lokal utvecklingssetup
- [Security](docs/SECURITY.md) – Säkerhetsåtgärder och best practices
- [Database](docs/DATABASE.md) – Databasschema och migrations
- [GDPR](docs/GDPR.md) – GDPR-kompatibilitet och dataskydd
- [API](docs/API.md) – API-dokumentation
- [Deployment](docs/DEPLOYMENT.md) – Deployment-guide

### Live Application

**Produktion**: https://retea.se/skyddad

### Licens

MIT

---

## 🇬🇧 English

**Skyddad** is a secure one-time secret sharing service. Share sensitive information with confidence, knowing it will be automatically deleted after viewing or expiration.

### Features

- 🔒 **AES-256-CBC encryption** – All data encrypted with military-grade security
- 🔐 **Optional PIN protection** – Additional security layer for sensitive information
- ⏱️ **Automatic expiration** – Messages automatically disappear after specified time
- 🗑️ **Self-destruct** – Messages are permanently deleted after first viewing
- 📱 **Mobile-first design** – Works perfectly on all devices
- 🌍 **Bilingual** – Swedish and English
- ✅ **GDPR compliant** – Fully compliant with data protection regulations
- 🛡️ **Security first** – CSRF protection, rate limiting, and input validation

### Tech Stack

- **Backend**: Node.js + Express
- **Language**: TypeScript
- **Templating**: Handlebars
- **Database**: MySQL
- **Security**: bcrypt for PIN hashing, AES-256-CBC for encryption
- **Monitoring**: Sentry for error tracking

### Installation

```bash
# Clone repository
git clone https://github.com/retea-se/skyddad_v2.git
cd skyddad_v2

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.development
# Edit .env.development with your values

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Linting
npm run lint

# Formatting
npm run format
```

### Documentation

See the `docs/` folder for detailed documentation:

- [Setup Guide](docs/SETUP.md) – Local development setup
- [Security](docs/SECURITY.md) – Security measures and best practices
- [Database](docs/DATABASE.md) – Database schema and migrations
- [GDPR](docs/GDPR.md) – GDPR compliance and data protection
- [API](docs/API.md) – API documentation
- [Deployment](docs/DEPLOYMENT.md) – Deployment guide

### Live Application

**Production**: https://retea.se/skyddad

### License

MIT

---

## 🔗 Links

- **Live Application**: https://retea.se/skyddad
- **Privacy Policy**: https://retea.se/skyddad/privacy
- **FAQ**: https://retea.se/skyddad/faq
- **GitHub Repository**: https://github.com/retea-se/skyddad_v2

## ⚠️ Security Notice

This is a security-critical application. Always follow security best practices and never commit secrets or sensitive data to the repository.
