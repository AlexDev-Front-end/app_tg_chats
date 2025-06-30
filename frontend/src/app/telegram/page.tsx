'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TelegramConnectPage() {
    const router = useRouter()
    const [phone, setPhone] = useState('')
    const [codeSent, setCodeSent] = useState(false)
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    async function handleSendPhone(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!phone) return setError('Введіть номер телефону.')
        try {
            const res = await fetch('http://127.0.0.1:8000/telegram/send_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({phone}),
            })
            const data = await res.json()
            if (!res.ok) setError(data.detail || 'Помилка відправки коду.')
            else {
                setCodeSent(true)
                setSuccess('Код надісланий вам у Telegram. Введіть його.')
            }
        } catch {
            setError('Помилка сервера')
        }
    }

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!code) return setError('Введіть код.')
        try {
            const res = await fetch(`http://127.0.0.1:8000/telegram/sign_in?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(code)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            const data = await res.json()
            if (!res.ok) setError(data.detail || 'Помилка підключення до Telegram')
            else {
                setSuccess('Успіх. Telegram підключено!')
                setTimeout(() => router.push('/telegram/chats'), 1000)
            }
        } catch {
            setError('Ошибка сервера')
        }
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100'>
            <div className='w-full max-w-md rounded-2xl shadow-lg bg-white p-8 text-center'>
                <h2 className='text-2xl font-bold mb-6'>Підключити Telegram.</h2>
                <form onSubmit={codeSent ? handleSendCode : handleSendPhone} className='space-y-4'>
                    {!codeSent ? (
                        <>
                            <input 
                                type="tel" 
                                placeholder='Ваш номер (например: +380... или +7...)' 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                                className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                required />
                            <button 
                                type='submit' 
                                className='w-full rounded-lg bg-blue-600 text-white p-3 font-semibold hover:bg-blue-700 transition-colors'>Надіслати код</button>
                        </>
                    ) : (
                        <>
                            <input 
                                type="text" 
                                placeholder='Код из Telegram' 
                                value={code} 
                                onChange={e => setCode(e.target.value)} 
                                className='w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required />
                            <button 
                            type='submit' 
                            className='w-full rounded-lg bg-blue-600 text-white p-3 font-semibold hover:bg-blue-700 transition-colors'>Під'єднати Telegram</button>
                        </>
                    )}
                </form>
                {error && <div className="mt-2 text-red-500">{error}</div>}
                {success && <div className="mt-2 text-green-600">{success}</div>}
            </div>
        </div>
    )
}