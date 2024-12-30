from flask import Flask
from .celery_app import make_celery, celery_app
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Configure the Celery app with Flask's config
    celery_app.conf.update(app.config)

    CORS(app)

    # Register blueprints
    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
