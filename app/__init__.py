from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Ініціалізуємо розширення без прив'язки до додатка
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['JWT_SECRET_KEY'] = 'super-secret-key-for-orderflow'

    # 3. Ініціалізуй JWTManager
    jwt = JWTManager(app)

    # Налаштування
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../site.db'  # ../ щоб база лежала в коліні проєкту
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