from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SentinelRadar"
    API_V1_STR: str = "/api/v1"
    NASA_API_KEY: str = "KmziinTvwUNdqZJTiHTHNf3Xv5cueYtgaS2oA6x5" # User Provided Key
    MONGODB_URL: str = "mongodb+srv://supriya:Rohit15@cluster0.n8hj3xm.mongodb.net/?appName=Cluster0"
    
    # JWT Settings
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7" # Generated random key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
