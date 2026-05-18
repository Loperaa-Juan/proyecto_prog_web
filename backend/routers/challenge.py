from typing import Optional

import sqlalchemy.orm as _orm
from fastapi import APIRouter, Depends, Form

import schemas.user as _user
import services.challenge as _challengeServices
import services.user as _userServices
from models.challenge import Difficulty
from services import database as _databaseServices

router = APIRouter(prefix="/challenges", tags=["Challenges"])


# Ruta para obtener los desafíos creados por el usuario autenticado
@router.get("/me")
async def get_challenges_by_user(
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.get_challenges_by_user(user, db)


# Ruta para obtener todos los desafíos disponibles
@router.get("/")
async def get_all_challenges(db: _orm.Session = Depends(_databaseServices.get_db)):
    return await _challengeServices.get_all_challenges(db)


# Ruta para obtener un desafío específico por su ID
@router.get("/{challenge_id}")
async def get_challenge_by_id(
    challenge_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.get_challenge_by_id(challenge_id, db, user)


# Ruta para crear un nuevo desafío
@router.post("/")
async def create_challenge(
    title: str = Form(...),
    description: str = Form(...),
    difficulty: Difficulty = Form(...),
    tags: list[str] = Form(...),
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.create_challenge(
        user, title, description, difficulty, tags, db
    )


# Ruta para actualizar un desafío existente
@router.put("/{challenge_id}")
async def update_challenge(
    challenge_id: str,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    difficulty: Optional[Difficulty] = Form(None),
    tags: Optional[list[str]] = Form(None),
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.update_challenge(
        Challengeid=challenge_id,
        user=user,
        db=db,
        title=title,
        description=description,
        difficulty=difficulty,
        tags=tags,
    )


# Ruta para eliminar un desafío
@router.delete("/{challenge_id}")
async def delete_challenge(
    challenge_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.delete_challenge(
        Challengeid=challenge_id,
        user=user,
        db=db,
    )
