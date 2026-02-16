"""Initial schema

Revision ID: 001
Revises:
Create Date: 2026-02-15
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False, index=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("avatar_url", sa.Text(), nullable=True),
        sa.Column("subscription_tier", sa.String(20), server_default="free", nullable=False),
        sa.Column("stripe_customer_id", sa.String(255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(255), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_verified", sa.Boolean(), server_default="false"),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("timezone_str", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # Skin analyses table
    op.create_table(
        "skin_analyses",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("image_path", sa.Text(), nullable=False),
        sa.Column("thumbnail_path", sa.Text(), nullable=True),
        sa.Column("overall_score", sa.Float(), nullable=True),
        sa.Column("skin_type", sa.String(50), nullable=True),
        sa.Column("hydration_level", sa.Float(), nullable=True),
        sa.Column("texture_score", sa.Float(), nullable=True),
        sa.Column("sun_damage_score", sa.Float(), nullable=True),
        sa.Column("acne_severity", sa.Float(), nullable=True),
        sa.Column("wrinkle_score", sa.Float(), nullable=True),
        sa.Column("pigmentation_score", sa.Float(), nullable=True),
        sa.Column("redness_score", sa.Float(), nullable=True),
        sa.Column("pore_size_score", sa.Float(), nullable=True),
        sa.Column("conditions_detected", sa.JSON(), nullable=True),
        sa.Column("recommendations", sa.JSON(), nullable=True),
        sa.Column("product_recommendations", sa.JSON(), nullable=True),
        sa.Column("weather_data", sa.JSON(), nullable=True),
        sa.Column("uv_index", sa.Float(), nullable=True),
        sa.Column("humidity", sa.Float(), nullable=True),
        sa.Column("temperature", sa.Float(), nullable=True),
        sa.Column("analysis_model", sa.String(100), nullable=True),
        sa.Column("confidence_score", sa.Float(), nullable=True),
        sa.Column("carbon_cost_grams", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # Analysis history table
    op.create_table(
        "analysis_history",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("analysis_id", sa.Integer(), sa.ForeignKey("skin_analyses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=True),
        sa.Column("hydration_level", sa.Float(), nullable=True),
        sa.Column("texture_score", sa.Float(), nullable=True),
        sa.Column("sun_damage_score", sa.Float(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("recorded_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # Clinical trials cache
    op.create_table(
        "clinical_trials_cache",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("nct_id", sa.String(20), unique=True, nullable=False, index=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("status", sa.String(50), nullable=True),
        sa.Column("conditions", sa.JSON(), nullable=True),
        sa.Column("interventions", sa.JSON(), nullable=True),
        sa.Column("locations", sa.JSON(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("url", sa.Text(), nullable=True),
        sa.Column("last_updated", sa.DateTime(), server_default=sa.func.now()),
    )

    # Product recommendations
    op.create_table(
        "product_recommendations",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("brand", sa.String(255), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("affiliate_url", sa.Text(), nullable=True),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("price_range", sa.String(50), nullable=True),
        sa.Column("skin_types", sa.JSON(), nullable=True),
        sa.Column("conditions_targeted", sa.JSON(), nullable=True),
        sa.Column("rating", sa.Float(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # Eco metrics
    op.create_table(
        "eco_metrics",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True),
        sa.Column("action_type", sa.String(100), nullable=False),
        sa.Column("carbon_grams", sa.Float(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("recorded_at", sa.DateTime(), server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table("eco_metrics")
    op.drop_table("product_recommendations")
    op.drop_table("clinical_trials_cache")
    op.drop_table("analysis_history")
    op.drop_table("skin_analyses")
    op.drop_table("users")
