

# 📚 QuickRev

**AI-powered flashcard platform that turns your notes into exam-ready practice questions.**

Built by a team of M.Sc. Software Systems students at Coimbatore Institute of Technology.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [API Reference](#-api-reference) • [Team](#-team)

---

## Overview

QuickRev solves a simple problem: self-study revision is inefficient when your notes just sit there. Paste in a passage from your study material, and QuickRev's AI generates exam-style question-and-answer flashcards automatically — tagged by difficulty, organized by topic, and shareable with friends for group study.

## ✨ Features

- 🔐 **Secure authentication** — JWT-based sessions with bcrypt-hashed passwords
- 🤖 **AI flashcard generation** — paste any passage, get 5 difficulty-tagged Q&A pairs powered by the Gemini API
- 🗂️ **Topic organization** — group flashcards by heading and subject
- 👥 **Friend system** — add classmates by username and view their topic headings for shared study
- 📊 **Dashboard** — track topic, flashcard, and friend counts at a glance
- ⏱️ **Rate-limited AI endpoint** — prevents API abuse (5 requests/minute per user)
- 📱 **Fully responsive** — works cleanly on mobile, tablet, and desktop

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express |
| Database | MySQL |
| AI | Google Gemini API |
| Auth | JWT, bcryptjs |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MySQL 5.7+ (or MariaDB)
- A free [Gemini API key](https://aistudio.google.com/apikey) — no credit card required

### 1. Clone the repository

```bash
git clone https://github.com/ajiteshd2007-sudo/Quickrev.git
cd quickrev
```

### 2. Set up the database

```bash
cd server
npm install
node database/import.js
```

> `import.js` reads `database/schema.sql` and creates the `quickrev` database and all tables using your `.env` credentials — no separate MySQL client needed.

### 3. Configure environment variables

**Server** (`server/.env`):

```bash
cp .env.example .env
```

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_NAME=quickrev
DB_USER=root
DB_PASS=your_mysql_password

JWT_SECRET=replace_with_a_long_random_string

GEMINI_API_KEY=your_gemini_api_key
```

**Client** (`client/.env`):

```bash
cd ../client
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Run the app

In two separate terminals:

```bash
# Terminal 1 — API server
cd server
npm run dev
```

```bash
# Terminal 2 — React frontend
cd client
npm run dev
```

Visit **http://localhost:5173** and create an account.

## 📁 Project Structure

```
quickrev/
├── server/
│   ├── src/
│   │   ├── index.js              # Express app entry point
│   │   ├── config/db.js          # MySQL connection pool
│   │   ├── middleware/auth.js    # JWT auth guard
│   │   └── routes/
│   │       ├── auth.js           # Register / login
│   │       ├── topics.js         # Topic CRUD + dashboard stats
│   │       ├── flashcards.js     # AI flashcard generation
│   │       ├── friends.js        # Friend system
│   │       └── contact.js        # Contact form
│   └── database/
│       ├── schema.sql            # Full database schema
│       └── import.js             # Schema importer (bypasses mysql CLI issues)
└── client/
    └── src/
        ├── pages/                 # Route-level components
        ├── components/            # Header, Footer, RequireAuth
        ├── context/AuthContext.jsx
        ├── api.js                 # Axios instance with auth interceptor
        └── styles/global.css      
```

## 🔌 API Reference

<<<<<<< HEAD
All endpoints (except `/auth/*`) require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Log in, returns a JWT |
| `GET` | `/api/topics` | List the current user's topics |
| `GET` | `/api/topics/stats` | Dashboard counts (topics/flashcards/friends) |
| `POST` | `/api/topics` | Create a topic |
| `GET` | `/api/topics/:id` | Get a topic and its flashcards |
| `POST` | `/api/flashcards/generate` | Generate flashcards from a passage via Gemini |
| `GET` | `/api/friends` | List friends |
| `POST` | `/api/friends` | Add a friend by username |
| `GET` | `/api/friends/:id/topics` | View a friend's topic headings |
| `POST` | `/api/contact` | Submit a contact form message |

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `users` | Account credentials and profile info |
| `topics` | User-created study topics (heading, subject, source notes) |
| `flashcards` | AI-generated Q&A pairs linked to a topic, tagged by difficulty |
| `friendships` | Mutual friend connections between users |
| `sessions` | Revision activity log (for future analytics) |
| `api_rate_limits` | Optional persistent rate-limiting store |

Full definitions in [`server/database/schema.sql`](server/database/schema.sql).

## 🧭 Roadmap

- [ ] Spaced-repetition scheduling
- [ ] Weak-topic detection based on quiz performance
- [ ] Knowledge graph linking related topics
- [ ] Email delivery for the contact form

## 👥 Team

| Name |
|---|
| Ajitesh D |
| Sankar S |
| Aswin Kumar U |
| Yuvaraj V |


📧 quickrev.org@gmail.com

## 📄 License

This project was built for academic purposes as part of a team coursework assignment.
=======
Ajitesh D · Sankar S · Aswin Kumar U · Yuvaraj V

📧 quickrev.org@gmail.com · 📞 +91 63838 74330 / +91 87780 34787 / +91 8870332120 / +91 6381271196
>>>>>>> b39f247 (Added Logo for Quickrev)
