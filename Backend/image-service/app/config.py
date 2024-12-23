import os

class Config:
    DATABASE_URI = os.getenv("DATABASE_URI")
    CELERY_BROKER_URL = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/0"