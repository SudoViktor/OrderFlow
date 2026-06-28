from flask import Blueprint, request, jsonify
from app.models import User, Article, Client, Order
from flask_jwt_extended import create_access_token, jwt_required

# Створюємо Blueprint для головних маршрутів
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return 'Hello'


@main_bp.route('/api/register', methods=['POST'])
def create_user():
    data = request.get_json()
    print(data)
    username = data.get('username')
    password = data.get('password')
    print(username, password)
    user = User.create_user(username, password)

    if user: return {"ok": True}
    else: return {"ok": False, "reason": "User already exists"}


@main_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"ok": False, "reason": "Missing login details"}), 400

    username = data.get('username')
    password = data.get('password')

    # Перевіряємо, чи заповнені обидва поля
    if not username or not password:
        return jsonify({"ok": False, "reason": "Login and password are required"}), 400

    try:
        user = User.get_by_username(username)

        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))

            return jsonify({
                "ok": True,
                "token": access_token,
                "message": "Вхід успішний!"
            }), 200

        else:
            return jsonify({"ok": False, "reason": "Incorrect login or password"}), 401

    except Exception as e:
        print(f"Помилка авторизації: {e}")
        return jsonify({"ok": False, "reason": "Внутрішня помилка сервера"}), 500


@main_bp.route('/api/create_article', methods=['POST'])
@jwt_required()
def create_article():
    article_code = request.args.get('article_code')
    name = request.args.get('name')
    description = request.args.get('description')
    price = request.args.get('price')

    article = Article.create(article_code, name, description, price)

    if article: return {"ok": True}
    else: return {"ok": False, "reason": "article already exists"}


@main_bp.route('/api/create_client')
@jwt_required()
def create_client():
    name = request.args.get('name')

    client = Client.create(name)

    if client: return {"ok": True}
    else: return {"ok": False, "reason": "client already exists"}


@main_bp.route('/api/create_order', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()

    if not data:
        return jsonify({"reason": "Invalid or missing JSON payload"}), 400

    client_id = data.get('client_id')
    cart_items = data.get('cart_items', [])

    if not client_id or not cart_items:
        return jsonify({"reason": "Missing client_id or cart_items"}), 400

    order, error = Order.create(client_id=client_id, cart_items=cart_items)

    if error:
        return jsonify({"reason": error}), 400

    return jsonify({"message": f"Order #{order.id} created", "order_id": order.id}), 201


#/api/clients?page=1&per_page=100
@main_bp.route('/api/clients', methods=['GET'])
@jwt_required()
def clients():
    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)
    clients_list, current_page, total_pages = Client.get_clients_by_page(page, per_page)
    return jsonify({
        "clients": clients_list,
        "total_pages": total_pages,
        "current_page": current_page
    }), 200

#/api/clients?page=1&per_page=100
@main_bp.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)

    orders_list, current_page, total_pages = Order.get_orders_by_page(page, per_page)
    return jsonify({
        "orders": orders_list,
        "total_pages": total_pages,
        "current_page": current_page
    }), 200

#/api/clients?page=1&per_page=100
@main_bp.route('/api/products', methods=['GET'])
@jwt_required()
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)

    article_list, current_page, total_pages = Article.get_articles_by_page(page, per_page)
    return jsonify({
        "products": article_list,
        "total_pages": total_pages,
        "current_page": current_page
    }), 200


@main_bp.route('/api/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_details(order_id):
    # Отримуємо замовлення з бази
    order = Order.get_by_id(order_id)
    if not order:
        return jsonify({"reason": "Order not found"}), 404

    # Формуємо список товарів у цьому замовленні
    items_list = []
    for item in order.items:
        items_list.append({
            "article_code": item.article.article_code,
            "name": item.article.name,
            "quantity": item.quantity,
            "price": item.article.price
        })

    return jsonify({
        "order_id": order.id,
        "items": items_list
    }), 200