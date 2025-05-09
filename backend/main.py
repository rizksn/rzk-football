import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Step 1: Ensure backend/anubis is in the import path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "anubis")))

# Step 2: Import routers
from routes.players import router as players_router
from anubis.anubis_draft_engine.anubis import router as simulate_router

# Step 3: Create app instance
app = FastAPI()

# Step 4: Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Step 5: Register routes
app.include_router(players_router)
app.include_router(simulate_router)

# Step 6: Root health check
@app.get("/")
def read_root():
    return {"message": "Backend is up and running!"}