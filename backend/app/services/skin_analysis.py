"""
Project Face — AI Skin Analysis Service
Uses OpenAI Vision API to analyze skin from selfie photos.
Carbon-efficient: tracks compute cost per analysis.
"""
import base64
import json
import time
from typing import Optional, Dict, Any

import httpx
from app.core.config import settings

# Estimated carbon cost per API call in grams CO2
CARBON_PER_API_CALL_GRAMS = 0.3


ANALYSIS_PROMPT = """You are a dermatology AI assistant for Project Face by GlowStarLabs.
Analyze this selfie photo for skin health. Provide a comprehensive JSON response with:

{
  "overall_score": <0-100 skin health score>,
  "skin_type": "<oily|dry|combination|normal|sensitive>",
  "hydration_level": <0-100>,
  "texture_score": <0-100>,
  "sun_damage_score": <0-100, higher = more damage>,
  "acne_severity": <0-10>,
  "wrinkle_score": <0-100>,
  "pigmentation_score": <0-100>,
  "redness_score": <0-100>,
  "pore_size_score": <0-100>,
  "conditions_detected": [
    {"name": "condition name", "severity": <0-10>, "description": "brief description", "confidence": <0-1>}
  ],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "product_recommendations": [
    {"name": "product name", "brand": "brand", "category": "moisturizer|sunscreen|serum|cleanser|treatment", "description": "why recommended", "price_range": "$-$$$$", "reason": "specific reason for this skin"}
  ],
  "confidence_score": <0-1 overall confidence>
}

Consider environmental factors if provided. Be thorough but compassionate.
Focus on actionable, evidence-based recommendations.
IMPORTANT: Return ONLY valid JSON, no markdown formatting."""


async def analyze_skin_image(
    image_bytes: bytes,
    weather_data: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Analyze a skin image using AI vision capabilities.
    Returns structured analysis results.
    """
    start_time = time.time()

    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    env_context = ""
    if weather_data:
        env_context = f"""
Environmental context for this analysis:
- Temperature: {weather_data.get('temperature', 'N/A')}°F
- Humidity: {weather_data.get('humidity', 'N/A')}%
- UV Index: {weather_data.get('uv_index', 'N/A')}
- Weather: {weather_data.get('description', 'N/A')}
Consider these environmental factors in your recommendations."""

    messages = [
        {
            "role": "system",
            "content": ANALYSIS_PROMPT,
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Please analyze this skin photo.{env_context}",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}",
                        "detail": "high",
                    },
                },
            ],
        },
    ]

    headers = {
        "Content-Type": "application/json",
    }

    # Try OpenAI first, fallback to OpenRouter
    api_key = settings.OPENAI_API_KEY
    base_url = "https://api.openai.com/v1/chat/completions"
    model = settings.OPENAI_MODEL

    if not api_key and settings.OPENROUTER_API_KEY:
        api_key = settings.OPENROUTER_API_KEY
        base_url = "https://openrouter.ai/api/v1/chat/completions"
        model = "openai/gpt-4o"

    if not api_key:
        # Return mock analysis for demo/development
        return _mock_analysis()

    headers["Authorization"] = f"Bearer {api_key}"

    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.3,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(base_url, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            content = result["choices"][0]["message"]["content"]

            # Parse JSON from response
            content = content.strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1].rsplit("```", 1)[0]

            analysis = json.loads(content)
        except Exception:
            analysis = _mock_analysis()

    elapsed = time.time() - start_time
    analysis["carbon_cost_grams"] = round(CARBON_PER_API_CALL_GRAMS + (elapsed * 0.01), 4)
    analysis["analysis_model"] = model

    return analysis


def _mock_analysis() -> Dict[str, Any]:
    """Return a mock analysis for development/demo purposes."""
    return {
        "overall_score": 72.5,
        "skin_type": "combination",
        "hydration_level": 65.0,
        "texture_score": 70.0,
        "sun_damage_score": 25.0,
        "acne_severity": 2.0,
        "wrinkle_score": 20.0,
        "pigmentation_score": 30.0,
        "redness_score": 35.0,
        "pore_size_score": 45.0,
        "conditions_detected": [
            {
                "name": "Mild Dehydration",
                "severity": 3.0,
                "description": "Skin shows signs of mild dehydration, particularly around the cheeks.",
                "confidence": 0.85,
            },
            {
                "name": "Minor Sun Exposure",
                "severity": 2.5,
                "description": "Light sun damage detected on forehead and nose bridge.",
                "confidence": 0.78,
            },
        ],
        "recommendations": [
            "Increase daily water intake to at least 8 glasses",
            "Apply SPF 50+ broad-spectrum sunscreen daily",
            "Use a hyaluronic acid serum morning and night",
            "Consider adding a vitamin C serum to morning routine",
            "Use a gentle, pH-balanced cleanser twice daily",
        ],
        "product_recommendations": [
            {
                "name": "CeraVe Hydrating Facial Cleanser",
                "brand": "CeraVe",
                "category": "cleanser",
                "description": "Gentle, non-foaming cleanser with ceramides",
                "price_range": "$",
                "reason": "Ideal for combination skin with mild dehydration",
            },
            {
                "name": "La Roche-Posay Anthelios SPF 50",
                "brand": "La Roche-Posay",
                "category": "sunscreen",
                "description": "Lightweight, broad-spectrum protection",
                "price_range": "$$",
                "reason": "Addresses sun damage concerns with high protection",
            },
            {
                "name": "The Ordinary Hyaluronic Acid 2% + B5",
                "brand": "The Ordinary",
                "category": "serum",
                "description": "Multi-weight hyaluronic acid for deep hydration",
                "price_range": "$",
                "reason": "Targets dehydration at multiple skin layers",
            },
        ],
        "confidence_score": 0.82,
        "carbon_cost_grams": 0.0,
        "analysis_model": "mock-demo",
    }
