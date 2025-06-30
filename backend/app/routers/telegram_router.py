from fastapi import APIRouter, HTTPException, Depends
from telethon import TelegramClient
from telethon.sessions import StringSession
from sqlalchemy.orm import Session
from ..models import User
from ..dependencies import get_current_user, get_db
from ..config import settings
from pydantic import BaseModel


router = APIRouter(prefix='/telegram', tags=['telegram'])

telegram_sessions = {}

class PhoneRequest(BaseModel):
    phone: str

@router.post('/send_code')
async def send_code(payload: PhoneRequest):
    phone = payload.phone
    client = TelegramClient(StringSession(), int(settings.TELEGRAM_API_ID), settings.TELEGRAM_API_HASH)
    await client.connect()
    try:
        sent = await client.send_code_request(phone)
        telegram_sessions[phone] = client
        return {'status': 'ok', 'phone': phone}
    except Exception as e:
        await client.disconnect()
        raise HTTPException(status_code=400, detail=f"Помилка: {e}")
    
@router.post('/sign_in')
async def sign_in(phone: str, code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = telegram_sessions.get(phone)
    if not client:
        raise HTTPException(status_code=400, detail='Спочатку відправте код через /send_code.')
    try:
        await client.sign_in(phone, code)
        session_string = client.session.save()
        await client.disconnect()
        telegram_sessions.pop(phone, None)

        current_user.telegram_session = session_string
        db.add(current_user)
        db.commit()
        return {'status': 'ok'}
    
    except Exception as e:
        await client.disconnect()
        telegram_sessions.pop(phone, None)
        raise HTTPException(status_code=400, detail=f"Помилка: {e}")
    
@router.get('/chats')
async def get_telegram_chats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session_str = current_user.telegram_session
    if not session_str:
        raise HTTPException(status_code=400, detail="Telegram-аккаунт не підключений.")
    
    client = TelegramClient(StringSession(session_str), int(settings.TELEGRAM_API_ID), settings.TELEGRAM_API_HASH)
    await client.connect()
    try:
        dialogs = []
        async for dialog in client.iter_dialogs():
            dialogs.append({
                'id': dialog.id,
                'title': dialog.title,
                'name': dialog.name,
                'is_group': dialog.is_group,
                'unread_count': dialog.unread_count,
            })
        return {'chats': dialogs}
    finally:
        await client.disconnect()

@router.get('/chats/{chat_id}/messages')
async def get_chat_messages(chat_id: int, limit: int=20, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session_str = current_user.telegram_session
    if not session_str:
        raise HTTPException(status_code=400, detail="Telegram-аккаунт не підключений.")
    
    client = TelegramClient(StringSession(session_str), int(settings.TELEGRAM_API_ID), settings.TELEGRAM_API_HASH)
    await client.connect()
    try:
        messages = []
        async for msg in client.iter_messages(chat_id, limit=limit):
            messages.append({
                'id': msg.id,
                'text': msg.text,
                'date': msg.date.isoformat() if msg.date else None,
                'sender_id': getattr(msg.sender_id, 'user_id', msg.sender_id) if hasattr(msg, 'sender_id') else None,
                'from_id': msg.from_id,
                'reply_to_msg_id': msg.reply_to_msg_id,
                'is_forward': bool(msg.fwd_from),
                'forwarded_from': getattr(msg.fwd_from, 'from_id', None) if msg.fwd_from else None,
                'media_type': msg.media.__class__.__name__ if msg.media else None,
                'has_media': msg.media is not None,
            })
        return {'messages': messages}
    finally:
        await client.disconnect()