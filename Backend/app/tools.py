from langchain_core.tools import tool
from typing import Optional

@tool
def log_interaction(
    hcp_name: str,
    interaction_type: str,
    date: str,
    time: str,
    topics_discussed: str,
    sentiment: str,
    attendees: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None
):
    """Logs a new interaction to the database."""
    # The db session will be injected by the tool_node
    return "Call log_interaction_impl with db"

@tool
def edit_interaction(interaction_id: Optional[int] = None, hcp_name: Optional[str] = None, updates: Optional[dict] = None):
    """Edits an existing interaction. 
    Provide interaction_id if known. 
    If id is unknown but hcp_name is provided, it will edit the MOST RECENT interaction for that HCP.
    """
    return "Call edit_interaction_impl with db"

@tool
def update_form_state(
    hcp_name: Optional[str] = None,
    interaction_type: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[str] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    sentiment: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None
):
    """Updates the frontend form fields based on the conversation.
    Pass only the fields that need updating.
    """
    # Create dictionary from local arguments, excluding None values
    form_updates = {k: v for k, v in locals().items() if v is not None and k != "form_data"}
    return form_updates

@tool
def search_hcp(query: str):
    """Searches for an HCP by name."""
    return "Call search_hcp_impl with db"

@tool
def get_interaction_history(hcp_name: str):
    """Retrieves the history of interactions with a specific HCP."""
    return "Call get_interaction_history_impl with db"

# Implementation functions that actually take the DB session
def log_interaction_impl(db, **kwargs):
    from .models import Interaction
    db_interaction = Interaction(**kwargs)
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return f"Successfully logged interaction with {db_interaction.hcp_name}."

def search_hcp_impl(db, query: str):
    from .models import Interaction
    from sqlalchemy import func
    # Search for HCPs and get some summary info
    results = db.query(
        Interaction.hcp_name,
        func.count(Interaction.id).label('interaction_count'),
        func.max(Interaction.date).label('last_interaction')
    ).filter(Interaction.hcp_name.contains(query)).group_by(Interaction.hcp_name).all()
    
    if not results:
        return "No HCP found with that name."
    
    return [
        {
            "hcp_name": r.hcp_name,
            "total_interactions": r.interaction_count,
            "last_contact": r.last_interaction
        } for r in results
    ]

def get_interaction_history_impl(db, hcp_name: str):
    from .models import Interaction
    history = db.query(Interaction).filter(Interaction.hcp_name == hcp_name).order_by(Interaction.date.desc()).all()
    if not history:
        return f"No prior history found for {hcp_name}."
    
    summary = f"History for {hcp_name}:\n"
    for h in history[:3]: # last 3
        summary += f"- [ID: {h.id}] {h.date}: {h.interaction_type} regarding {h.topics_discussed} (Sentiment: {h.sentiment})\n"
    return summary

def edit_interaction_impl(db, interaction_id: Optional[int], hcp_name: Optional[str], updates: dict):
    from .models import Interaction
    if interaction_id:
        db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    elif hcp_name:
        # Get the most recent one for this HCP
        db_interaction = db.query(Interaction).filter(Interaction.hcp_name == hcp_name).order_by(Interaction.date.desc()).first()
    else:
        return "Please provide either an interaction ID or an HCP name to find the record to edit."

    if not db_interaction:
        return "Interaction not found."
    
    for key, value in updates.items():
        if hasattr(db_interaction, key):
            setattr(db_interaction, key, value)
            
    db.commit()
    db.refresh(db_interaction)
    return f"Successfully updated interaction {db_interaction.id}."
