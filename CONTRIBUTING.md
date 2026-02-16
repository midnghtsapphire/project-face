# Contributing to Project Face

Thank you for your interest in contributing to Project Face! This document provides guidelines for contributing to this project.

## Development Process

We follow a **dev → test → live** deployment process:

1. **Development** — Create a feature branch from `develop`
2. **Testing** — Submit a PR to `develop`, automated tests run via CI
3. **Production** — Merge to `main` after code review and QA

## Code Standards

### Backend (Python)

- Follow PEP 8 style guidelines
- Use type hints for all function signatures
- Write docstrings for all public functions
- Run `ruff check` before committing
- Add tests for new endpoints

### Frontend (TypeScript)

- Use TypeScript strict mode
- Follow React best practices (hooks, functional components)
- Ensure WCAG AAA accessibility compliance
- Add `aria-label` to all interactive elements
- Add `alt` text to all images

### Design Requirements

- **No blue light** — Use the warm earthy palette only
- **Glassmorphism** — Use `glass-card` and `glass-panel` classes
- **Mobile-first** — Design for mobile, then scale up
- **Neurodivergent-friendly** — No flashing, clean layouts, reduced motion support

## Getting Started

```bash
# Clone and setup
git clone https://github.com/MIDNGHTSAPPHIRE/project-face.git
cd project-face
cp .env.example .env

# Backend
cd backend && pip install -r requirements.txt
python -m pytest app/tests/ -v

# Frontend
cd frontend && pnpm install && pnpm dev
```

## Questions?

Reach out via the GlowStarLabs ecosystem:
- [rvvel.com](https://rvvel.com)
- [audreyevansofficial.com](https://audreyevansofficial.com)
