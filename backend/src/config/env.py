import os
from dotenv import load_dotenv

load_dotenv()

PORT = os.getenv("PORT", 5001)
DATABASE_URL = os.getenv("DATABASE_URL")
NODE_ENV = os.getenv("NODE_ENV", "development")
API_URL = os.getenv("API_URL")