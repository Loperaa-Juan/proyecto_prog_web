import datetime as _dt
import uuid as _uuid

import pydantic as _pydantic


class _ChallengeBase(_pydantic.BaseModel):
    title: str
    description: str
    difficulty: str
    tags: list[str]


class ChallengeCreate(_ChallengeBase):
    Userid: _uuid.UUID

    model_config = _pydantic.ConfigDict(from_attributes=True)


class Challenge(_ChallengeBase):
    Challengeid: _uuid.UUID
    created_at: _dt.datetime
    updated_at: _dt.datetime
    Userid: _uuid.UUID

    model_config = _pydantic.ConfigDict(from_attributes=True)
