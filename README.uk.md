```markdown
# OrderFlow Terminal System

[🇺🇦 Українська версія](#-опис-проекту) | [🇬🇧 English version](#-project-description)

---

## 🇺🇦 Опис проекту
**OrderFlow** — це професійна термінальна система для автоматизації бізнес-процесів (CRM/ERP), розроблена для оптимізації обліку клієнтів, товарних запасів та управління замовленнями. Проект фокусується на швидкості, чистоті даних та надійній архітектурі, що дозволяє бізнесу масштабувати операційну діяльність.

### 🎯 Задача
Створити високоефективну систему для адміністрування бізнес-процесів, яка забезпечує:
* Безпечну авторизацію користувачів (JWT).
* Зручне управління клієнтською базою та інвентаризацією.
* Автоматизоване створення складних замовлень (з розрахунком суми).
* Високу швидкість роботи завдяки пагінації даних на стороні сервера.

### 🛠 Технологічний стек
* **Backend:** Flask (Python), SQLAlchemy 2.0 (ORM), Flask-JWT-Extended, Flask-CORS.
* **Frontend:** Vanilla JavaScript (ES6+), CSS3 (Flexbox/Grid), Fetch API.

### 🏗 Архітектура даних
* **Order <-> Client:** One-to-Many.
* **Order <-> OrderItem:** Many-to-Many через проміжну таблицю з використанням `cascade="all, delete-orphan"` для забезпечення цілісності даних.

---

## 🇬🇧 Project Description
**OrderFlow** is a professional terminal system for business process automation (CRM/ERP), designed to optimize client records, inventory, and order management. The project focuses on performance, data integrity, and a robust architecture, enabling businesses to scale their operations effectively.

### 🎯 Objective
To build a high-performance system for business administration that ensures:
* Secure user authentication (JWT).
* Efficient client database and inventory management.
* Automated complex order creation with dynamic total price calculation.
* High-speed performance through server-side data pagination.

### 🛠 Tech Stack
* **Backend:** Flask (Python), SQLAlchemy 2.0 (ORM), Flask-JWT-Extended, Flask-CORS.
* **Frontend:** Vanilla JavaScript (ES6+), CSS3 (Flexbox/Grid), Fetch API.

### 🏗 Data Architecture
* **Order <-> Client:** One-to-Many.
* **Order <-> OrderItem:** Many-to-Many using an intermediate table with `cascade="all, delete-orphan"` for data integrity.

---

## 🚀 Key Features / Ключові можливості
* **Modular Architecture:** The system is divided into logical modules (Orders, Clients, Products), making it easy to extend.
* **Query Optimization:** Implemented server-side pagination to minimize network and database load.
* **Smart Cart:** Automatic `total_price` calculation during order creation with data validation.
* **Security:** Implemented interception of unauthorized requests (401 Unauthorized) with automatic session termination.

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
