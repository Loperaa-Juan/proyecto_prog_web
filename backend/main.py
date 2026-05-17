from datetime import timedelta
from typing import Optional

# from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.orm as _orm
from fastapi import Depends, FastAPI, Form, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

import schemas.user as _user
import services.challenge as _challengeServices
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


@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "OK"}


@app.get("/api/users/me", response_model=_user.UserResponse, tags=["Users"])
async def get_user(user: _user.User = Depends(_userServices.get_current_user)):
    return user


@app.post("/api/token", tags=["Authentication"])
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


@app.post("/api/users", tags=["Users"])
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


@app.get("/api/challenges/me", tags=["Challenges"])
async def get_challenges_by_user(
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.get_challenges_by_user(user, db)


@app.get("/api/challenges", tags=["Challenges"])
async def get_all_challenges(db: _orm.Session = Depends(_databaseServices.get_db)):
    return await _challengeServices.get_all_challenges(db)


@app.get("/api/challenges/{challenge_id}", tags=["Challenges"])
async def get_challenge_by_id(
    challenge_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _challengeServices.get_challenge_by_id(challenge_id, db, user)


@app.post("/api/challenges", tags=["Challenges"])
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


@app.put("/api/challenges/{challenge_id}", tags=["Challenges"])
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


@app.delete("/api/challenges/{challenge_id}", tags=["Challenges"])
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
