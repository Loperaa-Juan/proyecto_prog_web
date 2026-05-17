import datetime as _dt
from enum import Enum as _Enum
from uuid import uuid4 as _uuid

import sqlalchemy as _sql
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

import database as _database


class Difficulty(str, _Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Challenge(_database.Base):
    __tablename__ = "challenge"
    Challengeid = _sql.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    Userid = _sql.Column(
        UUID(as_uuid=True), _sql.ForeignKey("user.Userid"), nullable=False
    )
    title = _sql.Column(_sql.String, unique=True, index=True)
    description = _sql.Column(_sql.Text)
    difficulty: Mapped[Difficulty] = mapped_column(
        _sql.Enum(Difficulty), nullable=False
    )
    code_snippet = _sql.Column(_sql.Text)
    status = _sql.Column(_sql.String, default="active")
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.utcnow, onupdate=_dt.datetime.utcnow
    )

    user = _sql.orm.relationship("User", back_populates="challenges")
    submission = _sql.orm.relationship("Submission", back_populates="challenge")
