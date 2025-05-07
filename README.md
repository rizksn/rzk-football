# 🏈 RZK Football | AI Fantasy Draft Simulator

A smart, customizable fantasy football draft simulator with a full-stack architecture. Built for realism, flexibility, and future expansion — blending ADP-based modeling, drag-and-drop drafting, and a protected Python backend.

---

## 🚀 Core Features

- ⚛️ **Modern Frontend** — Built with Next.js, Tailwind, and TypeScript
- 🧠 **AI-Ready Draft Engine** — Python backend ready for advanced CPU logic
- 🔄 **Snake Draft Logic** — Full round-by-round draft simulation
- 🪄 **Drag-and-Drop Queue** — Sortable draft queue with real-time interactivity
- 📋 **Roster Panel** — Auto-fills players into correct slots (WR, FLX, etc.)
- 🧩 **Protected Logic** — Core draft engine logic is modular and excluded from version control

---

## 🛠 Tech Stack

- **Frontend**: Next.js App Router, TypeScript, TailwindCSS
- **Backend**: FastAPI + Python (ADP scraping + draft simulation)
- **Scraping**: Playwright for live consensus ADP from DraftSharks
- **Queue/Sort**: dnd-kit for draggable user queue

---

## 🧠 Coming Soon

- 🎛 CPU Strategy Configurator (Zero RB, Balanced, Hero WR, etc.)
- 📈 Draft Analytics Overlay
- 💾 Save/Load Drafts
- 🎯 Multi-mode Draft Settings (1QB, Superflex, TEP)
- 👥 Multiplayer or Guest Draft Sessions

---

## 🔒 Draft Engine Security

All sensitive logic is located in `/backend/draft_engine/` and protected via `.gitignore` to prevent public indexing. This ensures long-term security as the project grows toward production.

---

## 👤 Author

**Sherif Rizk**  
Software Engineer | Fantasy Strategist  
[LinkedIn](https://www.linkedin.com/in/sherif-rizk) · [GitHub](https://github.com/rizksn)

---

> 🧪 Version: Pre-Alpha – Local Dev Only  
> Stable for internal development and demonstration purposes.
