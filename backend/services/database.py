import psycopg2
import database as _database
import models.user as _models_user
import models.challenge as _models_challenge
import models.submission as _models_submission

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()