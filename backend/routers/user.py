import sqlalchemy.orm as _orm
from fastapi import APIRouter, Depends, HTTPException

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
