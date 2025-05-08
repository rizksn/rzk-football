import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.players import router as players_router

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'anubis')))

from anubis_draft_engine.simulate import router as simulate_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players_router)
app.include_router(simulate_router)

@app.get("/")
def read_root():
    return {"message": "Backend is up and running!"}
