from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_object("config.DevelopmentConfig")


    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    return app
