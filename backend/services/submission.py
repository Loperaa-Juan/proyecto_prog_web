from typing import Optional

import sqlalchemy.orm as _orm
from fastapi import HTTPException

from models.challenge import Challenge
from models.submission import Submission
from schemas.user import User


async def create_submission(
    user: User,
    challenge_id: str,
    code: str,
    db: _orm.Session,
):
    submission_obj = Submission(
        user_id=user.Userid,
        challenge_id=challenge_id,
        code_submitted=code,
    )

    db.add(submission_obj)
    db.commit()
    db.refresh(submission_obj)
    return submission_obj


async def get_submission_by_id(
    submission_id: str,
    db: _orm.Session,
):
    return db.query(Submission).filter(Submission.Submissionid == submission_id).first()


async def get_submissions_by_challenge_id(
    challenge_id: str,
    db: _orm.Session,
    user: User,
):
    challenge_db = (
        db.query(Challenge).filter(Challenge.Challengeid == challenge_id).first()
    )

    # Solo el creador del desafío puede ver las entregas
    if user.Userid != challenge_db.Userid:
        raise HTTPException(
            status_code=403, detail="Not authorized to view submissions"
        )

    submissions = (
        db.query(Submission)
        .options(_orm.joinedload(Submission.user))
        .filter(Submission.challenge_id == challenge_id)
        .all()
    )

    return [
        {
            "Submissionid": str(s.Submissionid),
            "challenge_id": str(s.challenge_id),
            "user_id": str(s.user_id),
            "author_name": s.user.full_name if s.user else None,
            "code_submitted": s.code_submitted,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in submissions
    ]


async def update_submission_status(
    submission_id: str,
    status: str,
    db: _orm.Session,
    user: User,
):
    submission = (
        db.query(Submission).filter(Submission.Submissionid == submission_id).first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    challenge = (
        db.query(Challenge)
        .filter(Challenge.Challengeid == submission.challenge_id)
        .first()
    )
    if not challenge or user.Userid != challenge.Userid:
        raise HTTPException(status_code=403, detail="Not authorized")

    submission.status = status
    db.commit()
    db.refresh(submission)
    return {"Submissionid": str(submission.Submissionid), "status": submission.status}


async def get_submissions_by_user(
    user: User,
    db: _orm.Session,
):
    submissions = (
        db.query(Submission)
        .options(_orm.joinedload(Submission.challenge))
        .filter(Submission.user_id == user.Userid)
        .all()
    )

    return [
        {
            "Submissionid": str(s.Submissionid),
            "challenge_id": str(s.challenge_id),
            "challenge_title": s.challenge.title if s.challenge else None,
            "code_submitted": s.code_submitted,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in submissions
    ]


async def update_submission(
    user: User,
    submission_id: str,
    code: Optional[str],
    db: _orm.Session,
):
    submission = (
        db.query(Submission).filter(Submission.Submissionid == submission_id).first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if submission.user_id != user.Userid:
        raise HTTPException(status_code=403, detail="Not authorized")

    if code is not None:
        submission.code_submitted = code

    # En caso de actualizar el código, se restablece el estado a "pending" para que vuelva a ser evaluado
    status_enum = Submission.status.property.columns[0].type.enum_class
    submission.status = status_enum("pending")

    db.commit()
    db.refresh(submission)
    return {
        "Submissionid": str(submission.Submissionid),
        "challenge_id": str(submission.challenge_id),
        "code_submitted": submission.code_submitted,
        "status": submission.status,
        "created_at": submission.created_at.isoformat()
        if submission.created_at
        else None,
    }


async def delete_submission(
    user: User,
    submission_id: str,
    db: _orm.Session,
):
    submission = (
        db.query(Submission).filter(Submission.Submissionid == submission_id).first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Solo el autor de la entrega puede eliminarla
    if submission.user_id != user.Userid:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(submission)
    db.commit()
    return {"detail": "Submission deleted successfully"}
