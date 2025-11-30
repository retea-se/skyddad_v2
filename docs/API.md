# API Documentation

Complete API reference for all endpoints.

## 🌐 Base URL

**Development:** `http://localhost:3000/api`
**Staging:** `https://api-staging.example.com`
**Production:** `https://api.example.com`

## 🔐 Authentication

**Method:** [Bearer Token / API Key / OAuth]

```bash
# Include in request headers
Authorization: Bearer YOUR_TOKEN_HERE
```

**Getting a token:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

## 📡 Endpoints

### Users

#### GET /api/users
Get all users (paginated)

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `sort` (string, optional): Sort by field (default: createdAt)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### GET /api/users/:id
Get single user by ID

**Parameters:**
- `id` (string, required): User ID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLogin": "2024-01-20T14:22:00Z"
}
```

**Errors:**
- `404 Not Found` - User not found
- `401 Unauthorized` - Missing or invalid token

#### POST /api/users
Create new user

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "createdAt": "2024-01-20T15:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid input
- `409 Conflict` - Email already exists
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin

### [Add more endpoints...]

## 🚨 Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

**Common error codes:**
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input
- `RATE_LIMITED` - Too many requests

## 📊 Rate Limiting

**Limits:**
- Authenticated users: 1000 requests/hour
- Unauthenticated: 100 requests/hour

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642680000
```

## 🔗 Webhooks (if applicable)

[Document webhook endpoints and payloads]

## 📚 Examples

### cURL Examples

```bash
# Get users
curl -X GET "https://api.example.com/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create user
curl -X POST "https://api.example.com/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John","password":"pass123"}'
```

### JavaScript Examples

```javascript
// Using fetch
const response = await fetch('https://api.example.com/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```
