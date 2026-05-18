# Project Face — AI-Powered Skin Analysis

<div align="center">

**Part of the GlowStarLabs / Audrey Evans Ecosystem**

[rvvel.com](https://rvvel.com) · [audreyevansofficial.com](https://audreyevansofficial.com) · [GlowStarLabs](https://glowstarlabs.com)

---

*AI-powered skin analysis that adapts to your environment. Personalized recommendations, progress tracking, clinical trials discovery — all in one place.*

[![CI/CD](https://github.com/midnghtsapphire/project-face/actions/workflows/ci.yml/badge.svg)](https://github.com/midnghtsapphire/project-face/actions)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

</div>

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | **This file** — Overview and quick start |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete production deployment guide |
| [API.md](API.md) | API documentation with examples |
| [TESTING.md](TESTING.md) | Testing guide for all levels |
| [SHIPPING.md](SHIPPING.md) | Pre-launch checklist |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributing guidelines |
| [SECURITY.md](SECURITY.md) | Security policy |

---

## Overview

Project Face is a comprehensive AI-powered skin analysis platform that combines computer vision, environmental data, and medical research to deliver personalized skincare insights. Upload a selfie and receive detailed analysis of your skin health including hydration, texture, sun damage, acne severity, and more — all personalized to your local weather conditions.

### Key Features

| Feature | Description |
|---------|-------------|
| **AI Skin Analysis** | Upload a selfie for comprehensive skin health scoring across 8+ dimensions |
| **GPS Personalization** | Local weather, UV index, and humidity factor into recommendations |
| **Clinical Trials Finder** | Search ClinicalTrials.gov for active dermatology studies |
| **Medical Tourism** | Discover world-class dermatology destinations |
| **Product Recommendations** | Evidence-based product suggestions with affiliate links |
| **Before/After Tracking** | Track skin health trends over time with visual charts |
| **Carbon Tracking** | Monitor the environmental impact of AI analyses |
| **Stripe Subscriptions** | Premium tier with advanced features |

### Design Philosophy

- **Warm Earthy Dark Theme** — Deep reds, forest greens, warm golds, earthy charcoal. No blue light.
- **Glassmorphism UI** — Frosted glass panels with subtle transparency.
- **WCAG AAA Accessibility** — Alt text everywhere, screen reader compatible, skip navigation, focus indicators.
- **Neurodivergent-Friendly** — Clean layout, no sensory overload, no flashing, reduced motion support.
- **Mobile-First Responsive** — Designed for mobile, scales beautifully to desktop.
- **Carbon-Efficient Code** — Optimized processing with eco impact tracking.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS + Vite |
| **Backend** | FastAPI (Python 3.11) + SQLAlchemy + Pydantic |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Reverse Proxy** | Nginx |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Payments** | Stripe |
| **AI/ML** | OpenAI Vision API |
| **Weather** | OpenWeatherMap API |
| **Clinical Data** | ClinicalTrials.gov API |

---

## Quick Start

### Prerequisites

- Docker & Docker Compose v2+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/MIDNGHTSAPPHIRE/project-face.git
cd project-face
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

Required API keys:

| Variable | Source | Required |
|----------|--------|----------|
| `OPENAI_API_KEY` | [OpenAI](https://platform.openai.com) | Yes (for AI analysis) |
| `OPENWEATHERMAP_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) | Yes (for weather) |
| `STRIPE_SECRET_KEY` | [Stripe](https://stripe.com) | For payments |
| `STRIPE_PUBLISHABLE_KEY` | [Stripe](https://stripe.com) | For payments |

### 3. Launch with Docker Compose

```bash
docker compose up --build -d
```

### 4. Access the Application

| Service | URL |
|---------|-----|
| **Application** | http://localhost |
| **API Docs** | http://localhost/api/v1/docs |
| **API Health** | http://localhost/api/v1/health |

---

## Development Setup

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend
pnpm install
pnpm dev
```

### Database

```bash
# Run PostgreSQL locally or via Docker
docker compose up postgres -d

# Apply migrations
cd backend
alembic upgrade head
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| GET | `/api/v1/auth/me` | Get current user profile |
| PATCH | `/api/v1/auth/me` | Update user profile |

### Skin Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/analysis/analyze` | Upload image for AI analysis |
| GET | `/api/v1/analysis/history` | Get analysis history |
| GET | `/api/v1/analysis/history/trends` | Get trend data for charts |
| GET | `/api/v1/analysis/{id}` | Get specific analysis |

### Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/weather/current` | Get weather by coordinates |
| GET | `/api/v1/weather/my-location` | Get weather for user's saved location |

### Clinical Trials

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/trials/search` | Search ClinicalTrials.gov |
| GET | `/api/v1/trials/{nct_id}` | Get trial details |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscription/checkout` | Create Stripe checkout session |
| GET | `/api/v1/subscription/status` | Get subscription status |
| POST | `/api/v1/subscription/cancel` | Cancel subscription |
| POST | `/api/v1/subscription/webhook` | Stripe webhook handler |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/medical-tourism` | Get tourism recommendations |
| GET | `/api/v1/eco-metrics` | Get carbon efficiency metrics |
| GET | `/api/v1/health` | Health check |

---

## Database Schema

The PostgreSQL schema includes:

- **users** — User accounts with subscription tiers and location
- **skin_analyses** — Full analysis results with 8+ skin metrics
- **analysis_history** — Trend tracking for before/after comparison
- **product_recommendations** — Cached product data with affiliate links
- **eco_metrics** — Carbon footprint tracking per analysis
- **stripe_events** — Payment event logging

See `database/init.sql` for the complete schema.

---

## Testing

```bash
cd backend
python -m pytest app/tests/ -v
```

Tests cover:
- Health check endpoint
- User registration and authentication
- Skin analysis upload and processing
- Weather data retrieval
- Clinical trials search
- Subscription management
- Eco metrics calculation

---

## Deployment

### Production Checklist

- [ ] Set strong `SECRET_KEY` in `.env`
- [ ] Configure real API keys (OpenAI, OpenWeatherMap, Stripe)
- [ ] Set up SSL certificates in `nginx/ssl/`
- [ ] Update `ALLOWED_ORIGINS` for your domain
- [ ] Configure Stripe webhook endpoint
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Review rate limiting settings

### Environment Variables

See `.env.example` for all configuration options.

---

## Project Structure

```
project-face/
├── backend/
│   ├── app/
│   │   ├── api/endpoints/     # FastAPI route handlers
│   │   ├── core/              # Config, security, database
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── services/          # Business logic (AI, weather, trials)
│   │   └── tests/             # Pytest test suite
│   ├── alembic/               # Database migrations
│   ├── uploads/               # User-uploaded images
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   ├── styles/            # Global CSS + Tailwind
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Helper functions
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql               # PostgreSQL schema
├── nginx/
│   ├── nginx.conf             # Reverse proxy config
│   └── ssl/                   # SSL certificates
├── .github/workflows/
│   └── ci.yml                 # CI/CD pipeline
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Attribution

This application integrates the following free and open-source APIs and services:

- **OpenAI Vision API** — AI-powered image analysis
- **OpenWeatherMap API** — Weather and UV data
- **ClinicalTrials.gov API** — Clinical trial data from the U.S. National Library of Medicine
- **Stripe** — Payment processing

All third-party integrations are provided by their respective free/open API tiers.

---

## License

Copyright © 2025-2026 GlowStarLabs / Audrey Evans. All rights reserved.

---

<div align="center">

**Built with care for accessibility, sustainability, and your skin.**

[GlowStarLabs](https://glowstarlabs.com) · [Rvvel Hub](https://rvvel.com) · [Audrey Evans](https://audreyevansofficial.com)

</div>

---

## Test

| Feature | Status |
|---------|--------|
| Feature | ✅ Ready |

