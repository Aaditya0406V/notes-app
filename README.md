# Multi-User Notes App

## 1. Project overview

A beginner-friendly MERN (MongoDB, Express, React, Node.js) app where many users can register, log in and manage their own private notes. Each user can only see, edit and delete their own notes.

## 2. Features

- Register, login and logout
- Protected notes area (login required)
- Create, list, view, update and delete notes
- Every note belongs to exactly one user; users can never access each other's notes
- Passwords hashed with bcryptjs; authentication with JWT

## 3. Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Context API, native Fetch, plain CSS |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs, dotenv, cors |
| Database | MongoDB (local) |
| Dev tool | nodemon |

## 4. Folder structure

```
notes-app/
  frontend/
    src/
      components/   Navbar, NoteCard, NoteForm, ProtectedRoute
      pages/        Login, Register, Notes, NoteDetails
      context/      AuthContext
      services/     api.js
      routes/       AppRoutes
      App.jsx  main.jsx  index.css
    public/
    index.html  .env  .env.example  package.json  vite.config.js
  backend/
    src/
      config/       db.js
      models/       User.js, Note.js
      controllers/  authController.js, noteController.js
      middleware/   authMiddleware.js, errorMiddleware.js
      routes/       authRoutes.js, noteRoutes.js
      app.js  server.js
    .env  .env.example  .gitignore  package.json
  .gitignore
  README.md
```

## 5. Frontend architecture

- `main.jsx` mounts the app inside `BrowserRouter` and `AuthProvider`.
- `AuthContext.jsx` stores the token and user, restores them from `localStorage` on startup, and provides `login()` and `logout()`.
- `services/api.js` is the only place that talks to the backend (native Fetch).
- `ProtectedRoute.jsx` redirects visitors without a token to `/login`.
- Pages use components (`NoteCard`, `NoteForm`) and call functions from `api.js`. React never touches MongoDB.

## 6. Backend architecture

- `routes/` only map URLs to controller functions (no business logic).
- `middleware/authMiddleware.js` verifies the JWT and sets `req.userId`.
- `controllers/` hold the application logic.
- `models/` hold the Mongoose schemas.
- `middleware/errorMiddleware.js` returns simple JSON errors.
- `app.js` configures Express; `server.js` connects to MongoDB and starts the server.

## 7. Database structure

Database: `notes_app`

**User**: `name`, `email` (unique, lowercase), `password` (bcrypt hash), `createdAt`

**Note**: `title`, `content`, `userId` (reference to User), `createdAt`, `updatedAt`

One User has many Notes. Every Note belongs to exactly one User.

## 8. API route table (backend)

| Method | URL | Auth | Description |
| --- | --- | --- | --- |
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Log in, returns token and user |
| GET | /api/notes | Yes | List the logged-in user's notes |
| GET | /api/notes/:id | Yes | Get one of your notes |
| POST | /api/notes | Yes | Create a note |
| PUT | /api/notes/:id | Yes | Update one of your notes |
| DELETE | /api/notes/:id | Yes | Delete one of your notes |
| GET | /api/health | No | Health check |

## 9. Frontend route table

| URL | Access | Page |
| --- | --- | --- |
| /login | Public | Login.jsx |
| /register | Public | Register.jsx |
| /notes | Protected | Notes.jsx |
| /notes/:id | Protected | NoteDetails.jsx |

**Frontend routes vs backend API routes:** frontend routes (`/login`, `/register`, `/notes`, `/notes/:id`) are pages shown in the browser by React Router at http://localhost:5173. Backend API routes (`/api/auth/register`, `/api/auth/login`, `/api/notes`, `/api/notes/:id`) are data endpoints on http://localhost:5000 that the frontend calls with Fetch. They only look similar: one shows screens, the other returns JSON.

## 10. Authentication flow

1. Register: the form calls `registerUser()` -> `POST /api/auth/register` -> controller validates input, checks for an existing email, hashes the password with bcryptjs and creates the user.
2. Login: `loginUser()` -> `POST /api/auth/login` -> controller finds the user, compares the bcrypt hash, creates a JWT and returns the token with basic user data.
3. The frontend saves the token in `localStorage` under `token`. `AuthContext` restores it on startup.
4. Protected requests send `Authorization: Bearer <token>`.
5. Logout removes the token, clears auth state and redirects to `/login`.

## 11. Multi-user ownership explanation

