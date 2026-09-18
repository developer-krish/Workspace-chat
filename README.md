# Workspace Chat

A production-grade full-stack workspace chat application: create workspaces, invite members, organize channels, and message in real time. The frontend is built with **Vite**, **React**, **Tailwind CSS v4**, and **Motion**; the backend is powered by **Node.js**, **Express**, **MongoDB**, **JWT** sessions, and **Socket.io** for real-time synchronization.

---

## Repository Layout

```
Chatting-application/
├── backend/
│   ├── controllers/            # Controller handlers separating route logic
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── messageController.js
│   │   └── workspaceController.js
│   ├── middleware/
│   │   ├── asyncHandler.js     # Global async error catcher
│   │   ├── authMiddleware.js   # JWT validator
│   │   ├── errorMiddleware.js  # Centralized error formatter
│   │   ├── validate.js         # Zod request payload schema validator
│   │   └── workspaceMiddleware.js # Workspace security boundary validator
│   ├── models/                 # Mongoose schemas with database indexes
│   │   ├── Channel.js
│   │   ├── Message.js
│   │   ├── User.js
│   │   └── Workspace.js
│   ├── routes/                 # Explicit route declarations
│   │   ├── auth.js
│   │   ├── channel.js
│   │   ├── message.js
│   │   └── workspace.js
│   ├── utils/
│   │   ├── appError.js         # Operational error helper class
│   │   └── logger.js           # Standardized logger
│   ├── validation/
│   │   └── schemas.js          # Zod schema definitions
│   ├── socket.js               # Modular socket.io connection logic
│   ├── server.js               # Express + HTTP entrypoint
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── components/
│       │   └── LoadingScreen.jsx
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── ChatMessagesView.jsx
│       │   └── Team.jsx
│       ├── utils/
│       │   ├── apiClient.js    # Custom Axios client with request/response interceptors
│       │   └── chatTime.js
│       ├── App.jsx             # State router & route guards
│       ├── Auth.jsx            # Register/Login view (uses apiClient)
│       ├── Chat.jsx            # Main chat workspace layout
│       ├── config.js           # Endpoint loader
│       ├── index.css
│       ├── main.jsx            # Boots React App wrapped in BrowserRouter
│       └── motionVariants.js
└── README.md
```

---

## Key Refactoring & Security Hardening

This project has been restructured following principal-level software engineering guidelines:
1. **Workspace Access Boundaries**: Users can only read channels or load/post messages if they are registered members of that workspace. Enforced via `workspaceMiddleware.js`.
2. **Message Deletion Guard**: Message deletion requests `/api/messages/:id` now verify ownership. Only the message sender can delete it.
3. **Structured Validation**: Leverages **Zod** schemas in `backend/validation/schemas.js` to validate incoming requests, helping block NoSQL injection vectors.
4. **Resilient MongoDB Lifecycle**: Set up reconnect and drop handlers to manage MongoDB connection transitions.
5. **Fail-Fast Bootstrapping**: Validates environment variables (`MONGO_URI`, `JWT_SECRET`) on startup, halting compilation and providing clear setup instructions if missing.
6. **Centralized Error Flow**: Async handlers are wrapped in `asyncHandler` to delegate errors to the centralized `errorMiddleware`, preventing raw server details from leaking to clients in production.
7. **Database Indexes**: Configured single and compound indexes on key fields (`Workspace.members`, `Channel.workspace`, `Message.channel`, and `Message.createdAt`) to optimize queries under load.
8. **Interceptors-based API Client**: Relocated token loading and header injections into a centralized `apiClient.js` instance, eliminating manual `axiosConfig` configuration.

---

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **MongoDB** connection string (e.g. MongoDB Atlas)
- Backend and frontend running concurrently for local development.

---

## Backend: Environment Variables

Create `backend/.env` locally:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=some_long_secure_secret_key
```

*Note: The application will fail-fast with a detailed error log if any of these variables are missing.*

---

## Installation & Running

### Backend
Open a terminal in `backend/` and run:
```bash
npm install
npm start
```
Starts Express server on `http://localhost:5000` (or `process.env.PORT`).

### Frontend
Open a terminal in `frontend/` and run:
```bash
npm install
npm run dev
```
Development server starts on `http://localhost:5173`.

---

## Contributors

| Name            | Email                        | Role                       |
| --------------- | ---------------------------- | -------------------------- |
| Shivam Nauriyal | shivamnauriyal1224@gmail.com | System design and frontend |
| Krish Gupta     | krishgupta.udh@gmail.com     | System design and backend  |
