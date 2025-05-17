# 🏈 RZK Football | AI Fantasy Draft Simulator

A smart, customizable fantasy football draft simulator with a full-stack architecture. Built for realism, flexibility, and future expansion — blending ADP-based modeling, drag-and-drop drafting, and a protected Python backend.

---

## 🚀 Core Features

- ⚛️ **Modern Frontend** — Built with Next.js, Tailwind, and TypeScript
- 🧠 **AI-Ready Draft Engine** — Python backend with modular LLM logic (DeepSeek 7B)
- 🔄 **Snake Draft Simulation** — Full round-by-round draft logic
- 🪄 **Drag-and-Drop Queue** — Sortable draft queue with real-time interactivity
- 📋 **Roster Panel** — Auto-fills players into correct slots (WR, FLX, etc.)
- 🔧 **Local + Remote Ready** — Clean separation between frontend and backend infrastructure

---

## 🛠 Tech Stack

- **Frontend**: Next.js App Router, TypeScript, TailwindCSS
- **Backend**: FastAPI + Python (LLM draft simulation + ADP scraping)
- **Scraping**: Playwright for live consensus ADP from DraftSharks
- **Queue/Sort**: `@dnd-kit` for draggable user queue

---

## 🧠 Coming Soon

- 🎛 CPU Strategy Configurator (Zero RB, Balanced, Hero WR, etc.)
- 📈 Draft Analytics Overlay
- 💾 Save/Load Drafts
- 🎯 Multi-mode Draft Settings (1QB, Superflex, TEP)
- 👥 Multiplayer or Guest Draft Sessions

---

## 🔒 Draft Engine & Security

This app includes a **private backend draft engine** located in `/backend/anubis/`, excluded from this repo via `.gitignore` to protect proprietary logic.

The private backend (housed in a separate GitHub repo) includes:

- 🧠 LLM client logic with HuggingFace Transformers (DeepSeek 7B Chat)
- 🔧 Prompt engineering modules
- 🧮 Player filtering, draft state analysis, and team roster parsing
- 🔄 Turn-based CPU draft simulation via FastAPI

> If you're a recruiter or hiring manager and would like access for review, feel free to reach out.

---

## 👤 Author

**Sherif Rizk**  
Software Engineer | Fantasy Strategist  
[LinkedIn](https://www.linkedin.com/in/sherif-rizk) · [GitHub](https://github.com/rizksn)

---

> 🧪 Version: Pre-Alpha – Local Dev Only  
> Stable for internal development and demonstration purposes.