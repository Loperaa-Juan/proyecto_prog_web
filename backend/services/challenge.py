from typing import Optional

import sqlalchemy.orm as _orm
from fastapi import HTTPException
from sqlalchemy.orm import joinedload

import schemas.user as user_schema
from models.challenge import Challenge, Difficulty
from schemas.user import User as _user


async def create_challenge(
    user: user_schema.User,
    title: str,
    description: str,
    difficulty: Difficulty,
    tags: list[str],
    db: _orm.session,
):
    challenge_obj = Challenge(
        title=title,
        description=description,
        difficulty=difficulty,
        tags=tags,
        Userid=user.Userid,
    )

    db.add(challenge_obj)
    db.commit()
    db.refresh(challenge_obj)

    return challenge_obj


async def get_challenge_by_id(challenge_id: str, db: _orm.Session, user: _user):

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    challenge = (
        db.query(Challenge).filter(Challenge.Challengeid == challenge_id).first()
    )
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


async def get_challenges_by_user(user: _user, db: _orm.Session):

    challenges = db.query(Challenge).filter(Challenge.Userid == user.Userid).all()
    if not challenges:
        raise HTTPException(status_code=404, detail="No challenges found")
    resultado = []
    for challenge in challenges:
        resultado.append(
            {
                "id": challenge.Challengeid,
                "titulo": challenge.title,
                "contenido": challenge.description,
                "dificultad": challenge.difficulty,
            }
        )
    return resultado


async def get_all_challenges(db: _orm.Session):
    challenges = db.query(Challenge).options(joinedload(Challenge.user)).all()
    return [
        {
            "Challengeid": c.Challengeid,
            "title": c.title,
            "description": c.description,
            "difficulty": c.difficulty,
            "tags": c.tags,
            "status": c.status,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "Userid": c.Userid,
            "creator_name": c.user.full_name if c.user else None,
        }
        for c in challenges
    ]


async def update_challenge(
    user: _user,
    db: _orm.Session,
    title: Optional[str] = None,
    description: Optional[str] = None,
    difficulty: Optional[Difficulty] = None,
    tags: Optional[list[str]] = None,
    Challengeid: str = None,
):
    challenge_db = (
        db.query(Challenge).filter(Challenge.Challengeid == Challengeid).first()
    )

    if user.Userid != challenge_db.Userid:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to edit this publication",
        )

    if not challenge_db:
        raise HTTPException(status_code=404, detail="Publication not found")

    if title:
        challenge_db.title = title

    if difficulty:
        challenge_db.difficulty = difficulty

    if description:
        challenge_db.description = description

    if tags:
        challenge_db.tags = tags

    db.commit()
    db.refresh(challenge_db)

    return challenge_db


async def delete_challenge(user: _user, db: _orm.Session, Challengeid: str = None):
    challenge = db.query(Challenge).filter(Challenge.Challengeid == Challengeid).first()

    if user.Userid != challenge.Userid:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this publication",
        )

    if not challenge:
        raise HTTPException(status_code=404, detail="Publication not found")

    db.delete(challenge)
    db.commit()

    return {"message": "Challenge eliminado exitosamente"}
