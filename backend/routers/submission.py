from typing import Optional

import sqlalchemy.orm as _orm
from fastapi import APIRouter, Depends, Form

import schemas.user as _user
import services.user as _userServices
from services import database as _databaseServices
from services import submission as _submissionServices

router = APIRouter(prefix="/submissions", tags=["Submissions"])

# Submissions endpoints


# Ruta para obtener todas las submissions del usuario autenticado
@router.get("/me")
async def get_submissions_by_user(
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.get_submissions_by_user(user, db)


# Ruta para obtener todas las submissions de un challenge específico
@router.get("/{challenge_id}")
async def get_submissions_by_challenge_id(
    challenge_id: str,
    db: _orm.Session = Depends(_databaseServices.get_db),
    user: _user.User = Depends(_userServices.get_current_user),
):
    return await _submissionServices.get_submissions_by_challenge_id(
        challenge_id=challenge_id, db=db, user=user
    )


# Ruta para aprobar una submission (solo para el creador del challenge)
@router.post("/{submission_id}/accept")
async def accept_submission(
    submission_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.update_submission_status(
        submission_id, "accepted", db, user
    )


# Ruta para rechazar una submission (solo para el creador del challenge)
@router.post("/{submission_id}/reject")
async def reject_submission(
    submission_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.update_submission_status(
        submission_id, "rejected", db, user
    )


# Ruta para crear una nueva submission para un challenge específico
@router.post("/")
async def create_submission(
    challenge_id: str = Form(...),
    code: str = Form(...),
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.create_submission(
        user=user,
        challenge_id=challenge_id,
        code=code,
        db=db,
    )


# Ruta para actualizar una submission existente (solo para el autor de la submission)
@router.put("/{submission_id}")
async def update_submission(
    submission_id: str,
    code: Optional[str] = Form(None),
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.update_submission(
        user=user,
        submission_id=submission_id,
        code=code,
        db=db,
    )


# Ruta para eliminar una submission (solo para el autor de la submission)
@router.delete("/{submission_id}")
async def delete_submission(
    submission_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.delete_submission(
        user=user,
        submission_id=submission_id,
        db=db,
    )
