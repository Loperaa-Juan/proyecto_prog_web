from typing import Optional

# from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.orm as _orm
from fastapi import Depends, FastAPI, Form
from fastapi.responses import RedirectResponse

import schemas.user as _user
import services.user as _userServices
from routers import auth_router, challenges_router, users_router
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
app.include_router(challenges_router, prefix="/api")


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
