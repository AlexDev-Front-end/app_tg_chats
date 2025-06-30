import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DB_FILENAME: str = 'users.db'
    TELEGRAM_API_ID: str
    TELEGRAM_API_HASH: str

    
    class Config:
        env_file = os.path.join(ROOT_DIR, '.env')

    
    @property
    def DATABASE_URL(self):
        db_path = os.path.join(BASE_DIR, self.DB_FILENAME)
        return f'sqlite:///{db_path}'
    

settings = Settings()