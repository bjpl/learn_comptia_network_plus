# Security Documentation

## CompTIA Network+ Learning Platform

This document outlines the security measures implemented in the CompTIA Network+ Learning Platform to protect against common web vulnerabilities and ensure data protection.

---

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Authentication & Authorization](#authentication--authorization)
3. [Input Validation](#input-validation)
4. [XSS Prevention](#xss-prevention)
5. [CSRF Protection](#csrf-protection)
6. [SQL Injection Prevention](#sql-injection-prevention)
7. [Rate Limiting](#rate-limiting)
8. [Security Headers](#security-headers)
9. [Data Protection](#data-protection)
10. [Secrets Management](#secrets-management)
11. [Security Testing](#security-testing)
12. [Incident Response](#incident-response)

---

## Security Architecture

### Defense in Depth

The platform implements multiple layers of security:

1. **Frontend Layer**: Input validation and sanitization
2. **API Layer**: Authentication, CSRF protection, rate limiting
3. **Business Logic Layer**: Authorization and access control
4. **Data Layer**: SQL injection prevention, encrypted connections
5. **Infrastructure Layer**: HTTPS, security headers, firewalls

### Security Principles

- **Least Privilege**: Users have minimum necessary permissions
- **Fail Securely**: System fails to secure state on errors
- **Defense in Depth**: Multiple security layers
- **Secure by Default**: Security features enabled by default
- **Zero Trust**: All requests validated regardless of source

---

## Authentication & Authorization

### JSON Web Tokens (JWT)

The platform uses JWT for stateless authentication:

**Access Tokens**:

- Short-lived (15 minutes)
- Used for API authentication
- Stored in memory (not localStorage)
- Automatically refreshed

**Refresh Tokens**:

- Long-lived (7 days)
- Used to obtain new access tokens
- Stored in httpOnly cookies
- Revocable via database

### Password Security

**Hashing**:

- Algorithm: bcrypt
- Work factor: 10 rounds (configurable)
- Unique salt per password

**Password Policy**:

- Minimum length: 8 characters
- Maximum length: 100 characters
- Must contain: uppercase, lowercase, number, special character
- Password history: prevent reuse of last 5 passwords

**Account Protection**:

- Rate limiting on login attempts (5 per 15 minutes)
- Account lockout after 5 failed attempts (15 minutes)
- Email notification on password changes
- Password reset with time-limited tokens (1 hour)

### Session Management

- Sessions expire after inactivity
- Concurrent session limit per user
- Logout invalidates refresh tokens
- Automatic logout on token expiration

---

## Input Validation

### Frontend Validation (Zod)

All user inputs validated using Zod schemas:

**Auth Schemas** (`src/utils/validation/auth-schemas.ts`):

- Email validation (RFC 5322 compliant)
- Password strength validation
- Username format validation
- Registration data validation

**User Schemas** (`src/utils/validation/user-schemas.ts`):

- Profile update validation
- Email update with password confirmation
- Notification preferences
- Privacy settings

**Progress Schemas** (`src/utils/validation/progress-schemas.ts`):

- Module completion validation
- Study session tracking
- Bookmark and note validation

**Assessment Schemas** (`src/utils/validation/assessment-schemas.ts`):

- Answer submission validation
- Quiz attempt validation
- Performance analytics validation

### Validation Features

- Type safety with TypeScript
- Runtime validation
- Custom error messages
- Nested object validation
- Array validation with size limits
- String length limits
- Regex pattern matching
- Cross-field validation

### Example Usage

```typescript
import { loginSchema } from '@/utils/validation/auth-schemas';

// Validate login data
try {
  const validData = loginSchema.parse(formData);
  // Proceed with login
} catch (error) {
  // Handle validation errors
  console.error(error.errors);
}
```

---

## XSS Prevention

### DOMPurify Sanitization

All user-generated content sanitized before display:

**Sanitization Functions** (`src/utils/security/sanitizer.ts`):

1. **sanitizeHtmlBasic**: Basic inline formatting only
2. **sanitizeHtmlRich**: Rich text with headings, lists, links
3. **stripHtml**: Remove all HTML tags
4. **sanitizeInput**: Plain text with dangerous char removal
5. **sanitizeEmail**: Email address sanitization
6. **sanitizeUrl**: URL validation and protocol filtering
7. **sanitizeFilename**: Path traversal prevention
8. **sanitizeSearchQuery**: Search input sanitization
9. **escapeHtml**: HTML entity escaping

### Content Security Policy (CSP)

Strict CSP headers prevent unauthorized script execution:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self';
frame-src 'none';
object-src 'none';
```

### XSS Protection Measures

- All outputs HTML-escaped by default
- User content sanitized with DOMPurify
- No eval() or Function() constructor usage
- No inline event handlers (onclick, etc.)
- Strict CSP headers
- X-XSS-Protection header enabled

---

## CSRF Protection

### Token-Based CSRF Protection

**Implementation** (`backend/src/middleware/csrf.middleware.ts`):

1. **Token Generation**:
   - Cryptographically secure (32 bytes)
   - Unique per session
   - Stored server-side
   - Expires after 15 minutes

2. **Token Distribution**:
   - GET requests receive token
   - Token in cookie (XSRF-TOKEN)
   - Token in response header

3. **Token Verification**:
   - Required for POST, PUT, DELETE, PATCH
   - Checked via header (X-CSRF-Token) or body (\_csrf)
   - Timing-safe comparison
   - Automatic regeneration after use

### Usage

**Backend**:

```typescript
import { csrfProtection } from '@/middleware/csrf.middleware';

// Protect all routes
app.use(csrfProtection);

// Or specific routes
router.post('/sensitive', csrfProtection, handler);
```

**Frontend**:

```typescript
// Token automatically included in requests
fetch('/api/resource', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': getCsrfToken(),
  },
  body: JSON.stringify(data),
});
```

### CSRF Protection Features

- Double-submit cookie pattern
- Timing-safe token comparison
- Automatic token rotation
- Token expiration
- Session-based validation
- Support for header and body tokens

---

## SQL Injection Prevention

### Parameterized Queries

**Database Query Utility** (`backend/src/utils/db-query.ts`):

**Safe Query Execution**:

```typescript
// SAFE: Parameterized query
const result = await dbQuery.execute('SELECT * FROM users WHERE email = $1', ['user@example.com']);

// UNSAFE: String concatenation (NEVER DO THIS!)
const result = await dbQuery.execute(`SELECT * FROM users WHERE email = '${email}'`);
```

### Query Builder Functions

1. **buildWhereClause**: Safe WHERE conditions
2. **buildOrderByClause**: Safe ORDER BY with validation
3. **buildPaginationClause**: Safe LIMIT/OFFSET
4. **escapeLikePattern**: Escape LIKE wildcards
5. **validateIdentifier**: Validate table/column names
6. **quoteIdentifier**: Quote identifiers safely

### SQL Injection Protection Measures

- All queries use parameterized statements
- Input validation before queries
- Identifier validation (table/column names)
- Query pattern detection
- LIKE pattern escaping
- Stored procedure usage where appropriate
- Least privilege database accounts

### Example

```typescript
// Build safe WHERE clause
const { clause, params } = dbQuery.buildWhereClause({
  email: 'user@example.com',
  is_active: true,
});

// Execute safe query
const users = await dbQuery.execute(`SELECT * FROM users ${clause}`, params);
```

---

## Rate Limiting

### Endpoint-Specific Rate Limits

**Rate Limit Middleware** (`backend/src/middleware/rate-limit.middleware.ts`):

| Endpoint Type      | Window | Max Requests | Purpose             |
| ------------------ | ------ | ------------ | ------------------- |
| Authentication     | 15 min | 5            | Prevent brute force |
| Registration       | 1 hour | 3            | Prevent abuse       |
| Password Reset     | 1 hour | 3            | Prevent enumeration |
| Email Verification | 1 hour | 5            | Prevent spam        |
| Standard Write     | 15 min | 100          | General protection  |
| Read Operations    | 15 min | 300          | Lenient for reads   |
| Assessment Submit  | 1 hour | 50           | Prevent cheating    |
| File Upload        | 1 hour | 20           | Resource protection |
| Search             | 15 min | 100          | Prevent DoS         |
| Global             | 15 min | 1000         | Overall protection  |

### Rate Limiting Features

- Per-IP rate limiting
- Per-user rate limiting
- Skip successful requests (count only failures)
- Custom error responses
- Retry-After headers
- Rate limit headers (RateLimit-\*)

### Usage

```typescript
import { authRateLimit } from '@/middleware/rate-limit.middleware';

// Apply to authentication routes
router.post('/login', authRateLimit, loginHandler);
router.post('/register', registrationRateLimit, registerHandler);
```

---

## Security Headers

### Helmet Configuration

**Comprehensive security headers** (`backend/src/server.ts`):

| Header                    | Value                           | Purpose                |
| ------------------------- | ------------------------------- | ---------------------- |
| Content-Security-Policy   | Strict CSP                      | Prevent XSS            |
| Strict-Transport-Security | 1 year, includeSubDomains       | Force HTTPS            |
| X-Content-Type-Options    | nosniff                         | Prevent MIME sniffing  |
| X-Frame-Options           | DENY                            | Prevent clickjacking   |
| X-XSS-Protection          | 1; mode=block                   | XSS filter             |
| Referrer-Policy           | strict-origin-when-cross-origin | Control referrer       |
| X-DNS-Prefetch-Control    | off                             | Prevent DNS leakage    |
| X-Download-Options        | noopen                          | Prevent file execution |

### HSTS Preloading

- Enabled for production
- 1 year max-age
- Includes subdomains
- Preload list submission ready

### CORS Configuration

- Strict origin validation
- Credentials support
- Limited methods
- Controlled headers
- 24-hour preflight cache

---

## Data Protection

### Encryption

**At Rest**:

- Database: PostgreSQL with encryption
- Passwords: bcrypt with salt
- Sensitive data: AES-256 encryption

**In Transit**:

- TLS 1.2+ required
- HTTPS enforced
- Secure cookies
- HSTS enabled

### Data Minimization

- Collect only necessary data
- Regular data purging
- Anonymize analytics
- Configurable data retention

### Privacy Controls

- User profile visibility settings
- Data export functionality
- Account deletion
- Cookie consent
- Privacy policy acceptance

---

## Secrets Management

### Environment Variables

All secrets stored in environment variables:

**Critical Secrets**:

- JWT_SECRET: JWT signing key
- REFRESH_TOKEN_SECRET: Refresh token key
- SESSION_SECRET: Session cookie signing
- DATABASE_URL: Database connection string

### Secret Generation

```bash
# Generate secure random secret
openssl rand -base64 32

# Example output:
# 7xK9m2pQ8vL3nR6tY4wE1aZ5bN8cM7dF9gH2jK4lP6qS8uV
```

### Secret Management Best Practices

1. **Never commit secrets** to version control
2. **Use .env files** for local development
3. **Use environment variables** in production
4. **Rotate secrets regularly** (every 90 days)
5. **Use different secrets** for each environment
6. **Limit secret access** to authorized personnel
7. **Use secret management tools** (AWS Secrets Manager, HashiCorp Vault)
8. **Audit secret access** and changes

### .env File Structure

```bash
# See backend/.env.example for complete configuration
JWT_SECRET=<YOUR_GENERATED_SECRET>
REFRESH_TOKEN_SECRET=<YOUR_GENERATED_SECRET>
SESSION_SECRET=<YOUR_GENERATED_SECRET>
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

---

## Security Testing

### Test Suite

**Security Tests** (`backend/tests/security/`):

1. **sql-injection.test.ts**: SQL injection prevention
2. **xss-prevention.test.ts**: XSS sanitization
3. **csrf-protection.test.ts**: CSRF token validation
4. **rate-limiting.test.ts**: Rate limit enforcement

### Running Security Tests

```bash
# Run all security tests
cd backend
npm test tests/security/

# Run specific test suite
npm test tests/security/sql-injection.test.ts

# Run with coverage
npm test -- --coverage
```

### Manual Security Testing

**Tools**:

- OWASP ZAP: Automated vulnerability scanning
- Burp Suite: Manual penetration testing
- SQLMap: SQL injection testing
- XSSer: XSS vulnerability detection

**Testing Checklist**:

- [ ] SQL injection attempts
- [ ] XSS payload injection
- [ ] CSRF token bypass attempts
- [ ] Rate limit testing
- [ ] Authentication bypass attempts
- [ ] Authorization escalation attempts
- [ ] Session hijacking attempts
- [ ] File upload exploits
- [ ] API fuzzing
- [ ] Security header validation

---

## Incident Response

### Security Incident Process

1. **Detection**: Monitor logs and alerts
2. **Assessment**: Determine severity and impact
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat and patch vulnerabilities
5. **Recovery**: Restore systems and verify integrity
6. **Post-Incident**: Document and improve defenses

### Security Contacts

- **Security Team**: security@example.com
- **Emergency**: +1-XXX-XXX-XXXX
- **Bug Bounty**: https://example.com/security/bounty

### Responsible Disclosure

If you discover a security vulnerability:

1. **Email** security@example.com with details
2. **Do not** publicly disclose until resolved
3. **Allow** 90 days for remediation
4. **Receive** acknowledgment and potential bounty

### Security Monitoring

**Logging**:

- Authentication attempts (success/failure)
- Authorization failures
- Rate limit violations
- CSRF token failures
- SQL injection attempts
- XSS attempts
- File upload attempts
- Error stack traces

**Alerting**:

- Multiple failed login attempts
- Unusual API activity
- Database errors
- System resource exhaustion
- Security header violations

---

## Security Checklist

### Development

- [ ] Use parameterized queries
- [ ] Validate all inputs
- [ ] Sanitize all outputs
- [ ] Use HTTPS in production
- [ ] Enable security headers
- [ ] Implement rate limiting
- [ ] Use strong authentication
- [ ] Protect against CSRF
- [ ] Prevent XSS attacks
- [ ] Secure file uploads
- [ ] Implement proper logging
- [ ] Handle errors securely

### Deployment

- [ ] Generate unique secrets
- [ ] Configure environment variables
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable database encryption
- [ ] Configure backup strategy
- [ ] Set up monitoring/alerting
- [ ] Review security headers
- [ ] Test rate limiting
- [ ] Verify CORS configuration
- [ ] Enable audit logging
- [ ] Document security procedures

### Maintenance

- [ ] Rotate secrets regularly
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Conduct security audits
- [ ] Test disaster recovery
- [ ] Review access controls
- [ ] Update documentation
- [ ] Train team on security
- [ ] Monitor for vulnerabilities
- [ ] Apply security patches

---

## Resources

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools

- [OWASP ZAP](https://www.zaproxy.org/)
- [Burp Suite](https://portswigger.net/burp)
- [SQLMap](http://sqlmap.org/)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)

### Training

- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackTheBox](https://www.hackthebox.com/)

---

## Version History

| Version | Date       | Changes                         |
| ------- | ---------- | ------------------------------- |
| 1.0.0   | 2025-01-29 | Initial security implementation |

---

## License

This security documentation is part of the CompTIA Network+ Learning Platform and is subject to the same license terms.

---

**For security concerns, please contact:** security@example.com
