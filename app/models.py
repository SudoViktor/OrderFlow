from enum import unique

from app import db

from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


def save_and_commit(obj):
    try:
        db.session.add(obj)
        db.session.commit()
        return obj
    except Exception as e:
        print(e)
        db.session.rollback()
        return None

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)  # унікальний логін
    password_hash = db.Column(db.String(256), nullable=False)        # тут зберігається хеш, а не пароль

    def __init__(self, username):
        super().__init__()
        self.username = username

    def set_password(self, password):
        """Хешує пароль та записує його в базу"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Перевіряє, чи збігається введений пароль із хешем"""
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def get_by_username(username):
        user = db.session.execute(db.select(User).filter_by(username=username)).scalar()
        return user

    def __repr__(self):
        return f'<User {self.username}>'

    @staticmethod
    def create_user(username, password):
        existing_user = db.session.execute(db.select(User).filter_by(username=username)).scalar()

        if existing_user:
            return None

        new_user = User(username=username)
        new_user.set_password(password)
        return save_and_commit(new_user)


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    article_code = db.Column(db.Integer, unique=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    price = db.Column(db.Integer) # В копійках

    def __init__(self, article_code, name, description, price):
        super().__init__()
        self.article_code = article_code
        self.name = name
        self.description = description
        self.price = price

    @staticmethod
    def get_by_article_code(article_code):
        article = db.session.execute(db.select(Article).filter_by(article_code=article_code)).scalar()
        return article

    @staticmethod
    def create(article_code, name, description, price):
        article = Article.get_by_article_code(article_code)

        if article:
            return None

        new_article = Article(article_code, name, description, price)

        return save_and_commit(new_article)

    @staticmethod
    def get_articles_by_page(page, per_page):
        stmt = db.select(Article).order_by(Article.id.desc())
        pagination = db.paginate(stmt, page=page, per_page=per_page, error_out=False)
        articles_list = [{
            "id": a.id,
            "article_code": a.article_code,
            "name": a.name,
            "description": a.description,
            "price": a.price
        } for a in pagination.items]

        return articles_list, pagination.page, pagination.pages

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True)

    def __init__(self, name):
        super().__init__()
        self.name = name

    @staticmethod
    def get_by_name(name):
        client = db.session.execute(db.select(Client).filter_by(name=name)).scalar()
        return client

    @staticmethod
    def create(name):
        client = Client.get_by_name(name)

        if client:
            return None

        new_client = Client(name)
        return save_and_commit(new_client)

    @staticmethod
    def get_clients_by_page(page, per_page):
        stmt = db.select(Client).order_by(Client.id.desc())
        pagination = db.paginate(stmt, page=page, per_page=per_page, error_out=False)
        clients_list = [{"id": c.id, "name": c.name} for c in pagination.items]
        return clients_list, pagination.page, pagination.pages


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    client = db.relationship('Client', backref='orders')

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")
    total_price = db.Column(db.Integer, default=0)

    def __init__(self, client_id):
        super().__init__()
        self.client_id = client_id

    @staticmethod
    def create(client_id, cart_items):
        """
        Створює замовлення та всі пов'язані позиції (OrderItem).

        :param client_id: int - ID клієнта
        :param cart_items: list of dict - список товарів, наприклад:
                           [{"article_id": 1, "quantity": 5}, {"article_id": 3, "quantity": 1}]
        :return: (Order, None) у разі успіху або (None, error_message) у разі помилки
        """
        if not cart_items:
            return None, "Неможливо створити пусте замовлення"

        try:
            # 1. Створюємо сам об'єкт замовлення
            new_order = Order(client_id=client_id)
            db.session.add(new_order)

            # Викликаємо flush(), щоб SQLAlchemy згенерувала id для new_order,
            # але ще не фіксувала транзакцію в базі остаточно.
            db.session.flush()
            total = 0
            # 2. Проходимо по кожному товару в кошику
            for item in cart_items:
                art_id = item.get('article_id')
                qty = item.get('quantity', 1)

                if qty <= 0:
                    db.session.rollback()
                    return None, f"Кількість товару повинна бути більшою за 0"

                # Шукаємо товар в базі сучасним методом db.session.get
                article = db.session.get(Article, art_id)
                if not article:
                    db.session.rollback()
                    return None, f"Товар з ID {art_id} не знайдено"

                total += (article.price * qty)

                # 3. Створюємо рядок замовлення (OrderItem)
                order_item = OrderItem(
                    new_order=new_order,
                    article=article,
                    quantity=qty
                )
                db.session.add(order_item)
            new_order.total_price = total

            # 4. Якщо все пройшло успішно — зберігаємо транзакцію
            db.session.commit()
            return new_order, None

        except Exception as e:
            # Якщо щось пішло не так (впала база, вимкнулось світло) — скасовуємо всі зміни повністю
            db.session.rollback()
            return None, f"Помилка створення замовлення: {str(e)}"

    @staticmethod
    def get_by_id(id):
        client = db.session.execute(db.select(Order).filter_by(id=id)).scalar()
        return client

    @staticmethod
    def get_orders_by_page(page, per_page):
        stmt = db.select(Order).order_by(Order.id.desc())
        pagination = db.paginate(stmt, page=page, per_page=per_page, error_out=False)
        orders_list = [{
            "id": o.id,
            "date_created": o.date_created.isoformat() if o.date_created else None,  # Конвертуємо дату в рядок
            "client_name": o.client.name if o.client else "N/A",  # Беремо ім'я клієнта через зв'язок
            "client_id": o.client_id,
            "items_count": len(o.items) if hasattr(o, 'items') else 0,  # Рахуємо кількість позицій
            "total_price": int(o.total_price)  # Припускаю, що сума вже порахована в моделі
        } for o in pagination.items]
        return orders_list, pagination.page, pagination.pages


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price_per_item = db.Column(db.Integer, nullable=False)
    article = db.relationship('Article')

    def __init__(self, new_order, article, quantity):
        super().__init__()
        self.order_id = new_order.id
        self.article_id = article.id
        self.quantity = quantity
        self.price_per_item = article.price

