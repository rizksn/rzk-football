# 🏈 RZK Football | Fantasy Application and Mock Draft Simulator

A smart, strategic fantasy football draft simulator built with **Next.js**, featuring a human-like CPU that mimics real fantasy drafters using real ADP data, positional needs, market inefficiencies, and controlled randomness.

---

## 🚀 Version 1.1.1 — Initial Public Release

### ✅ Features

- 💻 **Next.js frontend** styled with TailwindCSS
- 🐍 **Custom Python draft engine** handling CPU logic
- 📊 **Puppeteer scraper** pulling real-time ADP data (DraftSharks)
- 🧠 **CPU Draft Engine v1.1**
  - Score-based logic (ADP, ECR, Tiers, Upside)
  - Market inefficiency detection (ADP vs ECR)
  - Roster-based positional filtering
  - Tier-aware tiebreak logic
  - Controlled randomness to simulate real draft variance
- 🪄 **Drag-and-drop player queue**
- 📋 **Roster panel + live draft board**
- 🔄 Full snake-draft logic with user + CPU teams

---

## 🧠 Draft Engine Philosophy

Our CPU doesn’t just draft by ADP — it *thinks*:

- 📉 Penalizes overdrafted players
- 📈 Identifies undervalued gems (ECR vs ADP)
- 🧩 Adjusts picks in real-time based on roster needs (e.g. no QB2 in early rounds)
- 🔄 Uses randomness to simulate human inconsistency

---

## 📦 Tech Stack

- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Backend**: Python (custom draft engine)
- Puppeteer (for scraping ADP)
- Modular, monorepo-based architecture
---

## 🔮 Roadmap

- 🔢 Configurable draft settings (1QB / Superflex / PPR)
- 🧠 CPU Team Personality Profiles (Zero RB, Hero WR, etc.)
- 💾 Save + resume drafts
- 📈 Draft analytics dashboard
- 🎨 Dark mode support

---

## 🧑‍💻 Author

**Sherif Rizk**  
Software engineer & fantasy football enthusiast  
[LinkedIn](https://www.linkedin.com/in/sherif-rizk) · [GitHub](https://github.com/rizksn)

---

