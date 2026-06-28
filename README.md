```markdown
# OrderFlow Terminal System

[🇺🇦 Українська версія](#-опис-проекту) | [🇬🇧 English version](#-project-description)

---

## 🇺🇦 Опис проєкту
**OrderFlow** — це професійна термінальна система для автоматизації бізнес-процесів (CRM/ERP), розроблена для оптимізації обліку клієнтів, товарних запасів та управління замовленнями. Проект фокусується на швидкості, чистоті даних та надійній архітектурі, що дозволяє бізнесу масштабувати операційну діяльність.

### 🎯 Задача
Створити високоефективну систему для адміністрування бізнес-процесів, яка забезпечує:
* **Безпечну авторизацію:** Використання JWT-токенів для захисту сесій.
* **Управління даними:** Ефективне керування клієнтами та складськими залишками.
* **Автоматизацію замовлень:** Розрахунок підсумкової вартості (`total_price`) на стороні сервера з перевіркою цілісності даних.
* **Високу швидкість:** Реалізація серверної пагінації для роботи з великими обсягами даних.

### 🛠 Технологічний стек
* **Backend:** Flask (Python), SQLAlchemy 2.0 (ORM), Flask-JWT-Extended, Flask-CORS.
* **Frontend:** Vanilla JavaScript (ES6+), CSS3 (Flexbox/Grid), Fetch API.

### 🏗 Архітектура даних
Система побудована на зв'язках `One-to-Many` (Клієнт — Замовлення) та `Many-to-Many` (Замовлення — Товари) через проміжну таблицю з використанням `cascade="all, delete-orphan"` для підтримки чистоти бази даних.

---

## 🇬🇧 Project Description
**OrderFlow** is a professional terminal system for business process automation (CRM/ERP), designed to optimize client records, inventory, and order management. The project focuses on performance, data integrity, and a robust architecture, enabling businesses to scale their operations effectively.

### 🎯 Objective
To build a high-performance system for business administration that ensures:
* **Secure Authentication:** JWT-based session protection.
* **Data Management:** Efficient handling of client and inventory records.
* **Order Automation:** Server-side `total_price` calculation ensuring data integrity.
* **Performance:** Server-side pagination to handle large datasets efficiently.

### 🛠 Tech Stack
* **Backend:** Flask (Python), SQLAlchemy 2.0 (ORM), Flask-JWT-Extended, Flask-CORS.
* **Frontend:** Vanilla JavaScript (ES6+), CSS3 (Flexbox/Grid), Fetch API.

### 🏗 Data Architecture
The system utilizes `One-to-Many` (Client-Order) and `Many-to-Many` (Order-Article) relationships, implementing `cascade="all, delete-orphan"` to ensure relational data integrity.

---

## 🚀 Key Features / Ключові можливості
* **Modular Architecture:** The system is divided into logical modules, making it easy to extend.
* **Query Optimization:** Implemented server-side pagination to minimize network and database load.
* **Smart Cart:** Automatic `total_price` calculation during order creation with validation.
* **Security:** Interception of unauthorized requests (401 Unauthorized) with automatic session termination.

## 🛠 Deployment / Інструкція з розгортання
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/orderflow.git](https://github.com/your-username/orderflow.git)

```

2. **Install dependencies:**
```bash
pip install -r requirements.txt

```


3. **Configuration:**
Set up your `JWT_SECRET_KEY` in the configuration file.
4. **Run:**
```bash
python run.py

```



## 👨‍💻 Author / Про автора

**Viktor** — Python & Swift Developer. I specialize in building high-load automated systems and developing clean, intuitive UI/UX solutions.

```

```
