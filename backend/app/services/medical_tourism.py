"""
Project Face — Medical Tourism Recommendations Service
Provides curated dermatology medical tourism destinations.
"""
from typing import Optional, List, Dict, Any

# Curated medical tourism destinations for dermatology
DESTINATIONS = [
    {
        "destination": "Seoul, South Korea",
        "country": "South Korea",
        "specialties": ["K-beauty treatments", "Laser therapy", "Skin rejuvenation", "Acne scar treatment"],
        "estimated_cost_range": "$1,500 - $8,000",
        "quality_rating": 9.5,
        "description": "World capital of skincare innovation. South Korea leads in advanced dermatological procedures with cutting-edge technology and highly trained specialists.",
        "facilities": ["Gangnam Severance Hospital", "Seoul National University Hospital", "ID Hospital"],
        "travel_advisory": "Visa-free for many countries. Excellent public transit. English widely spoken in medical facilities.",
    },
    {
        "destination": "Bangkok, Thailand",
        "country": "Thailand",
        "specialties": ["Skin whitening", "Anti-aging", "Dermal fillers", "Chemical peels"],
        "estimated_cost_range": "$800 - $5,000",
        "quality_rating": 8.8,
        "description": "Thailand is a global medical tourism hub with JCI-accredited hospitals offering world-class dermatology at a fraction of Western prices.",
        "facilities": ["Bumrungrad International Hospital", "Bangkok Hospital", "Samitivej Hospital"],
        "travel_advisory": "Visa on arrival for many nationalities. Tropical climate — plan for humidity effects on skin.",
    },
    {
        "destination": "Istanbul, Turkey",
        "country": "Turkey",
        "specialties": ["Hair transplant", "Skin grafting", "Psoriasis treatment", "Eczema therapy"],
        "estimated_cost_range": "$1,000 - $6,000",
        "quality_rating": 8.5,
        "description": "Turkey has emerged as a leading destination for dermatological procedures, combining European standards with competitive pricing.",
        "facilities": ["Acibadem Healthcare Group", "Memorial Hospital", "Liv Hospital"],
        "travel_advisory": "E-visa available online. Rich cultural experience alongside treatment.",
    },
    {
        "destination": "Mexico City, Mexico",
        "country": "Mexico",
        "specialties": ["Skin cancer treatment", "Cosmetic dermatology", "Laser treatments", "Microneedling"],
        "estimated_cost_range": "$500 - $4,000",
        "quality_rating": 8.2,
        "description": "Proximity to the US makes Mexico an accessible option for quality dermatological care at significantly lower costs.",
        "facilities": ["Hospital Angeles", "Médica Sur", "ABC Medical Center"],
        "travel_advisory": "No visa needed for US/Canadian citizens. Short flight from most US cities.",
    },
    {
        "destination": "Mumbai, India",
        "country": "India",
        "specialties": ["Vitiligo treatment", "Ayurvedic skin therapy", "Pigmentation treatment", "Acne treatment"],
        "estimated_cost_range": "$300 - $3,000",
        "quality_rating": 8.0,
        "description": "India offers a unique blend of modern dermatology and traditional Ayurvedic approaches, with some of the most affordable prices globally.",
        "facilities": ["Kokilaben Dhirubhai Ambani Hospital", "Jaslok Hospital", "Hinduja Hospital"],
        "travel_advisory": "E-visa available. Consider combining treatment with wellness retreat.",
    },
    {
        "destination": "Budapest, Hungary",
        "country": "Hungary",
        "specialties": ["Thermal spa therapy", "Psoriasis treatment", "Anti-aging", "Rosacea treatment"],
        "estimated_cost_range": "$1,200 - $5,500",
        "quality_rating": 8.7,
        "description": "Hungary's thermal baths have been used for skin therapy for centuries. Modern clinics combine this heritage with cutting-edge dermatology.",
        "facilities": ["Semmelweis University Clinic", "Duna Medical Center", "Thermal Hotel Margitsziget"],
        "travel_advisory": "EU member — easy access for European travelers. Famous thermal baths aid recovery.",
    },
    {
        "destination": "Tel Aviv, Israel",
        "country": "Israel",
        "specialties": ["Dead Sea therapy", "Psoriasis treatment", "Skin cancer research", "Innovative biologics"],
        "estimated_cost_range": "$2,000 - $10,000",
        "quality_rating": 9.2,
        "description": "Israel is at the forefront of dermatological research. Dead Sea treatments for psoriasis and eczema are world-renowned.",
        "facilities": ["Sheba Medical Center", "Ichilov Hospital", "Dead Sea Clinics"],
        "travel_advisory": "Advanced security screening at airports. Dead Sea treatments often covered by some insurance plans.",
    },
]


async def get_recommendations(
    condition: str,
    budget_range: Optional[str] = None,
    preferred_region: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Get medical tourism recommendations based on skin condition and preferences.
    """
    results = []
    condition_lower = condition.lower()

    for dest in DESTINATIONS:
        relevance = 0

        # Check specialty match
        for specialty in dest["specialties"]:
            if condition_lower in specialty.lower():
                relevance += 3
            elif any(word in specialty.lower() for word in condition_lower.split()):
                relevance += 1

        # Check region preference
        if preferred_region:
            region_lower = preferred_region.lower()
            if region_lower in dest["country"].lower() or region_lower in dest["destination"].lower():
                relevance += 2

        # Always include some results
        relevance += 1

        results.append({**dest, "_relevance": relevance})

    # Sort by relevance, then quality rating
    results.sort(key=lambda x: (-x["_relevance"], -x["quality_rating"]))

    # Remove internal relevance score
    for r in results:
        r.pop("_relevance", None)

    return results[:5]
