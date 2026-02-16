"""
Project Face — ClinicalTrials.gov Integration
Uses the public ClinicalTrials.gov v2 API to find relevant dermatology trials.
"""
from typing import Optional, List, Dict, Any
import httpx

BASE_URL = "https://clinicaltrials.gov/api/v2/studies"


async def search_clinical_trials(
    condition: str = "skin",
    location: Optional[str] = None,
    status: str = "RECRUITING",
    max_results: int = 10,
) -> List[Dict[str, Any]]:
    """
    Search ClinicalTrials.gov for relevant dermatology clinical trials.
    """
    params = {
        "query.cond": condition,
        "filter.overallStatus": status,
        "pageSize": min(max_results, 50),
        "format": "json",
        "fields": (
            "NCTId,BriefTitle,OverallStatus,Condition,InterventionName,"
            "LocationCity,LocationState,LocationCountry,BriefSummary,StudyType"
        ),
    }

    if location:
        params["query.locn"] = location

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()

            studies = data.get("studies", [])
            results = []

            for study in studies:
                protocol = study.get("protocolSection", {})
                id_module = protocol.get("identificationModule", {})
                status_module = protocol.get("statusModule", {})
                conditions_module = protocol.get("conditionsModule", {})
                interventions_module = protocol.get("armsInterventionsModule", {})
                contacts_module = protocol.get("contactsLocationsModule", {})
                desc_module = protocol.get("descriptionModule", {})

                nct_id = id_module.get("nctId", "")
                title = id_module.get("briefTitle", "Unknown Trial")
                trial_status = status_module.get("overallStatus", "Unknown")
                conditions = conditions_module.get("conditions", [])

                interventions = []
                for arm in interventions_module.get("interventions", []):
                    interventions.append(arm.get("name", ""))

                locations = []
                for loc in contacts_module.get("locations", []):
                    locations.append({
                        "facility": loc.get("facility", ""),
                        "city": loc.get("city", ""),
                        "state": loc.get("state", ""),
                        "country": loc.get("country", ""),
                    })

                summary = desc_module.get("briefSummary", "")

                results.append({
                    "nct_id": nct_id,
                    "title": title,
                    "status": trial_status,
                    "conditions": conditions,
                    "interventions": interventions,
                    "locations": locations[:5],
                    "summary": summary,
                    "url": f"https://clinicaltrials.gov/study/{nct_id}",
                })

            return results

    except Exception as e:
        # Return empty list on error — graceful degradation
        return []


async def get_trial_details(nct_id: str) -> Optional[Dict[str, Any]]:
    """Fetch detailed information about a specific clinical trial."""
    url = f"{BASE_URL}/{nct_id}"
    params = {"format": "json"}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
    except Exception:
        return None
