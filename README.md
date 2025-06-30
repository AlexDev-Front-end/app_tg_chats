# Структура проєкту
backend - Python, FastAPI, Telethon
fronend - Next.js, TailwindCSS

# Для старту проєкта
# Backend:
Скопіюйте '.env.example' як '.env' та вкажіть свої значення в ньому.
Встановіть залежності:
    cd backend
    python -m venv .venv
    cd .venv/Scripts/activate
    cd ../../
    pip install -r requirements.txt
Запуск сервера:
    uvicorn app.main:app --reload

# Frontend:
Встановіть залежності:
    cd frontend
    npm install
Запуск фронтенда:
    npm run dev
