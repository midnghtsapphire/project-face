# API Documentation — Project Face

Comprehensive API reference with examples for Project Face.

**Base URL (Production):** `https://api.projectface.com`  
**Base URL (Development):** `http://localhost:8000`

**Interactive Docs:** `/api/docs` (Swagger UI)  
**ReDoc:** `/api/redoc`

---

## Table of Contents

- [Authentication](#authentication)
- [Analysis](#analysis)
- [Weather](#weather)
- [Clinical Trials](#clinical-trials)
- [Medical Tourism](#medical-tourism)
- [Subscriptions](#subscriptions)
- [Eco Metrics](#eco-metrics)
- [Rate Limits](#rate-limits)
- [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Register

**POST** `/api/v1/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Jane Doe"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "subscription_tier": "free",
  "created_at": "2026-05-18T12:00:00Z"
}
```

**cURL Example:**
```bash
curl -X POST https://api.projectface.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Jane Doe"
  }'
```

---

### Login

**POST** `/api/v1/auth/login`

Get an access token.

**Request Body (form-data):**
```
username: user@example.com
password: SecurePassword123!
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**cURL Example:**
```bash
curl -X POST https://api.projectface.com/api/v1/auth/login \
  -F "username=user@example.com" \
  -F "password=SecurePassword123!"
```

---

### Get Current User

**GET** `/api/v1/auth/me`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "subscription_tier": "premium",
  "location": "San Francisco, CA",
  "created_at": "2026-01-15T10:30:00Z"
}
```

**cURL Example:**
```bash
curl -X GET https://api.projectface.com/api/v1/auth/me \
  -H "Authorization: Bearer <your-token>"
```

---

### Update Profile

**PATCH** `/api/v1/auth/me`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "location": "New York, NY"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Jane Smith",
  "location": "New York, NY",
  "subscription_tier": "premium"
}
```

---

## Analysis

### Analyze Image

**POST** `/api/v1/analysis/analyze`

Upload an image for AI-powered skin analysis.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
file: <image-file> (JPEG/PNG, max 10MB)
latitude: 37.7749 (optional)
longitude: -122.4194 (optional)
```

**Response (200):**
```json
{
  "id": 42,
  "user_id": 1,
  "created_at": "2026-05-18T14:30:00Z",
  "image_url": "/uploads/42_20260518143000.jpg",
  "scores": {
    "overall": 82,
    "hydration": 85,
    "texture": 78,
    "sun_damage": 90,
    "acne": 80,
    "pores": 75,
    "wrinkles": 88,
    "dark_circles": 70,
    "redness": 82
  },
  "analysis": {
    "summary": "Your skin shows good overall health with excellent hydration...",
    "concerns": ["Mild pore visibility", "Slight dark circles"],
    "strengths": ["Good hydration", "Low sun damage", "Minimal wrinkles"]
  },
  "recommendations": [
    {
      "type": "moisturizer",
      "name": "Hyaluronic Acid Serum",
      "reason": "Maintain excellent hydration levels"
    }
  ],
  "weather": {
    "temperature": 18.5,
    "humidity": 65,
    "uv_index": 3
  }
}
```

**cURL Example:**
```bash
curl -X POST https://api.projectface.com/api/v1/analysis/analyze \
  -H "Authorization: Bearer <token>" \
  -F "file=@selfie.jpg" \
  -F "latitude=37.7749" \
  -F "longitude=-122.4194"
```

**Python Example:**
```python
import requests

url = "https://api.projectface.com/api/v1/analysis/analyze"
headers = {"Authorization": "Bearer <token>"}
files = {"file": open("selfie.jpg", "rb")}
data = {"latitude": 37.7749, "longitude": -122.4194}

response = requests.post(url, headers=headers, files=files, data=data)
analysis = response.json()
print(f"Overall Score: {analysis['scores']['overall']}")
```

---

### Get Analysis History

**GET** `/api/v1/analysis/history`

Get all past analyses for the authenticated user.

**Query Parameters:**
```
skip: 0 (offset)
limit: 20 (max results)
```

**Response (200):**
```json
{
  "total": 5,
  "items": [
    {
      "id": 42,
      "created_at": "2026-05-18T14:30:00Z",
      "overall_score": 82,
      "image_url": "/uploads/42_20260518143000.jpg"
    },
    {
      "id": 41,
      "created_at": "2026-05-10T09:15:00Z",
      "overall_score": 78,
      "image_url": "/uploads/41_20260510091500.jpg"
    }
  ]
}
```

---

### Get Trend Data

**GET** `/api/v1/analysis/history/trends`

Get historical trend data for charts (last 30 days).

**Response (200):**
```json
{
  "dates": ["2026-04-18", "2026-05-01", "2026-05-10", "2026-05-18"],
  "overall": [75, 77, 78, 82],
  "hydration": [80, 82, 83, 85],
  "texture": [70, 73, 75, 78]
}
```

---

## Weather

### Get Weather by Coordinates

**POST** `/api/v1/weather/current`

Get current weather and UV index for specific coordinates.

**Request Body:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response (200):**
```json
{
  "location": "San Francisco, CA",
  "temperature": 18.5,
  "humidity": 65,
  "uv_index": 3,
  "description": "Partly cloudy",
  "icon": "02d",
  "recommendations": [
    "Apply SPF 30+ sunscreen",
    "Lightweight moisturizer recommended due to moderate humidity"
  ]
}
```

---

## Clinical Trials

### Search Trials

**POST** `/api/v1/trials/search`

Search ClinicalTrials.gov for dermatology studies.

**Request Body:**
```json
{
  "condition": "acne",
  "location": "California",
  "max_results": 10
}
```

**Response (200):**
```json
{
  "total_count": 45,
  "trials": [
    {
      "nct_id": "NCT12345678",
      "title": "Efficacy of Novel Acne Treatment",
      "status": "Recruiting",
      "phase": "Phase 2",
      "location": "Los Angeles, CA",
      "enrollment": 120,
      "summary": "This study evaluates the effectiveness of...",
      "contact_email": "study@example.com",
      "url": "https://clinicaltrials.gov/study/NCT12345678"
    }
  ]
}
```

---

### Get Trial Details

**GET** `/api/v1/trials/{nct_id}`

Get detailed information about a specific clinical trial.

**Response (200):**
```json
{
  "nct_id": "NCT12345678",
  "title": "Efficacy of Novel Acne Treatment",
  "status": "Recruiting",
  "phase": "Phase 2",
  "sponsor": "University Medical Center",
  "locations": [
    {
      "facility": "UCLA Medical Center",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90095"
    }
  ],
  "eligibility": {
    "min_age": 18,
    "max_age": 65,
    "gender": "All",
    "criteria": "- Moderate to severe acne\n- No systemic treatments in past 3 months"
  },
  "primary_outcome": "Reduction in acne lesions at 12 weeks",
  "enrollment": 120,
  "start_date": "2026-03-01",
  "completion_date": "2027-09-01"
}
```

---

## Medical Tourism

### Get Tourism Recommendations

**POST** `/api/v1/medical-tourism`

Get recommendations for dermatology clinics worldwide.

**Request Body:**
```json
{
  "budget": "medium",
  "procedure": "laser treatment"
}
```

**Response (200):**
```json
{
  "recommendations": [
    {
      "country": "South Korea",
      "city": "Seoul",
      "clinic": "Seoul Skin Clinic",
      "procedure": "Laser Resurfacing",
      "estimated_cost_usd": 1500,
      "quality_rating": 4.8,
      "why_recommended": "World-renowned for advanced laser treatments..."
    }
  ]
}
```

---

## Subscriptions

### Create Checkout Session

**POST** `/api/v1/subscription/checkout`

Create a Stripe checkout session for subscription.

**Request Body:**
```json
{
  "tier": "premium",
  "billing_cycle": "monthly"
}
```

**Response (200):**
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "session_id": "cs_test_abc123"
}
```

---

### Get Subscription Status

**GET** `/api/v1/subscription/status`

Get current subscription status.

**Response (200):**
```json
{
  "tier": "premium",
  "status": "active",
  "billing_cycle": "monthly",
  "current_period_end": "2026-06-18T00:00:00Z",
  "cancel_at_period_end": false
}
```

---

### Cancel Subscription

**POST** `/api/v1/subscription/cancel`

Cancel the current subscription (remains active until period end).

**Response (200):**
```json
{
  "message": "Subscription cancelled. Access until 2026-06-18.",
  "tier": "premium",
  "access_until": "2026-06-18T00:00:00Z"
}
```

---

## Eco Metrics

### Get Carbon Impact

**GET** `/api/v1/eco-metrics`

Get carbon efficiency metrics for your analyses.

**Response (200):**
```json
{
  "total_analyses": 15,
  "total_carbon_kg": 0.045,
  "avg_carbon_per_analysis_kg": 0.003,
  "trees_to_offset": 0.002,
  "comparison": "Your carbon footprint is 40% lower than average"
}
```

---

## Rate Limits

- **Default:** 100 requests per minute per IP
- **Analysis endpoint:** 10 uploads per hour (free tier), unlimited (premium)
- **Authentication:** 20 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

When rate limit is exceeded:

**Response (429):**
```json
{
  "detail": "Rate limit exceeded. Try again in 60 seconds."
}
```

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400  | Bad Request — Invalid input |
| 401  | Unauthorized — Invalid or missing token |
| 403  | Forbidden — Insufficient permissions |
| 404  | Not Found — Resource doesn't exist |
| 422  | Unprocessable Entity — Validation error |
| 429  | Too Many Requests — Rate limit exceeded |
| 500  | Internal Server Error — Something went wrong |

### Validation Error Example

**Response (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## SDKs & Libraries

### Python

```python
import requests

class ProjectFaceClient:
    def __init__(self, api_key):
        self.base_url = "https://api.projectface.com"
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    def analyze_image(self, image_path, lat=None, lon=None):
        url = f"{self.base_url}/api/v1/analysis/analyze"
        files = {"file": open(image_path, "rb")}
        data = {}
        if lat and lon:
            data = {"latitude": lat, "longitude": lon}
        response = requests.post(url, headers=self.headers, files=files, data=data)
        return response.json()

# Usage
client = ProjectFaceClient("your-token-here")
result = client.analyze_image("selfie.jpg", lat=37.7749, lon=-122.4194)
print(f"Overall Score: {result['scores']['overall']}")
```

### JavaScript/TypeScript

```typescript
class ProjectFaceClient {
  private baseUrl = "https://api.projectface.com";
  private headers: Record<string, string>;

  constructor(apiKey: string) {
    this.headers = {
      Authorization: `Bearer ${apiKey}`,
    };
  }

  async analyzeImage(file: File, lat?: number, lon?: number) {
    const formData = new FormData();
    formData.append("file", file);
    if (lat && lon) {
      formData.append("latitude", lat.toString());
      formData.append("longitude", lon.toString());
    }

    const response = await fetch(`${this.baseUrl}/api/v1/analysis/analyze`, {
      method: "POST",
      headers: this.headers,
      body: formData,
    });

    return response.json();
  }
}

// Usage
const client = new ProjectFaceClient("your-token-here");
const result = await client.analyzeImage(imageFile, 37.7749, -122.4194);
console.log(`Overall Score: ${result.scores.overall}`);
```

---

## Support

- **Documentation:** https://docs.projectface.com
- **GitHub:** https://github.com/midnghtsapphire/project-face
- **Email:** angelreporters@gmail.com
- **Hub:** https://rvvel.com

---

**Part of the GlowStarLabs / Audrey Evans ecosystem.**
