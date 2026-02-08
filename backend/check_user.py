import asyncio
from db.mongo import db

async def check_user():
    await db.connect()
    user = await db.db.users.find_one({"email": "sup"})
    if user:
        print(f"FOUND USER: {user['email']}")
        print(f"PASSWORD HASH: {user['hashed_password']}")
    else:
        print("USER 'sup' NOT FOUND")
    db.close()

if __name__ == "__main__":
    asyncio.run(check_user())
