from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse

from schemas import EventGenerationRequest, ChatRequest, EventPlanResponse
from budget import calculate_budget_limits
from prompts import build_event_prompt, build_chat_prompt
from ai_service import generate_event_plan, modify_event_plan


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="AI Event Planner API",
    description="AI-powered event planning backend",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory database to persist event plans
events_db = {}


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "AI Event Planner API is running"
    }


# ==========================================
# GENERATE EVENT PLAN
# ==========================================

@app.post("/events/generate")
async def generate_event(event: EventGenerationRequest):
    try:
        # STEP 1: Calculate budget limits
        budget_limits = calculate_budget_limits(budget=event.budget)

        # STEP 2: Build AI prompt
        prompt = build_event_prompt(
            event=event,
            budget_limits=budget_limits
        )

        # STEP 3: Call Gemini
        result = await generate_event_plan(prompt)

        # Ensure correct request parameters are saved in the plan
        result.id = 1
        result.event_type = event.event_type
        result.date = event.date
        result.location = event.location
        result.guests = event.guests
        result.budget = event.budget

        # Construct dynamic AI-generated image URL via Pollinations based on theme concept
        concept = result.plan.theme.concept
        encoded_prompt = urllib.parse.quote(f"invitation card for {event.event_type}, theme: {concept}, elegant, high resolution, graphic design, 4k")
        result.invitation_image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=500&height=700&nologo=true"

        # Save to DB
        events_db[result.id] = result

        return result

    except Exception as error:
        print("ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate event plan: {str(error)}"
        )


# ==========================================
# CHAT MODIFICATION
# ==========================================

@app.post("/events/{eventId}/chat")
async def chat_event_modification(eventId: int, request: ChatRequest):
    try:
        # Retrieve current plan
        current_plan = events_db.get(eventId)
        if not current_plan:
            raise HTTPException(status_code=404, detail="Event plan not found.")

        # Serialize current plan to JSON string for the prompt
        current_plan_json = current_plan.model_dump_json(indent=2)

        # Build prompt
        prompt = build_chat_prompt(current_plan_json, request.message)

        # Call Gemini to modify the plan
        result = await modify_event_plan(prompt)

        # Keep metadata IDs matching
        result.id = eventId

        # Construct dynamic AI-generated image URL via Pollinations based on theme concept
        concept = result.plan.theme.concept
        encoded_prompt = urllib.parse.quote(f"invitation card for {result.event_type}, theme: {concept}, elegant, high resolution, graphic design, 4k")
        result.invitation_image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=500&height=700&nologo=true"

        # Update in-memory db
        plan_dict = result.model_dump()
        plan_dict.pop("explanation", None)
        
        updated_plan = EventPlanResponse(**plan_dict)
        events_db[eventId] = updated_plan

        return result

    except HTTPException as he:
        raise he
    except Exception as error:
        print("ERROR in chat:", error)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update event plan: {str(error)}"
        )