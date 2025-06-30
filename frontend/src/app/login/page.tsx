'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [token, setToken] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess('')

        const data = new URLSearchParams()
        data.append('username', email)
        data.append('password', password)

        try {
            const res = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })

            if (!res.ok) {
                setError('Пошта або пароль введені з помилкою')
                return
            }

            const json = await res.json();
            localStorage.setItem('token', json.access_token)
            setToken(json.access_token)
            setSuccess('Успішний вхід.')

            setTimeout(() => {
            router.push('/profile');
            }, 1000);

        } catch (err) {
            console.error(err)
            setError('Помилка підключення до серверу');
        }
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100'>
            <div className='w-full max-w-md rounded-2xl shadow-lg bg-white p-8'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Вхід у систему</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <input 
                            type="email" 
                            placeholder='Email' 
                            value={email} 
                            required 
                            onChange={e => setEmail(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder='Пароль' 
                            value={password} 
                            required 
                            onChange={e => setPassword(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <button 
                        type='submit' 
                        className='w-full rounded-lg bg-blue-600 text-white p-3 font-semibold hover:bg-blue-700 transition-colors'
                    >
                        Увійти
                    </button>
                </form>
                {error && <div className='mt-4 text-red-500 text-center'>{error}</div>}
                {success && <div className='mt-4 text-green-600 text-center'>{success}</div>}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Немає аккаунту?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                        Зареєструватись
                    </Link>
                </p>
            </div>
        </div>
    )
}
