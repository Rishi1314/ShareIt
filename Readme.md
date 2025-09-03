# ShareIt 🚀

A modern full-stack file-sharing web application built using **Next.js**, **Express**, **PostgreSQL**, **Prisma**, **Redis**, and **IPFS (via Pinata)**. Easily upload, share, and retrieve files securely using custom aliases, protected links, and Google OAuth login.

---

## 🌐 Live Demo

🔗 Frontend: [https://shareit.vercel.app](https://shareit.vercel.app)  
🔗 Backend: [https://shareitbackend.onrender.com](https://shareitbackend.onrender.com)

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS  
- **Backend**: Express.js + TypeScript  
- **Database**: PostgreSQL + Prisma ORM  
- **Authentication**: Google OAuth 2.0 + JWT  
- **File Storage**: IPFS (via Pinata)  
- **Cache**: Redis  
- **Deployment**: Vercel (frontend) + Render (backend)  

---

## ✨ Features

- 🔐 Google OAuth login  
- 📂 Upload files to IPFS using custom alias  
- 🔑 Optional password-protected file access  
- 🔍 Retrieve files via alias  
- 🧠 Intelligent routing with loading states and transitions  
- 📈 Dashboard with recent uploads  
- 🌐 Mobile responsive and production-ready  

---

## 📁 Folder Structure

```
ShareIt/
│
├── client/               # Next.js frontend
│   ├── pages/            # Routes (index, upload, retrieve, dashboard, etc.)
│   ├── hoc/              # Auth HOC
│   ├── context/          # AuthContext
│   ├── styles/           # Tailwind + global CSS
│   └── ...               # Configs, .env, etc.
│
├── server/               # Express backend
│   ├── routes/           # Auth, Upload, Retrieve, View
│   ├── controllers/
│   ├── middlewares/
│   ├── prisma/           # Prisma schema and client
│   └── dist/             # Compiled output (TS)
│
└── .env.example          # Environment variable template
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ShareIt.git
cd ShareIt
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
# Fill in your env details (DB URL, JWT secret, Pinata keys, Google Client ID/Secret)

npm install
npx prisma generate
npm run build
npm start
```

### 3. Setup the Frontend

```bash
cd client
cp .env.example .env
# Add NEXT_PUBLIC_BACKEND_URL and any other required variables

npm install
npm run dev
```

---

## 🌍 Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=yourSecretKey
PINATA_API_KEY=...
PINATA_SECRET_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=
FRONTEND_URL=
```

### Frontend `.env`

```env
NEXT_PUBLIC_BACKEND_URL=
```

---

## 🛡️ Security & Deployment Notes

- Enforce HTTPS in production  
- Do not hardcode secrets – always use `.env` or deployment secrets  
- Enable CORS and rate limiting on backend  
- Hosted using [Render](https://render.com) (backend) and [Vercel](https://vercel.com) (frontend)  

---

## 🧑‍💻 Author

**Rishi Raj**  
📧 rishirajprof@gmail.com  
🌐 [LinkedIn](https://linkedin.com/in/brishiraj)

---

## ⭐️ Show Your Support

If you like this project, please ⭐ the repo and share it with others!

---

## 📜 License

This project is licensed under the [MIT License](LICENSE)
