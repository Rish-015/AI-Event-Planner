from pydantic import BaseModel, Field

# =========================
# REQUEST SCHEMAS
# =========================

class EventGenerationRequest(BaseModel):
    event_type: str = Field(min_length=2, max_length=100)
    guests: int = Field(gt=0, le=100000)
    location: str = Field(min_length=2, max_length=200)
    budget: float = Field(gt=0)
    date: str
    start_time: str
    description: str
    model: str


class ChatRequest(BaseModel):
    message: str


# =========================
# RESPONSE SCHEMAS
# =========================

class ThemeSchema(BaseModel):
    concept: str
    colors: list[str]
    activity_ideas: list[str]


class BudgetSchema(BaseModel):
    venue: float
    catering: float
    decoration: float
    cake: float
    activities: float
    contingency: float
    total: float


class ChecklistItemSchema(BaseModel):
    task: str
    due_date: str
    status: str
    priority: str


class ScheduleItemSchema(BaseModel):
    time: str
    activity: str


class PlanSchema(BaseModel):
    theme: ThemeSchema
    budget: BudgetSchema
    checklist: list[ChecklistItemSchema]
    schedule: list[ScheduleItemSchema]


class EventPlanResponse(BaseModel):
    id: int
    event_type: str
    date: str
    location: str
    guests: int
    budget: float
    invitation_image_url: str
    invitation_text: str
    plan: PlanSchema


# Schema returned by Gemini during Chat modifications
class ChatResponse(BaseModel):
    explanation: str
    id: int
    event_type: str
    date: str
    location: str
    guests: int
    budget: float
    invitation_image_url: str
    invitation_text: str
    plan: PlanSchema