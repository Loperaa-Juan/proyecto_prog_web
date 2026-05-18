from typing import Optional

# from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.orm as _orm
from fastapi import Depends, FastAPI, Form
from fastapi.responses import RedirectResponse

import schemas.user as _user
import services.challenge as _challengeServices
import services.user as _userServices
from models.challenge import Difficulty
from routers import auth_router, users_router
from services import database as _databaseServices
from services import submission as _submissionServices

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


app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")


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


@app.get("/api/submissions/me", tags=["Submissions"])
async def get_submissions_by_user(
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.get_submissions_by_user(user, db)


@app.get("/api/submissions/{challenge_id}", tags=["Submissions"])
async def get_submissions_by_challenge_id(
    challenge_id: str,
    db: _orm.Session = Depends(_databaseServices.get_db),
    user: _user.User = Depends(_userServices.get_current_user),
):
    return await _submissionServices.get_submissions_by_challenge_id(
        challenge_id=challenge_id, db=db, user=user
    )


@app.post("/api/submissions/{submission_id}/accept", tags=["Submissions"])
async def accept_submission(
    submission_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.update_submission_status(
        submission_id, "accepted", db, user
    )


@app.post("/api/submissions/{submission_id}/reject", tags=["Submissions"])
async def reject_submission(
    submission_id: str,
    user: _user.User = Depends(_userServices.get_current_user),
    db: _orm.Session = Depends(_databaseServices.get_db),
):
    return await _submissionServices.update_submission_status(
        submission_id, "rejected", db, user
    )


@app.post("/api/submissions", tags=["Submissions"])
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


@app.put("/api/submissions/{submission_id}", tags=["Submissions"])
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


@app.delete("/api/submissions/{submission_id}", tags=["Submissions"])
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
