import datetime as _dt
from enum import Enum as _Enum
from uuid import uuid4 as _uuid

import sqlalchemy as _sql
from sqlalchemy.dialects.postgresql import UUID

import database as _database


class submissionStatus(str, _Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class Submission(_database.Base):
    __tablename__ = "submission"
    Submissionid = _sql.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    challenge_id = _sql.Column(
        UUID(as_uuid=True), _sql.ForeignKey("challenge.Challengeid"), nullable=False
    )
    user_id = _sql.Column(
        UUID(as_uuid=True), _sql.ForeignKey("user.Userid"), nullable=False
    )
    code_submitted = _sql.Column(_sql.Text, nullable=False)
    status = _sql.Column(_sql.Enum(submissionStatus), default=submissionStatus.pending)
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.utcnow, onupdate=_dt.datetime.utcnow
    )

    user = _sql.orm.relationship("User", back_populates="submission")
    challenge = _sql.orm.relationship("Challenge", back_populates="submission")
