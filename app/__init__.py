from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
# Ініціалізуємо розширення без прив'язки до додатка
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['JWT_SECRET_KEY'] = 'super-secret-key-for-orderflow'
    jwt = JWTManager(app)

    # Налаштування
    basedir = os.path.abspath(os.path.dirname(__file__))

    db_path = os.path.join(basedir, 'site.db')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Зв'язуємо базу з конкретним додатком
    db.init_app(app)

    # Реєструємо маршрути (імпортуємо всередині, щоб уникнути кругового імпорту)
    from app.routes import main_bp
    app.register_blueprint(main_bp)

    # Створюємо таблиці, якщо їх немає
    with app.app_context():
        db.create_all()

    return app