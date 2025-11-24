# CompTIA Network+ Learning Platform - Backend API

Complete REST API backend for the CompTIA Network+ learning platform with JWT authentication, PostgreSQL database, and comprehensive security features.

## Features

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **PostgreSQL Database**: Robust data persistence with proper schema design
- **Password Security**: bcrypt password hashing with salt rounds
- **Input Validation**: express-validator for comprehensive request validation
- **Rate Limiting**: Protection against brute-force attacks
- **Security Headers**: Helmet.js for secure HTTP headers
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with proper logging
- **API Documentation**: RESTful endpoints with clear documentation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

## Installation

1. **Clone and navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**:

   ```sql
   CREATE DATABASE comptia_network_plus;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE comptia_network_plus TO your_user;
   ```

4. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=comptia_network_plus
   DB_USER=your_user
   DB_PASSWORD=your_password
   JWT_SECRET=your_secure_jwt_secret
   REFRESH_TOKEN_SECRET=your_secure_refresh_secret
   ```

5. **Initialize database** (tables are created automatically on first run):
   ```bash
   npm run dev
   ```

## Usage

### Development Mode

```bash
npm run dev
```

Server runs on http://localhost:3001 with hot-reload

### Production Build

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "student",
    "profile": {},
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response** (200):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Profile

#### Get Profile

```http
GET /api/users/profile
Authorization: Bearer {accessToken}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "student"
    },
    "profile": {
      "first_name": "John",
      "last_name": "Doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Learning Network+"
    }
  }
}
```

#### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "CompTIA Network+ enthusiast"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "CompTIA Network+ enthusiast"
  }
}
```

### Progress Tracking

#### Get Progress

```http
GET /api/progress
Authorization: Bearer {accessToken}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "totalComponents": 5,
    "components": [
      {
        "component_id": "networking-fundamentals",
        "progress": {
          "completed": true,
          "score": 85
        },
        "last_accessed": "2024-01-15T10:00:00Z"
      }
    ],
    "lastActivity": "2024-01-15T10:00:00Z"
  }
}
```

#### Get Progress for Specific Component

```http
GET /api/progress?component_id=networking-fundamentals
Authorization: Bearer {accessToken}
```

#### Save Progress

```http
POST /api/progress
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "component_id": "networking-fundamentals",
  "progress": {
    "completed": true,
    "score": 85,
    "timeSpent": 1200
  }
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "component_id": "networking-fundamentals",
    "progress": {
      "completed": true,
      "score": 85,
      "timeSpent": 1200
    },
    "last_accessed": "2024-01-15T10:00:00Z"
  }
}
```

### Assessments

#### Get Assessments

```http
GET /api/assessments
Authorization: Bearer {accessToken}
```

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "assessment_type": "final-exam",
      "score": 85,
      "max_score": 100,
      "answers": {...},
      "time_taken": 3600,
      "completed_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Get Assessments by Type

```http
GET /api/assessments?assessment_type=final-exam
Authorization: Bearer {accessToken}
```

#### Save Assessment

```http
POST /api/assessments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "assessment_type": "final-exam",
  "score": 85,
  "max_score": 100,
  "answers": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "time_taken": 3600
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "assessment_type": "final-exam",
    "score": 85,
    "max_score": 100,
    "answers": {...},
    "time_taken": 3600,
    "completed_at": "2024-01-15T10:00:00Z"
  }
}
```

#### Get Assessment Statistics

```http
GET /api/assessments/statistics
Authorization: Bearer {accessToken}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "byType": [
      {
        "assessment_type": "final-exam",
        "attempts": 3,
        "avg_score": 82.5,
        "best_score": 85,
        "avg_time": 3400
      }
    ],
    "overall": {
      "total_assessments": 10,
      "overall_percentage": 83.2
    }
  }
}
```

## Database Schema

### users

- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE NOT NULL)
- password_hash (VARCHAR NOT NULL)
- role (VARCHAR DEFAULT 'student')
- is_active (BOOLEAN DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### user_profiles

- id (SERIAL PRIMARY KEY)
- user_id (INTEGER UNIQUE FK)
- first_name (VARCHAR)
- last_name (VARCHAR)
- avatar_url (TEXT)
- bio (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### user_progress

- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- component_id (VARCHAR)
- progress (JSONB)
- last_accessed (TIMESTAMP)
- UNIQUE(user_id, component_id)

### assessment_results

- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- assessment_type (VARCHAR)
- score (INTEGER)
- max_score (INTEGER)
- answers (JSONB)
- time_taken (INTEGER)
- completed_at (TIMESTAMP)

### learning_sessions

- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- component_id (VARCHAR)
- duration (INTEGER)
- activities (JSONB)
- completed_at (TIMESTAMP)

### refresh_tokens

- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- token (TEXT UNIQUE)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)

## Security Features

1. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Minimum 8 characters with complexity requirements
   - Password never stored in plain text

2. **JWT Authentication**
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Tokens stored securely in database

3. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Configurable via environment variables

4. **Input Validation**
   - All inputs validated using express-validator
   - SQL injection prevention via parameterized queries
   - XSS protection via input sanitization

5. **Security Headers**
   - Helmet.js for secure HTTP headers
   - CORS configuration
   - Content Security Policy

## Error Handling

All API responses follow a consistent format:

**Success Response**:

```json
{
  "success": true,
  "data": {...}
}
```

**Error Response**:

```json
{
  "success": false,
  "error": "Error message",
  "details": [...] // Only in validation errors
}
```

### HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

## Testing

The backend includes comprehensive test suites:

- **Authentication Tests**: Registration, login, token refresh, logout
- **Progress Tests**: Save, retrieve, update, delete progress
- **Profile Tests**: Get and update user profile
- **Assessment Tests**: Save and retrieve assessment results

Run tests:

```bash
npm test
```

View coverage report:

```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Logging

The API uses Winston for logging:

- **Development**: Console output with colors
- **Production**: File-based logging (logs/error.log, logs/combined.log)
- **HTTP Logging**: Morgan middleware for request logging

## Environment Variables

Required:

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret for access tokens
- `REFRESH_TOKEN_SECRET`: Secret for refresh tokens

Optional:

- `NODE_ENV`: development/production (default: development)
- `PORT`: Server port (default: 3001)
- `API_PREFIX`: API route prefix (default: /api)
- `JWT_EXPIRES_IN`: Access token expiration (default: 15m)
- `REFRESH_TOKEN_EXPIRES_IN`: Refresh token expiration (default: 7d)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:3000)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)
- `LOG_LEVEL`: Logging level (default: info)

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Database connection and initialization
│   │   └── logger.ts     # Winston logger configuration
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── progress.controller.ts
│   │   └── assessment.controller.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts      # JWT authentication
│   │   ├── validation.middleware.ts # Request validation
│   │   └── error.middleware.ts     # Error handling
│   ├── models/           # Database models
│   │   ├── user.model.ts
│   │   ├── progress.model.ts
│   │   ├── assessment.model.ts
│   │   └── session.model.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── progress.routes.ts
│   │   ├── assessment.routes.ts
│   │   └── index.ts
│   ├── services/         # Business logic services
│   │   └── auth.service.ts
│   ├── utils/            # Utility functions
│   │   └── validators.ts
│   └── server.ts         # Express app setup
├── tests/                # Test files
│   ├── auth.test.ts
│   └── progress.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── .gitignore
└── README.md
```

## License

MIT

## Support

For issues and questions, please open an issue on the project repository.
