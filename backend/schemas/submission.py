import datetime as _dt
import uuid as _uuid

import pydantic as _pydantic


class SubmissionBase(_pydantic.BaseModel):
    user_id: _uuid.UUID = _pydantic.Field(alias="Userid")
    challenge_id: _uuid.UUID = _pydantic.Field(alias="Challengeid")
    code_submitted: str

    model_config = _pydantic.ConfigDict(populate_by_name=True)


class SubmissionCreate(SubmissionBase):
    pass


class Submission(SubmissionBase):
    submission_id: _uuid.UUID = _pydantic.Field(alias="Submissionid")
    created_at: _dt.datetime
    status: str

    model_config = _pydantic.ConfigDict(from_attributes=True, populate_by_name=True)
