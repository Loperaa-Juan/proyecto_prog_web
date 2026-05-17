from datetime import timedelta

# from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.orm as _orm
from fastapi import Depends, FastAPI, Form, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

import schemas.user as _user
import services.challenge as _challengeServices

# import models.user as _user
import services.user as _userServices
from models.challenge import Difficulty
from services import database as _databaseServices

app = FastAPI(
    title="ComplexityLab Backend",
    description="Backend API para ComplexityLab, una plataforma de aprendizaje de algoritmos y estructuras de datos.",
    version="0.1.0",
)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect to the automatic documentation."""
    return RedirectResponse(url="/docs")


@app.get("/health")
def health_check():
    return {"status": "OK"}


@app.get("/api/users/me", response_model=_user.UserResponse)
async def get_user(user: _user.User = Depends(_userServices.get_current_user)):
    return user


@app.post("/api/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    user = await _userServices.authenticate_user(
        form_data.username, form_data.password, db
    )

    access_token_expires = timedelta(minutes=30)
    access_token_jwt = _userServices.create_token(
        {"sub": user.username, "Userid": str(user.Userid)},
        access_token_expires,
    )

    return {"access_token": access_token_jwt, "token_type": "bearer"}


@app.post("/api/users")
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


@app.post("/api/challenge")
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
