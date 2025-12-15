# Smart Timetable Scheduler

A web-based **Smart Timetable Scheduler** that combines a modern TypeScript-based frontend with a Python (Django) powered admin panel for managing schedules, users, and configurations.

---

## 📁 Project Structure (High Level)

```
Smart-TimeTable-Scheduler/
│
├── Login UI/                 # Frontend UI (TypeScript)
│   ├── index.html            # Main dashboard
│
├── panel/                    # Django Admin Panel
│   ├── manage.py
│   ├── scheduler/            # Core scheduling app
│   ├── templates/
│   ├── static/
│   └── db.sqlite3
├── .gitignore
├── README.md
└── requirements.txt
```


````

---

## 🚀 Tech Stack

### Frontend
- HTML5, CSS3
- TypeScript
- Node.js + npm
- Vite Dev Server

### Backend / Admin Panel
- Python
- Django Framework
- SQLite (default)

---

## 🔧 Prerequisites

Ensure the following are installed on your system:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Python** (v3.9 or higher)
- **pip**
- **Django** (`pip install django`)

---

## ▶️ How to Run the Project

Follow the steps **in order** for smooth execution.

---

### 1️⃣ Start the Frontend Server

Navigate to the `frontend` directory and run:

```bash
npm install
npm run dev
````

This starts the frontend development server (usually at `http://localhost:5173`).

---

### 2️⃣ Open the User Interface

1. Open **Login UI** first:

   ```
   index.html
   ```
2. After successful opening, navigate to Admin panel login button on top right.

This is the main Smart Timetable Scheduler dashboard.

---

### 3️⃣ Start the Admin Panel (Django)

Navigate to the `panel` directory and run:

```bash
python manage.py runserver
```

Admin panel will be available at:

```
http://127.0.0.1:8000/
```
---

## 🔐 Default Login Credentials

### Admin Panel (Django)

* **Username**: `admin`
* **Password**: `admin123`

### Scheduler / Application Login

* **Username**: `schedule`
* **Password**: `schedule123`

⚠️ **Security Warning**: These are default credentials meant for development only. Always update credentials before production deployment.

---

## 🧠 Workflow Summary

1. Run frontend server using `npm run dev`
2. Open `index.html`
3. Navigate to the `panel` directory and run: `python manage.py runserver`
4. Manage schedules, users, and logic via admin panel

---

## ✨ Features

* Login-based access control
* Smart timetable scheduling logic
* Admin dashboard for managing schedules
* Modular TypeScript frontend
* Django-powered backend
* Easy local development setup

---

## 📌 Future Enhancements

* REST API integration between frontend & backend
* Role-based access (Admin, Faculty, Student)
* Automated conflict-free scheduling
* Export timetable to PDF / Excel
* Cloud deployment (Netlify + Render / Railway)

---

## 🛠️ Development Notes

* Frontend and backend must run **simultaneously**
* Currently uses local development servers
* Can be extended to use Django REST Framework
* SQLite can be replaced with PostgreSQL/MySQL

---

## 📄 License

This project is developed for **educational and academic purposes**.

---

## 👨‍💻 Author

**Smart Timetable Scheduler**
Developed as a full-stack academic project integrating frontend and backend systems.

---

⭐ If you find this project useful, consider starring the repository.
