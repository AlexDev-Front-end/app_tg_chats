'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">Ласкаво просимо!</h1>
            <p className="mb-8 text-gray-600">
              Це система перегляду чатів та повідомлень вашого Telegram.
              Авторизуйтесь або зареєструйтесь для користування.
            </p>
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => router.push('/login')}
                    className="w-full rounded-lg bg-blue-600 text-white p-3 font-semibold hover:bg-blue-700 transition-colors"
                >
                    Авторизація
                </button>
                <button
                    onClick={() => router.push('/register')}
                    className="w-full rounded-lg bg-gray-100 text-blue-600 p-3 font-semibold hover:bg-blue-200 transition-colors"
                >
                    Реєстрація
                </button>
            </div>
        </div>
    </div>
  );
}