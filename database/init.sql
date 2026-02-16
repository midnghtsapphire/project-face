-- ============================================================
-- Project Face — PostgreSQL Database Schema
-- AI-Powered Skin Analysis by GlowStarLabs
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(320) UNIQUE NOT NULL,
    hashed_password VARCHAR(256) NOT NULL,
    full_name       VARCHAR(200),
    avatar_url      TEXT,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'professional')),
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- ─── Skin Analyses ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skin_analyses (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_path          TEXT,
    overall_score       REAL,
    skin_type           VARCHAR(50),
    hydration_level     REAL,
    texture_score       REAL,
    sun_damage_score    REAL,
    acne_severity       REAL,
    wrinkle_score       REAL,
    pigmentation_score  REAL,
    redness_score       REAL,
    pore_size_score     REAL,
    conditions_detected JSONB DEFAULT '[]',
    recommendations     JSONB DEFAULT '[]',
    product_recommendations JSONB DEFAULT '[]',
    weather_data        JSONB,
    uv_index            REAL,
    humidity            REAL,
    temperature         REAL,
    confidence_score    REAL,
    model_version       VARCHAR(50),
    processing_time_ms  INTEGER,
    carbon_cost_grams   REAL,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON skin_analyses(user_id);
CREATE INDEX idx_analyses_created ON skin_analyses(created_at DESC);
CREATE INDEX idx_analyses_user_created ON skin_analyses(user_id, created_at DESC);

-- ─── Analysis History (for trend tracking) ──────────────────
CREATE TABLE IF NOT EXISTS analysis_history (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_id     INTEGER NOT NULL REFERENCES skin_analyses(id) ON DELETE CASCADE,
    overall_score   REAL,
    hydration_level REAL,
    texture_score   REAL,
    sun_damage_score REAL,
    notes           TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_user ON analysis_history(user_id);
CREATE INDEX idx_history_user_recorded ON analysis_history(user_id, recorded_at DESC);

-- ─── Product Recommendations Cache ──────────────────────────
CREATE TABLE IF NOT EXISTS product_recommendations (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    brand           VARCHAR(100),
    category        VARCHAR(100),
    description     TEXT,
    affiliate_url   TEXT,
    price_range     VARCHAR(50),
    conditions      JSONB DEFAULT '[]',
    skin_types      JSONB DEFAULT '[]',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Eco Metrics ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eco_metrics (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_id     INTEGER REFERENCES skin_analyses(id) ON DELETE SET NULL,
    carbon_grams    REAL NOT NULL DEFAULT 0,
    processing_type VARCHAR(50),
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_eco_user ON eco_metrics(user_id);

-- ─── Stripe Events Log ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS stripe_events (
    id              SERIAL PRIMARY KEY,
    event_id        VARCHAR(100) UNIQUE NOT NULL,
    event_type      VARCHAR(100) NOT NULL,
    payload         JSONB,
    processed       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
