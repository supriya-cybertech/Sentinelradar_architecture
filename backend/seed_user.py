import asyncio
from db.mongo import db
from core.security import get_password_hash
from models.user import UserInDB

async def seed_user():
    print("Initiating Final Seeding Protocol...")
    await db.connect()
    
    username = "sup"
    password = "rohit"
    name = "sup"
    
    try:
        # Delete if exists to ensure clean state
        await db.db.users.delete_one({"email": username})
        
        print(f"Creating account for ID: {username} | Name: {name}...")
        hashed_password = get_password_hash(password)
        user_in_db = UserInDB(
            email=username,
            hashed_password=hashed_password,
            full_name=name,
            is_active=True,
            is_verified=True
        )
        await db.db.users.insert_one(user_in_db.dict())
        print("✅ Account successfully created and deployed to Atlas.")
            
    except Exception as e:
        print(f"❌ ERROR: Seeding failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(seed_user())
