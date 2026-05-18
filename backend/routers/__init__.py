# Exponemos todos los routers para que puedan ser importados fácilmente desde otros módulos
from .auth import router as auth_router
from .challenge import router as challenges_router
from .submission import router as submissions_router
from .user import router as users_router
