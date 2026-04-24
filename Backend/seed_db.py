from app.database import SessionLocal, engine, Base
from app.models import Interaction
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    # Clear existing to ensure fresh state
    db.query(Interaction).delete()

    # Add demo entries
    demo_entries = [
        # Dr. Singh - History context
        Interaction(
            hcp_name="Dr. Navneet Singh",
            interaction_type="Meeting",
            date="2026-04-10",
            time="10:00 AM",
            attendees="Rep, Dr. Singh",
            topics_discussed="Initial presentation of CardioFlow software.",
            sentiment="Positive",
            outcomes="Dr. expressed interest in a pilot.",
            follow_up_actions="Set up demo account."
        ),
        Interaction(
            hcp_name="Dr. Navneet Singh",
            interaction_type="Call",
            date="2026-04-15",
            time="11:30 AM",
            attendees="Rep, Dr. Singh",
            topics_discussed="Feedback on CardioFlow pilot. Interface issues found.",
            sentiment="Neutral",
            outcomes="Logged bug reports for tech team.",
            follow_up_actions="Check on bug fix status."
        ),
        # Dr. Emily Chen - High potential
        Interaction(
            hcp_name="Dr. Emily Chen",
            interaction_type="Meeting",
            date="2026-04-20",
            time="3:00 PM",
            attendees="Rep, Dr. Chen, Nurse Sarah",
            topics_discussed="Pediatric vaccine logistics and cold chain storage.",
            sentiment="Positive",
            outcomes="Approved for hospital-wide adoption.",
            follow_up_actions="Coordinate delivery of first 500 units."
        ),
        # Dr. Marcus Thorne - Skeptical
        Interaction(
            hcp_name="Dr. Marcus Thorne",
            interaction_type="Call",
            date="2026-04-22",
            time="4:15 PM",
            attendees="Rep, Dr. Thorne",
            topics_discussed="Comparative study results against generic alternatives.",
            sentiment="Negative",
            outcomes="Requested peer-reviewed whitepapers.",
            follow_up_actions="Send the 2025 Efficacy Report."
        ),
        # Dr. Jai Mehta - New entry
        Interaction(
            hcp_name="Dr. Jai Mehta",
            interaction_type="Meeting",
            date="2026-04-23",
            time="9:30 AM",
            attendees="Rep, Dr. Jai Mehta, Nurse Anita",
            topics_discussed="Oncology drug trial updates and patient enrollment criteria.",
            sentiment="Positive",
            outcomes="Agreed to enroll 15 patients in Phase 3 trial.",
            follow_up_actions="Send trial protocol documents by Friday."
        ),
        # Dr. Priya Sharma - Fifth entry
        Interaction(
            hcp_name="Dr. Priya Sharma",
            interaction_type="Email",
            date="2026-04-21",
            time="2:00 PM",
            attendees="Rep, Dr. Sharma",
            topics_discussed="Dermatology product samples and pricing structure.",
            sentiment="Neutral",
            outcomes="Requested bulk pricing for clinic.",
            follow_up_actions="Prepare custom pricing proposal."
        )
    ]
    
    db.add_all(demo_entries)
    db.commit()
    print(f"Database seeded with {len(demo_entries)} detailed entries.")
    db.close()

if __name__ == "__main__":
    seed_db()
