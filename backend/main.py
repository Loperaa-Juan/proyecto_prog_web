from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.responses import RedirectResponse

import services.email as _emailServices
from services import database as _databaseServices
from routers import auth_router, challenges_router, chatbot_router, email_router, submissions_router, users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    _databaseServices.create_database()
    _emailServices.init_email_service()
    yield


app = FastAPI(
    title="ComplexityLab Backend",
    description="Backend API para ComplexityLab, una plataforma de aprendizaje de algoritmos y estructuras de datos.",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect to the automatic documentation."""
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "OK"}


api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(challenges_router)
api_router.include_router(submissions_router)
api_router.include_router(chatbot_router)
api_router.include_router(email_router)

app.include_router(api_router)