`authMiddleware` verifies the JWT and sets `req.userId` from the token. The frontend never sends a `userId` for ownership. Controllers always include `userId: req.userId` in database queries:

- List: `Note.find({ userId: req.userId })`
- Read: `Note.findOne({ _id, userId: req.userId })`
- Create: the note is saved with `userId: req.userId`
- Update: `Note.findOneAndUpdate({ _id, userId: req.userId }, ...)`
- Delete: `Note.findOneAndDelete({ _id, userId: req.userId })`

If a note exists but belongs to someone else, the API returns `404 Note not found`, exactly like a note that does not exist. This way User A cannot even learn that User B's note ID exists.

## 12. Request flow

```
React component
  -> frontend/src/services/api.js
  -> HTTP request (Fetch)
  -> Express route
  -> authMiddleware (protected routes)
  -> controller
  -> Mongoose model
  -> MongoDB
  -> controller response (JSON)
  -> api.js
  -> React component
```

## 13. Prerequisites

- Windows with PowerShell
- Node.js LTS (includes npm): https://nodejs.org
- MongoDB Community Server (local): https://www.mongodb.com/try/download/community

## 14. Local MongoDB setup

1. Install MongoDB Community Server and keep the option "Install MongoDB as a Service" selected.
2. Check the service is running: open Services (`services.msc`) and look for "MongoDB Server", or run `Get-Service MongoDB` in PowerShell.
3. Start it if needed: `net start MongoDB` (run PowerShell as Administrator).
4. No username or password is needed. The database `notes_app` is created automatically on first use.

## 15. Environment variable setup

Both `.env` files already exist (the `.env` files are ignored by git). The `.env.example` files show the format.

`backend/.env`
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/notes_app
JWT_SECRET=<random development secret>
```

`frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## 16. Backend installation

```
cd notes-app\backend
npm install
```

## 17. Frontend installation

```
cd notes-app\frontend
npm install
```

(The setup script already ran both installs. If you unzip the project elsewhere, run them yourself.)

## 18. Running the backend

```
cd notes-app\backend
npm run dev
```

You should see `MongoDB connected` and `Server running on http://localhost:5000`. Check http://localhost:5000/api/health.

## 19. Running the frontend

Open a second PowerShell window:

```
cd notes-app\frontend
npm run dev
```

Open http://localhost:5173

## 20. Testing registration/login

1. Open http://localhost:5173/register and create an account.
2. You are sent to `/login`. Log in with the same email and password.
3. You land on `/notes`. Your name appears in the navbar.
4. Click Logout. You return to `/login`. Visiting `/notes` now redirects to `/login`.

## 21. Testing CRUD notes

1. Create: fill in the form on `/notes` and click "Add note".
2. Read: the note appears in the list. Click Edit to open `/notes/:id`.
3. Update: change the title or content and click "Update note".
4. Delete: use Delete on the list or on the details page.

## 22. Testing multi-user isolation

1. Register and log in as User A. Create a note called "A's secret".
2. Log out. Register and log in as User B (different email).
3. User B's `/notes` list does not show "A's secret".
4. Copy the note's ID from User A's URL (`/notes/<id>`) and open that URL as User B. You get "Note not found".
5. Optional API check with User B's token:
   `curl -X DELETE http://localhost:5000/api/notes/<A-note-id> -H "Authorization: Bearer <B-token>"` returns 404 and the note is not deleted.

## 23. Common troubleshooting

| Problem | Fix |
| --- | --- |
| `Could not connect to MongoDB` | Start the MongoDB service (`net start MongoDB` as Administrator). |
| `Cannot reach the server` in the browser | Start the backend (`npm run dev` in `backend`). Check port 5000 is free. |
| Port 5000 or 5173 already in use | Close the other program or change `PORT` in `backend/.env` (and `VITE_API_URL` in `frontend/.env`). |
| Changed a `.env` file but nothing changed | Restart the backend / Vite dev server. |
| Redirected to `/login` unexpectedly | Your token expired (7 days) or is invalid. Log in again. |
| `JWT_SECRET is missing` | Make sure `backend/.env` exists (copy from `.env.example`). |
| `npm` or `node` not recognized | Install Node.js LTS and reopen PowerShell. |

## 24. Example URLs

- Frontend: http://localhost:5173
- Login page: http://localhost:5173/login
- Notes page: http://localhost:5173/notes
- Backend health: http://localhost:5000/api/health
- Notes API: http://localhost:5000/api/notes
