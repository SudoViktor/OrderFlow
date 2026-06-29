

https://github.com/user-attachments/assets/6f30c3c3-41a6-4174-acf4-23d07b9c2d8a

# OrderFlow Terminal System

Професійна CRM/ERP система для автоматизації бізнес-процесів (управління замовленнями, клієнтами та інвентарем).

## Огляд проєкту
Система побудована за архітектурою **Client-Server**. Бекенд забезпечує надійну роботу з даними та безпеку, а фронтенд — швидкий інтерфейс у стилі терміналу.

## ⚙️ Бекенд (Python/Flask)
* **API:** RESTful сервіс на Flask з використанням Blueprints для модульності.
* **База даних:** SQLAlchemy 2.0 (ORM) з налаштованою транзакційністю (`db.session.rollback`).
* **Безпека:** Авторизація через JWT-токени (`Flask-JWT-Extended`) та хешування паролів (`Werkzeug`).
* **Оптимізація:** Серверна пагінація (`db.paginate`) для ефективної обробки великих баз даних.

## 🖥 Фронтенд (Vanilla JS/CSS)
* **Архітектура:** SPA (Single Page Application) без фреймворків, що забезпечує миттєву роботу.
* **Взаємодія:** Асинхронні `fetch`-запити з централізованою обробкою помилок (401 Unauthorized, токени).
* **UI/UX:** Адаптивний інтерфейс (Flexbox/Grid), модульна структура DOM-рендерінгу.

## 🚀 Як запустити
1. git clone https://github.com/SudoViktor/OrderFlow.git
2. cd OrderFlow
3. docker-compose up -d --build
4. Open: http://localhost:8080/

---

# OrderFlow Terminal System

Professional CRM/ERP system for business process automation (orders, clients, and inventory management).

## Project Overview
The system follows a **Client-Server** architecture. The backend ensures data integrity and security, while the frontend provides a high-performance terminal-style UI.

## ⚙️ Backend (Python/Flask)
* **API:** RESTful service using Flask Blueprints for modularity.
* **Database:** SQLAlchemy 2.0 ORM with transaction support (`db.session.rollback`).
* **Security:** JWT authentication (`Flask-JWT-Extended`) and password hashing (`Werkzeug`).
* **Optimization:** Server-side pagination (`db.paginate`) for efficient data handling.

## 🖥 Frontend (Vanilla JS/CSS)
* **Architecture:** SPA (Single Page Application) for zero-latency navigation.
* **Communication:** Asynchronous `fetch` calls with centralized error handling.
* **UI/UX:** Responsive design (Flexbox/Grid) with modular DOM rendering.

## 🚀 Deployment
1. git clone https://github.com/SudoViktor/OrderFlow.git
2. cd OrderFlow
3. docker-compose up -d --build
4. Open: http://localhost:8080/
