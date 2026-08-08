import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from schemas import EventPlanResponse, ChatResponse


# Load environment variables
load_dotenv()


# Get API key
API_KEY = os.getenv("GEMINI_API_KEY")


if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in the .env file."
    )


# Create Gemini client
client = genai.Client(
    api_key=API_KEY
)


async def generate_event_plan(prompt: str):
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=EventPlanResponse,
            temperature=0.7,
        ),
    )

    if response.parsed is not None:
        return response.parsed

    raise RuntimeError(
        "Gemini returned an empty or invalid response."
    )


async def modify_event_plan(prompt: str):
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ChatResponse,
            temperature=0.7,
        ),
    )

    if response.parsed is not None:
        return response.parsed

    raise RuntimeError(
        "Gemini returned an empty or invalid response."
    )