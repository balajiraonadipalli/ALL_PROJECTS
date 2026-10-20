# Blog Editor Web App

A full-stack blog editor application built with the MERN stack (MongoDB, Express, React, Node.js). This app enables users to write, edit, save drafts, and publish blogs. Auto-saving drafts, user-specific access control, and JWT-based authentication are supported.

## 🌟 Features

- ✅ Register & Login with secure JWT authentication
- 📝 Create, edit, and delete your own blogs
- 💾 Auto-save drafts every 5 seconds after inactivity
- 📂 Drafts visible only to the creator
- 🌍 Published blogs visible to all users (view-only if not owner)
- 🔐 Only owners can edit or delete their blogs
- 🛎️ Toast notifications for user feedback

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios, React Toastify, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas using Mongoose (or local MongoDB)
- **Authentication**: JWT tokens stored in localStorage

## 📁 Project Structure

```
frontend/
│   ├── components/     # BlogEditor, BlogCard, etc.
│   ├── pages/          # AllBlogsPage, EditorPage, AuthPage, ProfilePage
│   ├── styles/         # CSS Modules
│   └── App.jsx         # Route configurations

backend/
│   ├── controllers/    # Blog and Auth logic
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas for Blog and User
│   ├── routes/         # API routes
│   ├── config/         # MongoDB connection config
│   └── server.js       # Express server entry
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed on your system
- MongoDB installed locally (or access to MongoDB Atlas)
- A code editor (e.g., VS Code)

### Step-by-step Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/satyamahesh03/blogEditor.git
cd BlogEditor
```

2. **Setup Backend:**

- Navigate to the backend directory:

```bash
cd backend
```

- Install backend dependencies:

```bash
npm install
```

- Create a `.env` file in the `backend` folder with the following environment variables:

```env
# Use the following for local MongoDB connection:
MONGO_URI=mongodb://localhost:27017/Blog

# Or replace with your MongoDB Atlas URI if preferred:
# MONGO_URI=your_mongo_uri

JWT_SECRET=your_jwt_secret_key
PORT=6500
```

- Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:6500`.

3. **Setup Frontend:**

- Open a new terminal window/tab, and navigate to the frontend directory:

```bash
cd frontend
```

- Install frontend dependencies:

```bash
npm install
```

- Start the frontend development server:

```bash
npm run dev
```

The frontend app will typically be available at `http://localhost:5173` (or the port shown in your terminal).

4. **Using the Application:**

- Open your browser and visit the frontend URL.
- Register a new user or login if you already have an account.
- Create, edit, save drafts, publish blogs, and explore the features.

## 🔗 API Endpoints

| Method | Endpoint                | Description              | Auth Required |
|--------|-------------------------|--------------------------|---------------|
| POST   | /api/auth/register      | Register new user        | ❌            |
| POST   | /api/auth/login         | Login user               | ❌            |
| GET    | /api/blogs              | Get all blogs            | ✅            |
| GET    | /api/blogs/:id          | Get blog by ID           | ✅            |
| POST   | /api/blogs/save-draft   | Save or update draft     | ✅            |
| POST   | /api/blogs/publish      | Publish blog             | ✅            |
| DELETE | /api/blogs/:id          | Delete blog (owner only) | ✅            |

## 📌 License

This project is licensed under the MIT License.
# blogEditor
