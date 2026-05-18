from datetime import timedelta

import sqlalchemy.orm as _orm
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

import services.user as _userServices
from services import database as _databaseServices

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Ruta para la creación de tokens de acceso
@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    # Autenticamos al usuario utilizando el servicio de autenticación
    user = await _userServices.authenticate_user(
        form_data.username, form_data.password, db
    )

    # Ponemos un tiempo de expiración para el token de acceso (en este caso, 30 minutos)
    access_token_expires = timedelta(minutes=30)
    access_token_jwt = _userServices.create_token(
        {"sub": user.username, "Userid": str(user.Userid)},
        access_token_expires,
    )

    return {"access_token": access_token_jwt, "token_type": "bearer"}
