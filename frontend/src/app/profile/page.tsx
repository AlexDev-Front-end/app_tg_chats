'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id: number;
    email: string;
    telegram_session?: string | null
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch('http://127.0.0.1:8000/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(async (res) => {
            if (!res.ok) {
                throw new Error('Помилка авторизації.');
            }
            const data = await res.json();
            setUser(data);
        })
        .catch((err) => {
            console.error(err)
            setError("Помилка. Авторизуйтесь ще раз.");
            localStorage.removeItem('token');
            router.push('/login');
        })
        .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <div className='text-lg'>Завантаження...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex min-h-screen items-center justify-cnter'>
                <div className='text-red-500'>{error}</div>
            </div>
        )
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100'>
            <div className='w-full max-w-md rounded-2xl shadow-lg bg-white p-8 text-center'>
                <h2 className='text-2xl font-bold mb-4'>Профіль</h2>
                <p className='text-gray-600 mb-2'><b>Ваш ID:</b> {user?.id}</p>
                <p className='text-gray-600 mb-4'><b>Ваш Email:</b> {user?.email}</p>
                {!user?.telegram_session ? (
                    <button 
                        className='w-full rounded-lg bg-blue-600 text-white p-3 font-semibold hover:bg-blue-700 transition-colors' 
                        onClick={() => router.push('/telegram')}>Підключити Telegram</button>
                ) : (
                    <button 
                        className='w-full rounded-lg bg-green-600 text-white p-3 font-semibold hover:bg-green-700 transition-colors' 
                        onClick={() => router.push('/chats')}>Відкрити чати Telegram</button>
                )}
                <button 
                    className='mt-4 w-full rounded-lg bg-red-600 text-white p-3 font-semibold hover:bg-red-700 transition-colors' 
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }}>Вийти</button>
            </div>
        </div>
    );
}