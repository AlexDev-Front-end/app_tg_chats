## Структура проєкту

- **/backend** — Python, FastAPI, Telethon
- **/frontend** — Next.js, TailwindCSS

## Для старту проєкта

### Backend

1. Скопіюйте `.env.example` як `.env` та вкажіть свої значення в ньому.
2. Встановіть залежності:
   cd backend
   python -m venv .venv
   cd .venv/Scripts/activate
   cd ../../
   pip install -r requirements.txt
3. Запуск сервера:
   uvicorn app.main:app --reload

### Frontend
1. Встановіть залежності:
   cd frontend
   npm install
2. Запуск фронтенда:
   npm run dev
