# Troubleshooting Guide

Common issues and solutions.

## 🔍 General Debugging Steps

1. **Check error logs** - Terminal, browser console, server logs
2. **Verify environment** - Correct env vars, dependencies installed
3. **Reproduce issue** - Can you trigger it consistently?
4. **Isolate problem** - Frontend, backend, database, network?
5. **Check recent changes** - Did a recent commit break it?

## 🐛 Common Issues

### Installation & Setup

#### Issue: `npm install` fails with dependency errors

**Symptoms:**
```bash
npm ERR! peer dep missing: react@^18.0.0
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

#### Issue: Environment variables not loading

**Symptoms:**
- App crashes with "undefined is not defined"
- Missing configuration errors

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check .env format (no spaces around =)
# ❌ Bad: DATABASE_URL = postgres://...
# ✅ Good: DATABASE_URL=postgres://...

# Restart server after env changes
npm run dev
```

#### Issue: Database connection fails

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check database is running
# PostgreSQL:
sudo service postgresql status
# or
docker ps | grep postgres

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database

# Test connection
psql $DATABASE_URL
```

### Development

#### Issue: Hot reload not working

**Symptoms:**
- Code changes don't reflect in browser
- Must manually refresh

**Solution:**
```bash
# Check if dev server is running in dev mode
# Verify package.json:
"dev": "vite" # or "next dev" or "webpack serve"

# Clear build cache
rm -rf .next  # Next.js
rm -rf dist   # Vite

# Restart dev server
npm run dev
```

#### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Kill process
# Windows:
taskkill /PID [PID] /F

# Mac/Linux:
kill -9 [PID]

# Or use different port
PORT=3001 npm run dev
```

### Testing

#### Issue: Tests fail with "module not found"

**Symptoms:**
```
Cannot find module '@/components/Button'
```

**Solution:**
```javascript
// Check tsconfig.json or jest.config.js for path mapping
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// Jest config:
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

#### Issue: Tests hang or timeout

**Symptoms:**
- Tests never complete
- "Exceeded timeout of 5000ms"

**Solution:**
```javascript
// Increase timeout
test('slow test', async () => {
  // ...
}, 10000); // 10 second timeout

// Check for missing awaits
// ❌ Bad:
const result = fetchData(); // Missing await!

// ✅ Good:
const result = await fetchData();

// Check for unresolved promises
afterEach(async () => {
  await cleanup();
});
```

### Build & Deployment

#### Issue: Build fails with type errors

**Symptoms:**
```
error TS2322: Type 'string' is not assignable to type 'number'
```

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Fix type errors
# Use strict null checks
if (value !== undefined) {
  // use value
}

# Run type check
npm run type-check
```

#### Issue: Production build much larger than expected

**Symptoms:**
- Bundle size > 1MB
- Slow page loads

**Solution:**
```bash
# Analyze bundle
npm run build -- --analyze

# Common culprits:
# - Entire lodash imported (use lodash-es and tree-shaking)
# - Moment.js included (replace with date-fns)
# - Large dependencies not code-split
# - Source maps included in production

# Verify production mode
NODE_ENV=production npm run build
```

### Performance

#### Issue: Slow API responses

**Symptoms:**
- API calls taking > 1 second
- Timeouts in frontend

**Solution:**
```bash
# Check for N+1 queries
# ❌ Bad:
users.forEach(user => {
  const posts = await db.posts.findAll({ userId: user.id });
});

# ✅ Good:
const users = await db.users.findAll({
  include: [{ model: db.posts }]
});

# Add database indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);

# Check query performance
EXPLAIN ANALYZE SELECT * FROM ...;

# Enable caching
# Use Redis for frequently accessed data
```

#### Issue: High memory usage

**Symptoms:**
- App crashes with "Out of memory"
- Performance degrades over time

**Solution:**
```javascript
// Check for memory leaks

// ❌ Bad: Event listeners not cleaned up
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  // Missing cleanup!
});

// ✅ Good: Cleanup in return
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Clear intervals/timeouts
useEffect(() => {
  const interval = setInterval(() => {...}, 1000);
  return () => clearInterval(interval);
}, []);

// Profile with Chrome DevTools
// Take heap snapshots to find leaks
```

## 🆘 Getting Help

**If issue persists:**

1. **Check logs:**
   - Browser console (F12)
   - Server logs (`npm run dev`)
   - Error tracking (Sentry)

2. **Search existing issues:**
   - GitHub issues in this repo
   - Stack Overflow
   - Framework documentation

3. **Create GitHub issue:**
   ```bash
   gh issue create --title "[Bug] Description" \
     --body "Steps to reproduce..." \
     --label "bug"
   ```

4. **Ask team:**
   - Slack #engineering channel
   - Tag relevant team members

## 📚 Additional Resources

- **Framework docs:** [Link to framework documentation]
- **Stack Overflow tag:** [Your project tag]
- **Team wiki:** [Internal wiki]
- **Error tracking:** [Sentry dashboard]
