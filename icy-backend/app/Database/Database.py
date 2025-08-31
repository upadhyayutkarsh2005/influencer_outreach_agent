from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "google-auth"

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]
users_collection = db["users"]

def get_user_collection():
    return users_collection