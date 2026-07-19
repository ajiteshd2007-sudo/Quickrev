# QuickRev (Node.js + React version)

Same app as the PHP version, rebuilt with a **Node.js/Express API** and a **React (Vite) frontend**,
still backed by **MySQL** and the **Anthropic API** for AI flashcard generation.

```
quickrev-node/
├── server/     Express API (auth, topics, flashcards, friends, contact)
└── client/     React frontend (Vite)
```

## 1. Set up the database

You need MySQL running (XAMPP's MySQL works fine — you don't need Apache or phpMyAdmin for this version).

```bash
mysql -u root -p < server/database/schema.sql
```

## 2. Run the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_NAME=quickrev
DB_USER=root
DB_PASS=            # your MySQL password, blank if none
JWT_SECRET=some-long-random-string
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then start it:
```bash
npm run dev
```
The API runs at `http://localhost:3000`. Check `http://localhost:3000/api/health` — should return `{"ok":true}`.

## 3. Run the frontend

In a **second terminal**:
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Vite will print a URL, normally `http://localhost:5173`. Open that in your browser.

## 4. Use it

Sign up, add a topic, paste a passage, click **Generate Flashcards**. The frontend calls the Express API,
which calls the Anthropic API and writes the results to MySQL.

## Notes

- Auth uses JWT stored in `localStorage` (not cookies/sessions), so the separate React dev server and API
  server can talk to each other without extra session config. The token is sent as `Authorization: Bearer <token>`.
- The AI rate limiter (5 requests/minute per user) is in-memory in `server/src/routes/flashcards.js`. Fine
  for local dev/single instance; swap to the `api_rate_limits` table in `schema.sql` (or Redis) if you deploy
  with multiple server instances.
- To build the frontend for production: `cd client && npm run build`, then serve the `dist/` folder with
  any static host (or have Express serve it — ask if you want that wired up).

## Team

Ajitesh D · Sankar S · Aswin Kumar U · Yuvaraj V
Coimbatore Institute of Technology, M.Sc. Software Systems
📧 projectteam672736@gmail.com · 📞 +91 63838 74330 / +91 87780 34787
