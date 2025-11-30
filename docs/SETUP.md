# Setup Guide - Skyddad v2

Steg-för-steg instruktioner för att sätta upp utvecklingsmiljö.

## 📋 Prerequisites

**Required:**
- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 8.0
- Git

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/retea-se/skyddad_v2.git
cd skyddad_v2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy example env file
cp .env.example .env.development

# Edit .env.development with your values
# Required variables:
# - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
# - ENCRYPTION_KEY (32 bytes hex = 64 characters)
# - SESSION_SECRET (min 32 characters)
# - CSRF_SECRET (min 32 characters)
```

**Generate secrets:**

```bash
# Generate encryption key (32 bytes = 64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CSRF secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE skyddad_v2_db;
CREATE USER 'skyddad_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON skyddad_v2_db.* TO 'skyddad_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
npm run migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Application available at `http://localhost:3000`

## ✅ Verify Installation

```bash
# Run tests (when implemented)
npm test

# Check linting
npm run lint

# Build project
npm run build
```

## 🔧 Common Issues

**Problem:** Database connection fails
**Solution:** Verify MySQL is running and credentials in `.env.development` are correct

**Problem:** TypeScript compilation errors
**Solution:** Run `npm run build` to see detailed errors, ensure all dependencies are installed

**Problem:** Port 3000 already in use
**Solution:** Change `PORT` in `.env.development` or stop the process using port 3000

## 📚 Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand system design
- Read [API.md](API.md) for API documentation
- Check [PLAN.md](PLAN.md) for project roadmap
