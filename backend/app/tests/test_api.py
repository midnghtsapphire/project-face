"""
Project Face — API Test Suite
"""
import io
import pytest


class TestHealthEndpoints:
    """Test root and health endpoints."""

    def test_root(self, client):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["app"] == "Project Face"
        assert data["status"] == "healthy"
        assert data["brand"] == "GlowStarLabs"

    def test_health(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


class TestAuthEndpoints:
    """Test authentication endpoints."""

    def test_register(self, client):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@test.com",
                "password": "SecurePass123!",
                "full_name": "New User",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "newuser@test.com"

    def test_register_duplicate_email(self, client):
        client.post(
            "/api/v1/auth/register",
            json={"email": "dup@test.com", "password": "SecurePass123!"},
        )
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "dup@test.com", "password": "SecurePass123!"},
        )
        assert response.status_code == 400

    def test_login(self, client):
        client.post(
            "/api/v1/auth/register",
            json={"email": "login@test.com", "password": "SecurePass123!"},
        )
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "login@test.com", "password": "SecurePass123!"},
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_login_wrong_password(self, client):
        client.post(
            "/api/v1/auth/register",
            json={"email": "wrong@test.com", "password": "SecurePass123!"},
        )
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "wrong@test.com", "password": "WrongPass!"},
        )
        assert response.status_code == 401

    def test_get_me(self, client, auth_headers):
        response = client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["email"] == "test@projectface.com"

    def test_update_me(self, client, auth_headers):
        response = client.patch(
            "/api/v1/auth/me",
            json={"full_name": "Updated Name", "latitude": 40.5853, "longitude": -105.0844},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["full_name"] == "Updated Name"

    def test_unauthorized_access(self, client):
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401


class TestAnalysisEndpoints:
    """Test skin analysis endpoints."""

    def test_analyze_skin(self, client, auth_headers):
        # Create a minimal valid JPEG
        image_data = (
            b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
            b'\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t'
            b'\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a'
            b'\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342'
            b'\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00'
            b'\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00'
            b'\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b'
            b'\xff\xda\x00\x08\x01\x01\x00\x00?\x00T\xdb\x9e\xa7\x93\xff\xd9'
        )
        response = client.post(
            "/api/v1/analysis/analyze",
            files={"image": ("test.jpg", io.BytesIO(image_data), "image/jpeg")},
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert "overall_score" in data
        assert "skin_type" in data
        assert "recommendations" in data

    def test_get_history(self, client, auth_headers):
        response = client.get("/api/v1/analysis/history", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_trends(self, client, auth_headers):
        response = client.get("/api/v1/analysis/history/trends", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestWeatherEndpoints:
    """Test weather endpoints."""

    def test_get_weather(self, client, auth_headers):
        response = client.post(
            "/api/v1/weather/current",
            json={"latitude": 40.5853, "longitude": -105.0844},
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert "temperature" in data
        assert "uv_index" in data
        assert "skin_advisory" in data

    def test_my_location_no_gps(self, client, auth_headers):
        response = client.get("/api/v1/weather/my-location", headers=auth_headers)
        assert response.status_code == 200


class TestTrialsEndpoints:
    """Test clinical trials endpoints."""

    def test_search_trials(self, client, auth_headers):
        response = client.post(
            "/api/v1/trials/search",
            json={"condition": "acne", "max_results": 5},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestSubscriptionEndpoints:
    """Test subscription endpoints."""

    def test_get_subscription_status(self, client, auth_headers):
        response = client.get("/api/v1/subscription/status", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["tier"] == "free"


class TestExtrasEndpoints:
    """Test medical tourism and eco metrics endpoints."""

    def test_medical_tourism(self, client, auth_headers):
        response = client.post(
            "/api/v1/medical-tourism",
            json={"condition": "acne", "preferred_region": "Asia"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_eco_metrics(self, client, auth_headers):
        response = client.get("/api/v1/eco-metrics", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_carbon_grams" in data
        assert "eco_rating" in data
