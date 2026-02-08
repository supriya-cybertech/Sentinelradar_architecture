from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

class Database:
    client: AsyncIOMotorClient = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
        try:
            # Verify connection
            await self.client.admin.command('ping')
            print("✅ Connected to MongoDB Atlas successfully!")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")

    @property
    def db(self):
        return self.client[settings.PROJECT_NAME]

db = Database()
