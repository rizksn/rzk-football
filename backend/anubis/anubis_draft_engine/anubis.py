import json
import os
from fastapi import APIRouter, HTTPException, Request
from typing import List, Dict, Any
import asyncio
from anubis_draft_engine.draft.anubis_ai import anubis_decide
from anubis_draft_engine.draft.prompt_builder import build_prompt

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'adp-consensus-ppr.json')

def extract_team_roster(draft_board: List[List[Dict[str, Any]]], team_index: int) -> List[str]:
    roster = []
    for round in draft_board:
        if not isinstance(round, list) or team_index >= len(round):
            continue
        player = round[team_index]
        if not player:
            continue
        pos = player.get("pos", "UNK")
        name = player.get("name", "Unknown")
        team = player.get("team", "FA")
        roster.append(f"{pos}: {name} ({team})")
    return roster

@router.post("/simulate")
async def simulate_draft_plan(request: Request) -> Dict[str, Any]:
    body = await request.json()
    draft_board = body.get("draftBoard", [])
    team_index = body.get("teamIndex", 11)

    try:
        with open(DATA_PATH, 'r') as f:
            data = json.load(f)
            players = data.get("data", [])

        if not players:
            raise HTTPException(status_code=400, detail="No players found in ADP data.")

        team_roster = extract_team_roster(draft_board, team_index)
        league_format = "12-team, 0.5 PPR, 1QB, 2RB, 2WR, 1TE, 2FLEX"
        round_number = 4
        top_8_players = players[:8]

        for p in top_8_players:
            p["pos"] = p.get("pos", "WR")
            p["team"] = p.get("team", "FA")
            p["stats"] = p.get("stats", "placeholder 2024 stats")

        prompt = build_prompt(team_roster, top_8_players, round_number, league_format)

        print("📨 Prompt to DeepSeek:\n", prompt)

        # ✅ Run blocking model call in background
        loop = asyncio.get_event_loop()
        ai_response = await loop.run_in_executor(executor, lambda: anubis_decide(prompt))

        print("🧠 DeepSeek response:\n", ai_response)

        return {"result": ai_response}

    except Exception as e:
        print("❌ Draft simulation failed:", str(e))
        raise HTTPException(status_code=500, detail=f"Draft simulation failed: {str(e)}")