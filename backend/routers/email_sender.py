import sqlalchemy.orm as _orm
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

import schemas.user as _user
import services.email as _emailServices
import services.user as _userServices
from services import database as _databaseServices

router = APIRouter(prefix="/emails", tags=["Email Notifications"])


class ChallengeSolvedPayload(BaseModel):
    destinatario: EmailStr
    user_name: str
    challenge_title: str
    solver_name: str


class ChallengeRejectedPayload(BaseModel):
    destinatario: EmailStr
    user_name: str
    challenge_title: str
    reviewer_name: str
    rejection_reason: str = "No cumple con los requisitos del challenge."


class ChallengeApprovedPayload(BaseModel):
    destinatario: EmailStr
    user_name: str
    challenge_title: str
    reviewer_name: str


def _get_service():
    if _emailServices.email_service is None:
        raise HTTPException(status_code=503, detail="El servicio de email no está disponible")
    return _emailServices.email_service


@router.post("/notify/solved")
def notify_challenge_solved(
    payload: ChallengeSolvedPayload,
    current_user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
    service=Depends(_get_service),
):
    service.send_challenge_solved(
        destinatario=payload.destinatario,
        user_name=payload.user_name,
        challenge_title=payload.challenge_title,
        solver_name=payload.solver_name,
    )
    return {"message": "Notificación de challenge resuelto enviada correctamente"}


@router.post("/notify/rejected")
def notify_challenge_rejected(
    payload: ChallengeRejectedPayload,
    current_user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
    service=Depends(_get_service),
):
    service.send_challenge_rejected(
        destinatario=payload.destinatario,
        user_name=payload.user_name,
        challenge_title=payload.challenge_title,
        reviewer_name=payload.reviewer_name,
        rejection_reason=payload.rejection_reason,
    )
    return {"message": "Notificación de rechazo enviada correctamente"}


@router.post("/notify/approved")
def notify_challenge_approved(
    payload: ChallengeApprovedPayload,
    current_user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
    service=Depends(_get_service),
):
    service.send_challenge_approved(
        destinatario=payload.destinatario,
        user_name=payload.user_name,
        challenge_title=payload.challenge_title,
        reviewer_name=payload.reviewer_name,
    )
    return {"message": "Notificación de aprobación enviada correctamente"}
