# NexCRM

A full-stack CRM system for managing contacts, deals, tasks, and email communication — built with a React frontend and a Node.js/Express + MongoDB backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT-based authentication |

## Features

- Contact management
- Deal/pipeline tracking
- Task management
- Email logging and communication history
- Reporting dashboard

## Project Structure

```
NexCRM/
├── backend/
│   ├── routes/       # auth, contacts, deals, tasks, emails, reports
│   ├── models/        # Mongoose schemas
│   └── middleware/     # auth & request middleware
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── services/
```

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Configure environment variables (MongoDB URI, JWT secret) in a `.env` file in `backend/` before running.
