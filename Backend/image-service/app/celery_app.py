from celery import Celery
from flask import Flask
from app.services.generate_nft import generate_nft_async

def make_celery(app):
    celery_app = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery_app.conf.update(app.config)
    return celery_app

# Create a standalone Celery app for workers
celery_app = Celery('app', backend="redis://localhost:6379/0", broker="redis://localhost:6379/0")
celery_app.autodiscover_tasks(['app.services'])