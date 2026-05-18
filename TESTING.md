# Testing Guide — Project Face

Complete guide for testing Project Face at all levels.

## Table of Contents

- [Quick Start](#quick-start)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [Integration Testing](#integration-testing)
- [Manual Testing](#manual-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)

---

## Quick Start

### Run All Tests

```bash
# Backend tests
cd backend
python -m pytest app/tests/ -v

# Frontend tests
cd frontend
pnpm test

# Full integration test
docker compose up -d
# Wait for services to start
curl http://localhost:8000/health
curl http://localhost/
```

---

## Backend Testing

### Setup Test Environment

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt
```

### Run Tests

```bash
# All tests
python -m pytest app/tests/ -v

# With coverage
python -m pytest app/tests/ -v --cov=app --cov-report=html

# Specific test file
python -m pytest app/tests/test_api.py -v

# Specific test class
python -m pytest app/tests/test_api.py::TestAuthEndpoints -v

# Specific test
python -m pytest app/tests/test_api.py::TestAuthEndpoints::test_register -v

# Stop on first failure
python -m pytest app/tests/ -v -x

# Show print statements
python -m pytest app/tests/ -v -s
```

### Code Coverage

```bash
# Generate HTML coverage report
python -m pytest app/tests/ --cov=app --cov-report=html

# Open in browser
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

### Test Structure

```
backend/app/tests/
├── __init__.py
├── conftest.py          # Fixtures and setup
└── test_api.py          # All API endpoint tests
```

### Key Test Fixtures

From `conftest.py`:

- **`client`** — TestClient for API requests
- **`test_db`** — Isolated test database
- **`test_user`** — Pre-created test user
- **`auth_headers`** — Authorization headers with valid token

### Writing New Tests

```python
# backend/app/tests/test_my_feature.py
import pytest

class TestMyFeature:
    """Test my new feature."""
    
    def test_my_endpoint(self, client, auth_headers):
        """Test that my endpoint works."""
        response = client.post(
            "/api/v1/my-endpoint",
            headers=auth_headers,
            json={"data": "value"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "expected"
```

### Linting & Code Style

```bash
# Install ruff
pip install ruff

# Check code
ruff check app/

# Auto-fix issues
ruff check app/ --fix

# Format code
ruff format app/
```

---

## Frontend Testing

### Setup

```bash
cd frontend
pnpm install
```

### Run Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test --watch

# UI mode (interactive)
pnpm test --ui

# Coverage
pnpm test --coverage
```

### Linting

```bash
# ESLint
pnpm lint

# Type checking
pnpm tsc --noEmit
```

### Test Structure

```
frontend/src/__tests__/
└── smoke.test.ts        # Basic smoke tests
```

### Writing Component Tests

```typescript
// frontend/src/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles clicks', async () => {
    const { user } = render(<MyComponent />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

---

## Integration Testing

### Full Stack Test with Docker

```bash
# Start all services
docker compose up -d

# Wait for services to be healthy
docker compose ps

# Test backend health
curl http://localhost:8000/health

# Test frontend
curl http://localhost/

# Test API endpoint
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","full_name":"Test User"}'

# Stop services
docker compose down -v
```

### Database Migration Test

```bash
# Start database
docker compose up -d postgres

# Run migrations
docker compose exec backend alembic upgrade head

# Verify
docker compose exec backend alembic current

# Rollback test
docker compose exec backend alembic downgrade -1
docker compose exec backend alembic upgrade head
```

---

## Manual Testing

### Local Development Testing

#### 1. Start Services

```bash
# Terminal 1: Start database services
docker compose up postgres redis

# Terminal 2: Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 3: Start frontend
cd frontend
pnpm dev
```

#### 2. Test User Flows

**Registration Flow:**
1. Go to http://localhost:5173/register
2. Fill in:
   - Email: `test@example.com`
   - Password: `SecurePass123!`
   - Full Name: `Test User`
3. Click "Register"
4. Should redirect to dashboard

**Login Flow:**
1. Go to http://localhost:5173/login
2. Enter credentials
3. Click "Login"
4. Should redirect to dashboard

**Image Analysis Flow:**
1. Login
2. Click "Analyze" in navigation
3. Upload a selfie image (JPEG/PNG)
4. Wait for analysis (uses OpenAI API)
5. View results with scores and recommendations

**Subscription Flow:**
1. Login
2. Go to "Premium" page
3. Select a plan (requires Stripe test keys)
4. Complete checkout
5. Verify premium features unlock

### API Testing with cURL

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Register:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "SecurePass123!",
    "full_name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -F "username=user@test.com" \
  -F "password=SecurePass123!"
```

**Get Profile (requires token):**
```bash
TOKEN="your-jwt-token"
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Upload Image for Analysis:**
```bash
TOKEN="your-jwt-token"
curl -X POST http://localhost:8000/api/v1/analysis/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@selfie.jpg" \
  -F "latitude=37.7749" \
  -F "longitude=-122.4194"
```

### API Testing with Postman

1. Import the API.md examples
2. Set up environment variables:
   - `base_url`: http://localhost:8000
   - `token`: (get from login response)
3. Test all endpoints in sequence

### Browser Testing

**Browsers to test:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Test cases:**
- Responsive layout at 320px, 768px, 1024px, 1920px
- Touch interactions on mobile
- File upload on mobile camera
- Accessibility with screen reader
- Keyboard navigation
- Dark mode support

---

## Performance Testing

### Backend Load Testing

Using `locust`:

```bash
# Install
pip install locust

# Create locustfile.py
```

```python
# locustfile.py
from locust import HttpUser, task, between

class ProjectFaceUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # Login
        response = self.client.post("/api/v1/auth/login", data={
            "username": "test@example.com",
            "password": "SecurePass123!"
        })
        self.token = response.json()["access_token"]
    
    @task(3)
    def get_dashboard(self):
        self.client.get("/api/v1/auth/me", headers={
            "Authorization": f"Bearer {self.token}"
        })
    
    @task(1)
    def get_history(self):
        self.client.get("/api/v1/analysis/history", headers={
            "Authorization": f"Bearer {self.token}"
        })
```

```bash
# Run load test
locust -f locustfile.py --host http://localhost:8000

# Open http://localhost:8089 to configure and start
```

### Frontend Performance

**Lighthouse Audit:**
```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view
```

**Key Metrics to Check:**
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Total Blocking Time (TBT) < 200ms
- Cumulative Layout Shift (CLS) < 0.1

---

## Security Testing

### Automated Security Scan

```bash
# Using Trivy (in CI/CD)
trivy fs . --severity HIGH,CRITICAL

# Using Snyk
npm install -g snyk
snyk test

# Using Safety (Python)
pip install safety
safety check -r backend/requirements.txt
```

### Manual Security Checks

**SQL Injection Test:**
```bash
# Try to inject SQL in login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -F "username=admin' OR '1'='1" \
  -F "password=anything"
# Should fail with 401
```

**XSS Test:**
```bash
# Try to inject script in profile
curl -X PATCH http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"<script>alert(1)</script>"}'
# Should be sanitized
```

**CSRF Test:**
- Try API calls without proper headers
- Should fail with CORS error from different origin

**Rate Limit Test:**
```bash
# Hammer the API
for i in {1..200}; do
  curl http://localhost:8000/health &
done
wait
# Should get 429 Too Many Requests
```

### OWASP Top 10 Checklist

- [ ] A01: Broken Access Control
  - Auth required on protected routes
  - Users can only access own data
- [ ] A02: Cryptographic Failures
  - Passwords hashed with bcrypt
  - JWT tokens properly signed
  - HTTPS in production
- [ ] A03: Injection
  - SQL parameterized queries (SQLAlchemy)
  - Input validation with Pydantic
- [ ] A04: Insecure Design
  - Rate limiting implemented
  - Proper error messages (no stack traces in prod)
- [ ] A05: Security Misconfiguration
  - No debug mode in production
  - Secrets in environment variables
  - CORS properly configured
- [ ] A06: Vulnerable Components
  - Dependencies up to date
  - No known vulnerabilities (run `npm audit`, `pip-audit`)
- [ ] A07: Authentication Failures
  - Strong password requirements
  - JWT expiration
  - No password in URLs or logs
- [ ] A08: Software and Data Integrity
  - Integrity checks for uploads
  - File type validation
- [ ] A09: Logging Failures
  - Errors logged properly
  - Sensitive data not logged
- [ ] A10: SSRF
  - External URL validation
  - No user-controlled URLs

---

## Accessibility Testing

### Automated Tests

```bash
# Using axe-core
npx @axe-core/cli http://localhost:5173

# Using pa11y
npm install -g pa11y
pa11y http://localhost:5173
```

### Manual Tests

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces all content correctly
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AAA (7:1 for text)
- [ ] No flashing content
- [ ] Focus indicators visible
- [ ] Skip navigation link present
- [ ] Form labels properly associated
- [ ] Error messages accessible

**Screen Reader Testing:**
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA (free) or JAWS
- Test all pages and interactions

---

## CI/CD Testing

Tests run automatically on every push via GitHub Actions.

**View Results:**
1. Go to https://github.com/midnghtsapphire/project-face/actions
2. Click on latest workflow run
3. Review test results and coverage

**Local CI Simulation:**
```bash
# Run what CI runs
cd backend
python -m pytest app/tests/ -v --cov=app
ruff check app/

cd ../frontend
pnpm lint
pnpm test
pnpm build
```

---

## Test Data

### Sample Test Users

```
Email: test@example.com
Password: SecurePass123!
```

### Sample Test Images

Use any JPEG/PNG selfie image. Recommended:
- Size: 500KB - 2MB
- Resolution: 1080x1080 or higher
- Format: JPEG or PNG
- Content: Face clearly visible, good lighting

### Sample API Keys (for testing)

```
OPENAI_API_KEY=sk-test-fake-key (mock mode)
OPENWEATHER_API_KEY=test-key (returns mock data)
STRIPE_SECRET_KEY=sk_test_... (use Stripe test mode)
```

---

## Troubleshooting Tests

### Backend Tests Fail

```bash
# Check database connection
docker compose up -d postgres
psql postgresql://projectface:changeme@localhost:5432/projectface

# Reset test database
docker compose down -v
docker compose up -d postgres

# Check Python environment
python --version  # Should be 3.11+
pip list | grep fastapi
```

### Frontend Tests Fail

```bash
# Clear cache
rm -rf node_modules .vite
pnpm install

# Check Node version
node --version  # Should be 20+
pnpm --version  # Should be 9+
```

### Docker Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker compose build --no-cache
```

---

## Continuous Improvement

### Test Coverage Goals

- Backend: > 80% line coverage
- Frontend: > 70% line coverage
- Critical paths: 100% coverage

### When to Write Tests

- **Before** implementing new features (TDD)
- **After** fixing bugs (regression tests)
- **Always** for security-sensitive code

### Test Naming Convention

```python
def test_<feature>_<scenario>_<expected_result>():
    """
    Given: initial state
    When: action performed
    Then: expected outcome
    """
```

---

## Resources

- **pytest docs:** https://docs.pytest.org
- **Vitest docs:** https://vitest.dev
- **FastAPI testing:** https://fastapi.tiangolo.com/tutorial/testing/
- **React Testing Library:** https://testing-library.com/react
- **OWASP Testing Guide:** https://owasp.org/www-project-web-security-testing-guide/

---

**Part of the GlowStarLabs / Audrey Evans ecosystem.**
