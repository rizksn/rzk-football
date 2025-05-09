def build_prompt(team_roster, available_players, round_number, league_format):
    player_lines = "\n".join([
        f"{p['name']} ({p['team']} - {p['pos']}) - ADP: {p['adp']} - 2024: {p['stats']}"
        for p in available_players
    ])

    prompt = f"""
You are a strategic fantasy football analyst. Your goal is to give smart, well-reasoned advice using natural language.

This is a 2025 redraft in a {league_format}.

Team has made the following picks:
{', '.join(team_roster)}

It is now Round {round_number}. The following players are available:

{player_lines}

Who should this team draft next and why? Please respond in full sentences. Be detailed about what factors you considered (ADP, positional need, stats, upside, etc).
"""
    return prompt
