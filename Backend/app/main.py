from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from langchain_core.messages import HumanMessage, AIMessage
from .database import get_db
from .schemas import InteractionCreate, InteractionResponse, ChatRequest, ChatResponse
from .models import Interaction
from .agent import app_agent

app = FastAPI(title="HCP Interaction Log AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "HCP Log AI Backend is running"}

# In-memory session storage (use a DB/Redis for production)
chat_sessions = {}

import re
import json

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id
    
    # Get or initialize session history
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    
    # Append the new message to history
    chat_sessions[session_id].append(HumanMessage(content=request.message))
    
    # Initialize agent state with history
    state = {
        "messages": chat_sessions[session_id],
        "form_data": request.current_form_data or {},
        "session_id": session_id
    }
    
    # Run the LangGraph agent
    final_state = app_agent.invoke(state)
    
    # Update our session story with all new messages
    new_messages = final_state["messages"][len(chat_sessions[session_id]):]
    chat_sessions[session_id].extend(new_messages)
    
    # Find the last AI content
    ai_response = ""
    for msg in reversed(final_state["messages"]):
        if isinstance(msg, AIMessage) and msg.content:
            ai_response = msg.content
            break
    
    print(f"DEBUG: Raw AI Response: '{ai_response}'") # DEBUG PRINT
    
    updated_form_data = final_state.get("form_data", {})

    # FALLBACK: Detect if LLM typed out tags instead of using tool API
    # Matches <function(name)>{json_args}</function>
    function_tag_pattern = r'<function\((?P<name>\w+)\)>(?P<args>\{.*?\})</function>'
    matches = re.finditer(function_tag_pattern, ai_response, re.DOTALL)
    
    found_any = False
    for match in matches:
        found_any = True
        tool_name = match.group('name')
        args_str = match.group('args')
        try:
            args = json.loads(args_str)
            if tool_name == "update_form_state":
                updated_form_data.update(args)
            elif tool_name == "log_interaction":
                # Handle other tools if necessary
                pass
        except Exception as e:
            print(f"DEBUG: Error parsing fallback JSON for {tool_name}: {e}")
    
    if found_any:
        # Clean up the response from tags
        ai_response = re.sub(function_tag_pattern, "", ai_response, flags=re.DOTALL).strip()

    # If the response is now empty, give a default confirmation
    if not ai_response:
        ai_response = "I've updated the form with those details."

    return ChatResponse(
        response=ai_response,
        updated_form_data=updated_form_data
    )

@app.post("/interactions", response_model=InteractionResponse)
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.get("/interactions", response_model=List[InteractionResponse])
def list_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).all()
