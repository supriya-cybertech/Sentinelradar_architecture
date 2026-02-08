from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import settings
from db.mongo import db
from services.satellite_service import satellite_service
import json

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting up SentinelRadar Backend...")
    await db.connect()
    try:
        # Pre-fetch TLEs
        print("Initializing Satellite Tracking...")
        satellite_service.fetch_tles()
    except Exception as e:
        print(f"WARNING: Satellite Service failed to initialize: {e}")
    yield
    # Shutdown logic
    print("Shutting down SentinelRadar Backend...")
    db.close()

app = FastAPI(
    title="SentinelRadar API",
    description="Planetary Defense & Intelligence API",
    version="1.1.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Ensure static directory exists
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "SentinelRadar System Online", "status": "nominal"}

from api.routes import neo, risk, chat, auth
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(neo.router, prefix="/api/neo", tags=["NEO"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk"])
# app.include_router(chat.router, prefix="/api/chat", tags=["Chat"]) # Replaced by WebSocket

@app.get("/api/satellites")
async def get_satellites():
    return {"satellites": satellite_service.get_satellite_positions()}

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/comms")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo message back with system tag
            # In real scenario, this would process commands
            response = json.dumps({
                "id":  hash(data),
                "type": "user", 
                "message": data,
                "timestamp": "Now"
            })
            # await manager.broadcast(f"Client says: {data}")
            # Mock system response
            await websocket.send_text(json.dumps({
                "type": "system",
                "message": f"COMMAND ACKNOWLEDGED: {data}",
                "timestamp": "Now"
            }))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
