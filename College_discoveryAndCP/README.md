# DiscoverEd_assignment (College Discovery & Comparison Platform)

A modern, full-stack web application designed to help students discover, analyze, and compare colleges seamlessly. Features a premium SaaS-like UI with rich animations and micro-interactions.

**GitHub Repository:** [https://github.com/balajiraonadipalli/DiscoverEd_assignment](https://github.com/balajiraonadipalli/DiscoverEd_assignment)

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion & GSAP
- **State Management**: Zustand
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios & qs

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (Mongoose)
- **Environment**: dotenv
- **Middleware**: CORS

## 📁 Project Structure

```text
DiscoverEd_assignment/
├── frontend/             # React SPA (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components (Cards, Sidebars, etc.)
│   │   ├── layouts/      # Layout wrappers (Admin, Public)
│   │   ├── pages/        # Page views (Discovery, Detail, Compare, Admin)
│   │   ├── services/     # API logic (Axios setups)
│   │   ├── store/        # Zustand global states (Compare Store)
│   │   ├── utils/        # Helpers (e.g., Tailwind class merging `cn.js`)
│   │   ├── App.jsx       # Root router component
│   │   └── index.css     # Global CSS and Tailwind directives
│   └── package.json
│
└── backend/              # Express API Server
    ├── config/           # Database & environment configurations
    ├── controllers/      # Route handler logic
    ├── models/           # Mongoose schemas
    ├── routes/           # Express API endpoints
    ├── scripts/          # Helper scripts (e.g., database seeding)
    ├── server.js         # Entry point for backend
    └── package.json
```

## ✨ Key Features

1. **Parallax Hero Slider**: Animated, highly immersive detail pages with smooth image carousels.
2. **Dynamic UI States**: Graceful loading boundaries, optimistic UI updates, and animated toast alerts via Sonner.
3. **Advanced Filtering**: Live search, debounce queries, and multi-select programs querying MongoDB using regex operations.
4. **Compare Mode**: Floating compare bar using Zustand allowing side-by-side analysis of up to 3 colleges.
5. **Modern Visuals**: Glassmorphism, soft drop shadows, and Framer Motion spring-physics layout transitions.

## 🛠️ Installation & Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file containing your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   ```
4. Start the server (runs on `http://localhost:5000` by default):
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if needing to override the default API URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development client:
   ```bash
   npm run dev
   ```

## 📝 Usage Overview

- **Discovery Page**: Browse via the `/` route. Interact with sidebar filters globally.
- **College Detail Page**: Access comprehensive info via `/college/:slug`.
- **Compare Flow**: Select "Add to Compare" on cards to trigger the floating UI bar. Follow to `/compare` to view metrics.
- **Admin**: Create and manage institutions dynamically via the backend CRUD APIs.

## 🤝 License

Created for educational/portfolio purposes.
