from sqlalchemy import Column, Integer, String, DateTime, Text, Enum
from .database import Base
import datetime
import enum

class Sentiment(enum.Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True)
    interaction_type = Column(String)
    date = Column(String)
    time = Column(String)
    attendees = Column(Text)
    topics_discussed = Column(Text)
    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    sentiment = Column(String, default="Neutral")
    outcomes = Column(Text)
    follow_up_actions = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
