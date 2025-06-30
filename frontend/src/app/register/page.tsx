'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            const regRes = await fetch('http://127.0.0.1:8000/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!regRes.ok) {
                const json = await regRes.json()
                setError(json.detail || 'Помилка реєстрації')
                return
            }

            const data = new URLSearchParams();
            data.append('username', email);
            data.append('password', password);

            const loginRes = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (!loginRes.ok) {
                setSuccess('Реєстрація успішна, але автоматичний вхід невиконано.');
                setError('Перевірте пошту/пароль та спробуйте авторизуватись самостійно.')
                return;
            }

            const loginJson = await loginRes.json();
            localStorage.setItem('token', loginJson.access_token)

            setSuccess('Реєстрація успішна! Тепер увійдіть в систему.')
            setEmail('')
            setPassword('')

            setTimeout(() => {
                router.push('/profile');
            }, 1000);

        } catch(err) {
            console.error(err)
            setError('Помилка підключення до сервера.')
        }
    }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-2xl shadow-lg bg-white p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 text-white p-3 font-semibold hover:bg-blue-700 transition-colors"
                >
                    Зареєструватись
                </button>
                </form>
                {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
                {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Ви вже зареєстровані?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                        Увійти
                    </Link>
                </p>
            </div>
        </div>
    )
}