# Tourism MERN App

A full-stack tourism destination application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Destination Management**: Browse, search, and filter tourist destinations
- **User Dashboard**: Save/bookmark destinations and view bookings
- **Admin Dashboard**: Add, edit, and delete destinations
- **OCR Integration**: Google Cloud Vision API for image text extraction
- **Responsive Design**: Built with Tailwind CSS

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Google Cloud Vision API (OCR)
- Multer for file uploads
- Express Validator for input validation

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tourism-mern-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Backend environment variables (create `backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tourism-app
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_EXPIRE=30m
   JWT_REFRESH_EXPIRE=7d
   
   # Google Cloud Vision API (for OCR)
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Destinations
- `GET /api/destinations` - Get all destinations (with pagination and search)
- `GET /api/destinations/:id` - Get single destination
- `POST /api/destinations` - Create destination (admin only)
- `PUT /api/destinations/:id` - Update destination (admin only)
- `DELETE /api/destinations/:id` - Delete destination (admin only)

### User Actions
- `POST /api/users/:id/save/:destId` - Save/unsave destination
- `GET /api/users/:id/saved` - Get saved destinations
- `POST /api/users/booking` - Create booking
- `GET /api/users/:id/bookings` - Get user bookings

### OCR
- `POST /api/ocr` - Extract text from image

## Usage

1. **Register/Login**: Create an account or login to access user features
2. **Browse Destinations**: Use the home page to search and filter destinations
3. **View Details**: Click on any destination to see detailed information
4. **Save Destinations**: Save destinations to your personal dashboard
5. **Book Trips**: Create bookings for your desired destinations
6. **Admin Features**: Admin users can manage destinations through the admin dashboard

## Project Structure

```
tourism-mern-app/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── services/    # API services
│   └── public/          # Static files
└── package.json         # Root package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

