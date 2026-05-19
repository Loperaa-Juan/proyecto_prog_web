from typing import Optional

import sqlalchemy.orm as _orm
from fastapi import APIRouter, Depends, Form, HTTPException

import schemas.user as _user
import services.user as _userServices
from services import database as _databaseServices

router = APIRouter(prefix="/users", tags=["Users"])


# Endpoint para obtener el usuario actual
@router.get("/me", response_model=_user.UserResponse)
async def get_user(user: _user.User = Depends(_userServices.get_current_user)):
    return user


# Endpoint para crear un nuevo usuario
@router.post("/")
async def create_user(
    user: _user.UserCreate, db: _orm.Session = Depends(_databaseServices.get_db)
):
    db_user = await _userServices.get_user_by_username(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    user = await _userServices.create_user(user, db)

    return {
        "message": "Usuario creado exitosamente",
        "data": user,
    }


@router.put("/me")
async def update_user(
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
    username: Optional[str] = Form(None),
    full_name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
):
    updated_user = await _userServices.edit_user_profile(
        user=user,
        username=username,
        full_name=full_name,
        email=email,
        password=password,
        db=db,
    )
    return updated_user


@router.delete("/me")
async def delete_user(
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    result = _userServices.delete_user(user, db)
    return result
