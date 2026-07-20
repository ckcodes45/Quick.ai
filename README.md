# Quick.ai

AI SaaS Platform built with MERN + Gemini + Cloudinary.

## Features
- Article Generator
- Blog Title Generator
- Image Generator
- Background Remover
- Object Remover
- Resume Reviewer
- Community Showcase
- Creation Rating System
- Authentication & Credits System

## Tech Stack
Frontend:
- React
- Tailwind CSS
- React Router

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL (NeonDB)

Authentication:
- Clerk

AI & Media:
- Gemini API
- Cloudinary

## Project Architecture

### Backend Structure

#### server.js
Main entry point of the backend application.
Responsible for:
- Starting Express server
- Configuring middlewares
- Connecting Cloudinary
- Registering routes

#### cloudinary.js
Handles Cloudinary configuration and authentication.

Used for:
- Image uploads
- Background removal
- Object removal

#### aiRoutes.js
Acts as the routing layer for all AI APIs.

Examples:
- Generate Article
- Generate Image
- Remove Background
- Resume Review
- Rate Creation
- Publish Creation

#### multer.js
Handles multipart/form-data uploads.

Required because:
Node.js cannot process raw file uploads directly.

#### auth.js
Custom authentication middleware.

Responsibilities:
- User verification
- Credit protection
- Route security

#### aiController.js
Core business logic of the application.

Responsibilities:
- Calling Gemini APIs
- Processing AI prompts
- Handling Cloudinary operations
- Saving results to database

#### db.js
Database configuration using Neon Serverless PostgreSQL.

#### userRoutes.js
Handles:
- User creations
- Published content

#### userController.js
Controls:
- Community features
- Dashboard history
- User interactions

---

## Frontend Structure

### main.jsx
Frontend entry point.

Responsibilities:
- Bootstrapping React
- Injecting App into DOM
- Setting up router

### App.jsx
Frontend route manager.

Responsible for:
- Page routing
- Route protection
- Navigation flow

### Layout.jsx
Dashboard wrapper component.

Provides:
- Sidebar
- Navbar
- Authentication guard

### Sidebar.jsx
Navigation component for all AI tools.

### GenerateArticle.jsx
UI page for AI article generation.

Communicates with:
POST /api/ai/generate-article

### GenerateBlogTitles.jsx
AI blog title generation interface.

### GenerateImage.jsx
AI image generation page.

Returns generated image URLs.

### RemoveBackground.jsx
Uploads image and removes background.

Uses FormData for file transfer.

### RemoveObject.jsx
Removes selected objects from uploaded images.

Uses:
- image file
- object prompt text

### ReviewResume.jsx
Uploads resume PDF and returns AI review.

### Dashboard.jsx
Displays:
- Usage statistics
- User generations
- Account information

### Community.jsx
Public gallery for published AI creations.

---

## Environment Variables

Create a `.env` file inside backend folder:

```env
DATABASE_URL=your_database_url
CLERK_SECRET_KEY=your_clerk_key
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/ckcodes45/Quick.ai.git
```

---

## Move into Project Folder

```bash
cd Quick.ai
```

---

# Install Dependencies

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Install Backend Dependencies

Open another terminal:

```bash
cd ../backend
npm install
```

---

# Run Project with Docker (Recommended)

```bash
docker-compose up -d
```

---

# Run Project Locally (Without Docker)

## Start Backend Server

Inside backend folder:

```bash
npm run server
```

---

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

---

# Local URLs

Frontend:

```txt
http://localhost:5175 (Docker) or http://localhost:5173 (Local)
```

Backend:

```txt
http://localhost:3000
```

---

# Future Improvements

- Payment Integration
- AI Chat Assistant
- AI Code Generator
- Better Mobile Responsiveness
- Team Collaboration

---

# Author

Made with ❤️ by Chahat Khandelwal