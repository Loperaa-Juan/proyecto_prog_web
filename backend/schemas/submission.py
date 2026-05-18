import datetime as _dt
import uuid as _uuid

import pydantic as _pydantic


class SubmissionBase(_pydantic.BaseModel):
    Userid: _uuid.UUID
    Challengeid: _uuid.UUID
    code_submitted: str


class SubmissionCreate(SubmissionBase):
    pass


class Submission(SubmissionBase):
    Submissionid: _uuid.UUID
    created_at: _dt.datetime
    status: str

    model_config = _pydantic.ConfigDict(from_attributes=True)
