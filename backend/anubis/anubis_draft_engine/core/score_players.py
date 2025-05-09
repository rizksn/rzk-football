import random
from typing import List, Dict, Any

def convert_adp_to_absolute(adp: str, team_size: int = 12) -> int:
    """Converts ADP like '2.10' to absolute pick number."""
    try:
        round_str, pick_str = adp.split('.')
        round_num = int(round_str)
        pick_num = int(pick_str)
        return (round_num - 1) * team_size + pick_num
    except Exception:
        return 9999  # Fallback for malformed ADP

def random_in_range(min_val: float, max_val: float) -> float:
    return random.uniform(min_val, max_val)

def scaled_variance(offset: float, max_var: float = 10.0, growth_rate: float = 0.1) -> float:
    """Variance grows with offset but is capped."""
    return min(offset * growth_rate, max_var)

def score_players(players: List[Dict[str, Any]], team_size: int = 12, total_rounds: int = 15) -> List[Dict[str, Any]]:
    total_picks = team_size * total_rounds
    scored = []

    for player in players:
        adp = str(player.get("adp", ""))
        absolute_adp = convert_adp_to_absolute(adp, team_size)
        base_score = ((total_picks - absolute_adp) / total_picks) * 100

        offset = max(absolute_adp - 12, 0)
        variance = scaled_variance(offset)
        noise = random_in_range(-variance, +variance)

        final_score = base_score + noise

        scored.append({
            **player,
            "absolute_adp": absolute_adp,
            "final_score": final_score,
            "_debug": {
                "adp": adp,
                "absolute_adp": absolute_adp,
                "base_score": f"{base_score:.2f}",
                "variance": f"{variance:.2f}",
                "noise": f"{noise:.2f}",
                "final_score": f"{final_score:.2f}"
            }
        })

    return scored
