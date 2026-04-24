import os
from typing import Annotated, TypedDict, List, Union
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from .tools import (
    log_interaction, edit_interaction, update_form_state, search_hcp, get_interaction_history,
    log_interaction_impl, edit_interaction_impl, search_hcp_impl, get_interaction_history_impl
)
from .database import SessionLocal

# Load Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
llm = ChatGroq(
    temperature=0, 
    model_name="llama-3.3-70b-versatile", 
    groq_api_key=GROQ_API_KEY
)

# Define the agent state
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    form_data: dict
    session_id: str

# Define tools
tools = [log_interaction, edit_interaction, update_form_state, search_hcp, get_interaction_history]
llm_with_tools = llm.bind_tools(tools)

def call_model(state: AgentState):
    messages = state['messages']
    system_message = {
        "role": "system",
        "content": (
            "You are Aura, a high-performance AI Sales Assistant for medical representatives. "
            "Your personality is professional, efficient, and proactive. "
            "\n\nCRITICAL OUTPUT RULES:\n"
            "1. **Never Repeat Internal State**: You will be provided with a 'Current Form State'. This is for your INTERNAL EYES ONLY. "
            "   DO NOT repeat, echo, or quote this dictionary/JSON in your response. "
            "2. **Zero Technical Artifacts**: Never show tool tags like `<function>`, brackets `{}`, or internal keys like `'hcp_name'`. "
            "3. **Human-Only Language**: Speak like a premium executive assistant. "
            "\n\nYOUR GOALS:\n"
            "1. **Assist with Data Entry**: Use `update_form_state` to silently sync the frontend form. "
            "2. **Be Insightful**: When search results or history are found, offer brief, proactive insights. "
            "3. **Smart Form Filling**: If exactly one HCP is found, fill the 'hcp_name' field automatically. "
        )
    }
    # Provide the current form state to the LLM so it knows what's already filled
    current_form = state.get("form_data", {})
    context_msg = f"INTERNAL EYES ONLY (Current Form State): {current_form}"
    
    response = llm_with_tools.invoke([
        {"role": "system", "content": system_message["content"]},
        {"role": "system", "content": context_msg}
    ] + messages)
    return {"messages": [response]}

def tool_node(state: AgentState):
    last_message = state['messages'][-1]
    if not last_message.tool_calls:
        return {"messages": []}
    
    results = []
    form_updates = {}
    db = SessionLocal()
    try:
        for tool_call in last_message.tool_calls:
            tool_name = tool_call['name']
            args = tool_call['args']
            
            if tool_name == "update_form_state":
                form_updates.update(args)
                results.append(ToolMessage(content=f"Form fields updated: {', '.join(args.keys())}", tool_call_id=tool_call['id']))
            
            elif tool_name == "log_interaction":
                form_updates.update(args)
                res = log_interaction_impl(db, **args)
                results.append(ToolMessage(content=res, tool_call_id=tool_call['id']))
            
            elif tool_name == "edit_interaction":
                updates_dict = {k: v for k, v in args.get('updates', {}).items() if v is not None}
                form_updates.update(updates_dict)
                res = edit_interaction_impl(db, args.get('interaction_id'), args.get('hcp_name'), args.get('updates', {}))
                results.append(ToolMessage(content=res, tool_call_id=tool_call['id']))
            
            elif tool_name == "search_hcp":
                res = search_hcp_impl(db, args.get('query'))
                if isinstance(res, list) and len(res) == 1:
                    # If exactly one HCP found, auto-fill it
                    form_updates['hcp_name'] = res[0]['hcp_name']
                results.append(ToolMessage(content=str(res), tool_call_id=tool_call['id']))
            
            elif tool_name == "get_interaction_history":
                res = get_interaction_history_impl(db, args.get('hcp_name'))
                results.append(AIMessage(content=str(res), tool_call_id=tool_call['id']))
            
            else:
                results.append(ToolMessage(content=f"Tool {tool_name} not implemented.", tool_call_id=tool_call['id']))
                
        # Merge form updates into state
        current_form = state.get('form_data', {})
        # Filter out empty updates
        clean_updates = {k: v for k, v in form_updates.items() if v is not None and v != ""}
        new_form_data = {**current_form, **clean_updates}
        return {"messages": results, "form_data": new_form_data}
    finally:
        db.close()

def should_continue(state: AgentState):
    last_message = state['messages'][-1]
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"
    return END

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")
app_agent = workflow.compile()
