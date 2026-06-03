import datetime as _dt
from uuid import uuid4 as _uuid

import sqlalchemy as _sql
from passlib.context import CryptContext
from sqlalchemy.dialects.postgresql import UUID

import database as _database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(_database.Base):
    __tablename__ = "user"
    Userid = _sql.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    username = _sql.Column(_sql.String, unique=True, index=True)
    full_name = _sql.Column(_sql.String)
    email = _sql.Column(_sql.String, unique=True, index=True)
    password_hash = _sql.Column(_sql.String)
    streak = _sql.Column(_sql.Integer, default=0)
    last_login = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)
    active = _sql.Column(_sql.Boolean, default=True)

    challenges = _sql.orm.relationship("Challenge", back_populates="user")
    submission = _sql.orm.relationship("Submission", back_populates="user")

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password_hash)
