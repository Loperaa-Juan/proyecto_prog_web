import os
from datetime import datetime, timedelta, timezone
from typing import Union

import fastapi.security as _security
import sqlalchemy.orm as _orm
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext

import schemas.user as user_schema

# import models.user as _User
from models.user import User as _User
from services.database import get_db

load_dotenv()

# Crea el contexto para hashing con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

OAuth2_scheme = _security.OAuth2PasswordBearer("/api/auth/token")


JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("HASHING_ALGORITHM")


async def get_user_by_username(username: str, db: _orm.Session):
    return db.query(_User).filter(_User.username == username).first()


async def create_user(user: user_schema.UserCreate, db: _orm.Session):
    user_obj = _User(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        password_hash=pwd_context.hash(user.password_hash),
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


# Función para actualizar el streak del usuario
def _update_streak(user: _User, now: datetime) -> None:
    today = now.date()
    last = user.last_login.date() if user.last_login else None

    # En caso de que el usuario no haya iniciado sesión antes o haya pasado más de un día desde su último inicio de sesión, reiniciamos el streak a 1.
    if last is None or (today - last).days > 1:
        user.streak = 1
    elif (today - last).days == 1:
        user.streak += 1

    user.last_login = now


async def authenticate_user(username: str, password: str, db: _orm.Session):
    user = await get_user_by_username(db=db, username=username)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.verify_password(password):
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    _update_streak(user, datetime.now(timezone.utc))
    db.commit()
    return user


def create_token(data: dict, time_expire: Union[datetime, None] = None):
    data_copy = data.copy()

    if time_expire is None:
        expires = datetime.now(timezone.utc) + timedelta(minutes=15)
    else:
        expires = datetime.now(timezone.utc) + time_expire
    data_copy.update({"exp": expires})
    token_jwt = jwt.encode(data_copy, key=JWT_SECRET, algorithm=ALGORITHM)

    return token_jwt


async def get_current_user(
    db: _orm.Session = Depends(get_db), token: str = Depends(OAuth2_scheme)
):
    try:
        token_decode = jwt.decode(token, key=JWT_SECRET, algorithms=[ALGORITHM])
        user_id = token_decode.get("Userid")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = db.query(_User).filter_by(Userid=user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
