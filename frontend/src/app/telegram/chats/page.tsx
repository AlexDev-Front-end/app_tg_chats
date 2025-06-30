'use client'

import { useEffect, useState } from 'react'

type Chat = {
    id: number;
    title: string;
    name: string | null;
    is_group: boolean;
    unread_count: number;
}

type Message = {
    id: number;
    text: string | null;
    date: string | null;
    sender_id: number | null;
    media_type?: string | null;
    is_forward?: boolean;
}

export default function TelegramChatsPage() {
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loadingChats, setLoadingChats] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [error, setError] = useState('')
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])

    useEffect(() => {
        if (!token) return
        setLoadingChats(true)
        fetch('http://127.0.0.1:8000/telegram/chats', {
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(res => res.json())
        .then(data => {
            if (data.detail) setError(data.detail)
            else setChats(data.chats)
            setLoadingChats(false)
        })
        .catch(() => {
            setError('Помилка завантаження чатів')
            setLoadingChats(false)
        })
    }, [token])

    useEffect(() => {
        if (!selectedChat || !token) return
        setLoadingMessages(true)
        fetch(`http://127.0.0.1:8000/telegram/chats/${selectedChat}/messages?limit=30`, {
            headers: {'Authorization': `Bearer ${token}`}
        })
        .then(res => res.json())
        .then(data => {
            if (data.detail) setError(data.detail)
            else setMessages(data.messages)
            setLoadingMessages(false)
        })
        .catch(() => {
            setError('Помилка завантаження повідомлень')
            setLoadingMessages(false)
        })
    }, [selectedChat, token])

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-80 bg-white border-r flex flex-col">
                <div className="p-4 border-b text-xl font-bold text-blue-700">Мої Telegram-чати</div>
                {loadingChats ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">Завантаження чатів...</div>
                ) : (
                    <ul className="flex-1 overflow-y-auto">
                        {chats.map(chat => (
                            <li
                                key={chat.id}
                                className={`cursor-pointer px-4 py-3 border-b hover:bg-blue-50 transition
                                ${selectedChat === chat.id ? 'bg-blue-100 font-bold' : ''}`}
                                onClick={() => setSelectedChat(chat.id)}
                            >
                                <div>{chat.title || chat.name || `Chat ${chat.id}`}</div>
                                {chat.unread_count > 0 && (
                                    <span className="inline-block bg-blue-500 text-white px-2 py-0.5 text-xs rounded ml-2">
                                        {chat.unread_count}
                                    </span>
                                )}
                                {chat.is_group && (
                                    <span className="ml-2 text-xs text-gray-400">(група/канал)</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            <main className="flex-1 flex flex-col">
                <div className="p-4 border-b bg-white text-lg font-semibold h-16 flex items-center">
                    {selectedChat
                        ? chats.find(c => c.id === selectedChat)?.title || chats.find(c => c.id === selectedChat)?.name
                        : "Выберите чат"}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {selectedChat ? (
                        loadingMessages ? (
                            <div className="text-gray-500">Завантаження повідомлень...</div>
                        ) : messages.length > 0 ? (
                            messages.map(msg => (
                                <div key={msg.id} className="rounded-xl bg-white p-3 shadow-sm">
                                    <div>
                                        {msg.text
                                        ? <span>{msg.text}</span>
                                        : msg.media_type
                                            ? <span className="text-gray-400 italic">[{msg.media_type}]</span>
                                            : <span className="text-gray-400 italic">[пусто]</span>
                                        }
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 flex gap-3">
                                        {msg.is_forward && <span>🔄 Форвард</span>}
                                        {msg.media_type && <span>Медіа: {msg.media_type}</span>}
                                        <span>ID: {msg.id}</span>
                                        {msg.date && <span>{new Date(msg.date).toLocaleString()}</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 italic">Немає повідомлень</div>
                        )
                    ) : (
                        <div className="text-gray-400 italic mt-12 text-center">Оберіть чат, для відображення повідомлень</div>
                    )}
                </div>
            </main>
        </div>
    )
}
