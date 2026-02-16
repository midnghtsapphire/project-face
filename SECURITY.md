# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in Project Face, please report it responsibly:

1. **Do not** open a public issue
2. Email security concerns to the GlowStarLabs team
3. Include a detailed description and steps to reproduce

## Security Measures

- JWT-based authentication with bcrypt password hashing
- Rate limiting on all API endpoints
- CORS restrictions with configurable allowed origins
- SQL injection prevention via SQLAlchemy ORM
- Input validation via Pydantic schemas
- Content Security Policy headers
- File upload validation (type, size limits)
- Stripe webhook signature verification
- Environment-based secret management
