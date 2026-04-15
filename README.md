# HireFlow Infra (Local Setup with Docker)

This repository contains the infrastructure setup for running **HireFlow locally using Docker**.

It orchestrates:

- 🧠 Backend (Node.js + Express + Prisma)
- 🎨 Frontend (Next.js)
- ⚡ Redis (queue / caching)
- 🐳 Docker Compose for full system startup

---

## 📦 Project Structure

```
hireflow-infra/
│
├── hireflow-backend/     # Backend service
├── hireflow-frontend/    # Frontend service
├── docker-compose.yml    # Orchestration file
└── .gitignore
```

---

## ⚙️ Prerequisites

Make sure you have:

- Docker installed → https://www.docker.com/
- Docker Compose (comes with Docker Desktop)

---

## 🔑 Environment Setup

Environment files are NOT included for security reasons.

### 1. Backend

Create file:

```
hireflow-backend/.env
```

Use this template:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
REDIS_URL=redis://redis:6379
PORT=5001
```

---

### 2. Frontend

Create file:

```
hireflow-frontend/.env
```

```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_RESUME_LIMIT=1000
```

---

## 🚀 Run the Project

From root folder:

```bash
docker compose up --build
```

---

## Access Services

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5001 |
| Redis    | localhost:6379        |

---

## 🧹 Stop the Project

```bash
docker compose down
```

---

## 🔁 Rebuild (after changes)

```bash
docker compose up --build
```

---

## 🧠 How It Works

- Docker builds images for frontend & backend
- Containers run in isolated environments
- Services communicate via Docker network
- Redis is used for background jobs / caching

---

## 📌 Notes

- `.env` files are ignored for security
- Use `.env.example` as reference
- Do NOT commit secrets

---

## 🚀 Future Improvements

- Add Docker Hub images
- Add CI/CD pipeline (GitHub Actions)
- Add production-ready configs
- Kubernetes support

---

## 👨‍💻 Author

Abhishek Pradhan

---

## ⭐ If you like this project, give it a star!
