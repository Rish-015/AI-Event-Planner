def build_event_prompt(event, budget_limits):
    prompt = f"""
You are an expert AI Event Planning Assistant.

Your job is to create a realistic and useful event plan based on the user's requirements.

========================
EVENT INFORMATION
========================

Event Type:
{event.event_type}

Date:
{event.date}

Start Time:
{event.start_time}

Number of Guests:
{event.guests}

Total Budget:
{event.budget}

Location:
{event.location}

User Request / Description:
{event.description}


========================
BUDGET CONSTRAINTS
========================

Use these recommended limits for planning, but you can adjust them slightly if the description demands it:
- Venue: {budget_limits["venue"]}
- Catering: {budget_limits["catering"]}
- Decoration: {budget_limits["decoration"]}
- Cake: {budget_limits["cake"]}
- Activities: {budget_limits["activities"]}
- Contingency: {budget_limits["contingency"]}


========================
TASK
========================

Generate the structured JSON plan matching the requested EventPlanResponse schema:
1. theme:
   - concept: A creative theme concept based on the description.
   - colors: A list of 3-5 hex color codes representing the theme palette.
   - activity_ideas: A list of 3-5 fun activities matching the event type and vibe.
2. budget: Allocation for venue, catering, decoration, cake, activities, contingency, total. (Must sum exactly to total budget).
3. checklist: 4-6 preparation tasks, each with a task name, due_date (estimated relative to event date), status ("pending"), and priority ("High", "Medium", or "Low").
4. schedule: 4-6 timeline items covering setup, key activities, meals/cake, and closing. Use 12-hour format (e.g. "5:00 PM", "6:30 PM").
5. invitation_text: A personalized, engaging, and friendly text invitation message (3-5 sentences) that includes the event name/type, date, location, and theme, written in a style that matches the vibe (ready to copy and share).

========================
IMPORTANT RULES
========================
- Return ONLY the requested structured JSON matching the EventPlanResponse schema.
- Ensure the invitation_image_url is a placeholder like "https://placehold.co/500x700".
- Ensure the invitation_text is populated with the generated invitation message.
- Id must be set to 1.
"""
    return prompt


def build_chat_prompt(current_plan_json: str, chat_message: str):
    prompt = f"""
You are an expert AI Event Planning Assistant.

The user has a current event plan and wants to make modifications.

========================
CURRENT PLAN (JSON)
========================
{current_plan_json}

========================
USER MODIFICATION REQUEST
========================
{chat_message}

========================
TASK
========================
Modify the current plan based on the user's request.
Return the updated plan matching the ChatResponse schema:
1. explanation: A concise, friendly 1-2 sentence message to the user explaining what changes were made (e.g. "I've reallocated ₹3,000 from Catering to Activities as requested.").
2. The rest of the fields must match the modified event plan. Keep all unmodified details the same.
"""
    return prompt