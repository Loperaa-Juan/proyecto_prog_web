import sqlalchemy.orm as _orm

import schemas.user as user_schema
from models.challenge import Challenge, Difficulty


async def create_challenge(
    user: user_schema.User,
    title: str,
    description: str,
    difficulty: Difficulty,
    tags: list[str],
    db: _orm.session,
):
    challenge_obj = Challenge(
        title=title, description=description, difficulty=difficulty, tags=tags, Userid=user.Userid
    )

    db.add(challenge_obj)
    db.commit()
    db.refresh(challenge_obj)

    return challenge_obj
