# Skyddad v2

Säker engångsdelning av hemligheter för retea.se

## English

**Skyddad** is a secure one-time secret sharing service. Share sensitive information with confidence knowing it will be automatically deleted after viewing or expiration.

### Features

- 🔒 AES-256-CBC encryption
- 🔐 Optional PIN protection
- ⏱️ Automatic expiration
- 🗑️ Self-destruct after viewing
- 📱 Mobile-first responsive design
- 🌍 Bilingual (Swedish/English)
- ✅ GDPR compliant

### Tech Stack

- Node.js + Express
- TypeScript
- Handlebars
- MySQL
- bcrypt for PIN hashing

---

## Svenska

**Skyddad** är en säker tjänst för engångsdelning av hemligheter. Dela känslig information med trygghet, vetskapen om att den automatiskt raderas efter visning eller utgångstid.

### Funktioner

- 🔒 AES-256-CBC kryptering
- 🔐 Valfritt PIN-skydd
- ⏱️ Automatisk utgångstid
- 🗑️ Självförstörande efter visning
- 📱 Mobil-först responsiv design
- 🌍 Tvåspråkig (Svenska/Engelska)
- ✅ GDPR-kompatibel

### Teknisk Stack

- Node.js + Express
- TypeScript
- Handlebars
- MySQL
- bcrypt för PIN-hashing

---

## 🔗 Links

- **Live Application**: https://retea.se/skyddad (when deployed)
- **Documentation**: See `docs/` folder
- **Privacy Policy**: `/privacy`
- **FAQ**: `/faq`

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Local development setup
- [Security](docs/SECURITY.md) - Security measures and best practices
- [Database](docs/DATABASE.md) - Database schema and migrations
- [GDPR](docs/GDPR.md) - GDPR compliance and data protection
- [API](docs/API.md) - API documentation
- [Deployment](docs/DEPLOYMENT.md) - Deployment guide

## 🛠️ Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.development
# Edit .env.development with your values

# Run migrations
npm run migrate

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📝 License

MIT

---

**Note**: This is a security-critical application. Always follow security best practices and never commit secrets or sensitive data.

