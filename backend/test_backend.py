import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from main import app, events_db
from budget import calculate_budget_limits
from prompts import build_event_prompt
from schemas import EventGenerationRequest, EventPlanResponse, ChatResponse

client = TestClient(app)


def test_calculate_budget_limits():
    """Test the deterministic budget allocation logic."""
    budget = 10000.0
    limits = calculate_budget_limits(budget)
    
    assert limits["venue"] == 2500.0
    assert limits["catering"] == 3500.0
    assert limits["decoration"] == 1500.0
    assert limits["cake"] == 700.0
    assert limits["activities"] == 800.0
    assert limits["contingency"] == 1000.0
    assert limits["total"] == budget


def test_build_event_prompt():
    """Test that event prompt is correctly constructed with input parameters."""
    event_data = EventGenerationRequest(
        event_type="Birthday Party",
        guests=50,
        location="Central Park",
        budget=10000.0,
        date="2026-09-15",
        start_time="17:00",
        description="Casual outdoor gathering",
        model="basic"
    )
    budget_limits = calculate_budget_limits(event_data.budget)
    prompt = build_event_prompt(event_data, budget_limits)
    
    assert "Birthday Party" in prompt
    assert "Central Park" in prompt
    assert "2500.0" in prompt  # Venue allocation
    assert "3500.0" in prompt  # Catering allocation


def test_root_endpoint():
    """Test the health check / root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "AI Event Planner API is running"
    }


@patch("main.generate_event_plan", new_callable=AsyncMock)
def test_generate_event_endpoint(mock_generate):
    """Test the /events/generate endpoint with a mocked AI service response."""
    # Define mock response structure matching the new schema
    mock_response = EventPlanResponse(
        id=1,
        event_type="Birthday Party",
        date="2026-09-15",
        location="Central Park",
        guests=50,
        budget=10000.0,
        invitation_image_url="https://placehold.co/500x700",
        invitation_text="You are invited to John's 30th Birthday Hula Party!",
        plan={
            "theme": {
                "concept": "Tropical Paradise",
                "colors": ["#00FF00", "#FF0000"],
                "activity_ideas": ["Limbo Dance", "Hula Hoop Contest"]
            },
            "budget": {
                "venue": 2500.0,
                "catering": 3500.0,
                "decoration": 1500.0,
                "cake": 700.0,
                "activities": 800.0,
                "contingency": 1000.0,
                "total": 10000.0
            },
            "checklist": [
                {"task": "Buy coconuts", "due_date": "2026-09-10", "status": "pending", "priority": "High"},
                {"task": "Send invitations", "due_date": "2026-09-12", "status": "pending", "priority": "Medium"}
            ],
            "schedule": [
                {"time": "5:00 PM", "activity": "Welcome drinks"},
                {"time": "7:00 PM", "activity": "Island dinner"}
            ]
        }
    )
    mock_generate.return_value = mock_response

    payload = {
        "event_type": "Birthday Party",
        "guests": 50,
        "location": "Central Park",
        "budget": 10000.0,
        "date": "2026-09-15",
        "start_time": "17:00",
        "description": "Casual outdoor gathering",
        "model": "basic"
    }

    response = client.post("/events/generate", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["plan"]["theme"]["concept"] == "Tropical Paradise"
    assert "Limbo Dance" in data["plan"]["theme"]["activity_ideas"]
    assert len(data["plan"]["schedule"]) == 2
    mock_generate.assert_called_once()


@patch("main.modify_event_plan", new_callable=AsyncMock)
def test_chat_modification_endpoint(mock_modify):
    """Test the /events/{eventId}/chat endpoint."""
    # Pre-populate db
    events_db[1] = EventPlanResponse(
        id=1,
        event_type="Birthday Party",
        date="2026-09-15",
        location="Central Park",
        guests=50,
        budget=10000.0,
        invitation_image_url="https://placehold.co/500x700",
        invitation_text="You are invited!",
        plan={
            "theme": {
                "concept": "Tropical Paradise",
                "colors": ["#00FF00", "#FF0000"],
                "activity_ideas": ["Limbo Dance"]
            },
            "budget": {
                "venue": 2500.0,
                "catering": 3500.0,
                "decoration": 1500.0,
                "cake": 700.0,
                "activities": 800.0,
                "contingency": 1000.0,
                "total": 10000.0
            },
            "checklist": [],
            "schedule": []
        }
    )

    mock_chat_response = ChatResponse(
        explanation="I updated the budget to reallocate ₹500 from contingency to activities.",
        id=1,
        event_type="Birthday Party",
        date="2026-09-15",
        location="Central Park",
        guests=50,
        budget=10000.0,
        invitation_image_url="https://placehold.co/500x700",
        invitation_text="You are invited!",
        plan={
            "theme": {
                "concept": "Tropical Paradise",
                "colors": ["#00FF00", "#FF0000"],
                "activity_ideas": ["Limbo Dance"]
            },
            "budget": {
                "venue": 2500.0,
                "catering": 3500.0,
                "decoration": 1500.0,
                "cake": 700.0,
                "activities": 1300.0,  # increased
                "contingency": 500.0,   # decreased
                "total": 10000.0
            },
            "checklist": [],
            "schedule": []
        }
    )
    mock_modify.return_value = mock_chat_response

    payload = {"message": "Reallocate 500 from contingency to activities"}
    response = client.post("/events/1/chat", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["explanation"] == "I updated the budget to reallocate ₹500 from contingency to activities."
    assert data["plan"]["budget"]["activities"] == 1300.0
    assert data["plan"]["budget"]["contingency"] == 500.0
    mock_modify.assert_called_once()
