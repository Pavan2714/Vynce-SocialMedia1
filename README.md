# 🚀 Vynce - Modern Social Media Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
</div>

<br />

<div align="center">
  <h3>🌟 A Full-Stack Social Media Platform with Modern UI/UX</h3>
  <p>Built with React, Node.js, MongoDB, and enhanced with real-time features</p>
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features--capabilities)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)

## 🌟 Overview

Vynce is a modern, full-featured social media platform that combines the best aspects of Instagram and Twitter. Built with the MERN stack and featuring a sleek dark theme with glassmorphism effects, it provides users with a seamless social networking experience across all devices.

### 🎯 Key Highlights

- **Instagram-style Stories** with 24-hour lifecycle
- **Multi-image Posts** with intelligent grid layouts
- **Real-time Interactions** with optimistic UI updates
- **Responsive Design** optimized for mobile and desktop
- **Secure Authentication** via Clerk integration
- **Cloud Media Storage** with Cloudinary optimization

## ✨ Core Features & Capabilities

### 🔐 **Advanced Authentication & User Management**

- **Seamless Auth Flow**: Clerk-powered authentication with social login integration
- **Role-Based Authorization**: Secure API endpoints with middleware protection
- **Profile Customization**: Rich user profiles with bio, profile pictures, and verification badges
- **Account Security**: Password recovery, email verification, and session management

### 📝 **Dynamic Content Creation & Management**

- **Multi-Media Posts**: Support for 1-4 image uploads with intelligent grid layouts
- **Rich Text Processing**: Hashtag highlighting and mention support
- **Content Moderation**: Post deletion with confirmation dialogs and ownership validation
- **Draft Management**: Auto-save functionality for post creation

### ❤️ **Interactive Engagement System**

- **Smart Reactions**: Like/Unlike with optimistic UI updates and real-time feedback
- **Bookmark System**: Save/Unsave posts with personal collection management
- **Double-Tap Gestures**: Mobile-optimized interaction patterns
- **Engagement Analytics**: Like counts and interaction tracking

### 📱 **Instagram-Style Stories Experience**

- **24-Hour Lifecycle**: Automatic story expiration with timestamp tracking
- **Multi-Format Support**: Image, video, and text story creation
- **Story Viewer**: Swipe navigation with progress indicators
- **User Grouping**: Intelligent story organization by user with chronological sorting

### 💬 **Real-Time Communication Hub**

- **Threaded Comments**: Nested comment structure with reply functionality
- **Live Updates**: Real-time comment loading without page refresh
- **Comment Management**: Delete permissions for comment owners
- **Pagination Support**: Efficient loading of comment threads

### 🖼️ **Professional Media Management**

- **Cloudinary Integration**: Automatic image optimization and CDN delivery
- **Multiple Upload**: Drag-and-drop interface with progress indicators
- **Format Support**: JPEG, PNG, WebP images and MP4 videos
- **Compression**: Automatic file size optimization for faster loading

### 📐 **Responsive Design Excellence**

- **Mobile-First Architecture**: Optimized for all screen sizes (320px - 4K)
- **Adaptive Grid System**: Dynamic image layouts based on content count
- **Touch Interactions**: Gesture-based navigation and actions
- **Progressive Loading**: Lazy loading with skeleton screens

### 👥 **Social Networking Features**

- **User Discovery**: Profile browsing and user search functionality
- **Follow System**: Follow/Unfollow with follower count tracking
- **Activity Feed**: Personalized content based on user connections
- **Profile Analytics**: User engagement metrics and statistics

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern UI framework with hooks and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Redux Toolkit** - Predictable state management with modern Redux patterns
- **React Router DOM** - Declarative client-side routing
- **Clerk React** - Complete authentication and user management solution
- **Lucide React** - Beautiful, customizable SVG icons
- **React Hot Toast** - Elegant notification system
- **Moment.js** - Date manipulation and formatting

### **Backend**

- **Node.js 18+** - JavaScript runtime built on Chrome's V8 engine
- **Express.js** - Fast, minimalist web application framework
- **MongoDB** - Flexible, document-based NoSQL database
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **Cloudinary** - Cloud-based image and video management platform
- **Clerk Backend** - Server-side authentication via webhooks
- **CORS** - Cross-origin resource sharing middleware

### **Development & Deployment**

- **ESLint** - Static code analysis for identifying problematic patterns
- **Prettier** - Opinionated code formatter for consistent style
- **Nodemon** - Development utility that automatically restarts the server
- **Git** - Version control system for tracking changes

## 🚀 Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB Atlas** account (or local MongoDB installation)
- **Cloudinary** account for media storage
- **Clerk** account for authentication services

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vynce-social-media.git
cd vynce-social-media
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## 🔧 Environment Setup

### Backend Configuration (.env)

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vynce-db

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration (.env)

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Vynce

# Development Settings
VITE_NODE_ENV=development
```

## 🎮 Usage

### Development Mode

```bash
# Terminal 1: Start Backend Server
cd Backend
npm run dev

# Terminal 2: Start Frontend Development Server
cd Frontend
npm run dev
```

### Production Build

```bash
# Build Frontend for Production
cd Frontend
npm run build

# Start Production Server
cd Backend
npm start
```

### Application URLs

- **Frontend Development**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

## 👨‍💻 Author & Maintainer

**Pavan Kumar**

- **GitHub**: [@pavankumar](https://github.com/yourusername)
- **LinkedIn**: [Pavan Kumar](https://linkedin.com/in/yourprofile)
- **Email**: pavan@yourdomain.com
- **Portfolio**: [pavankumar.dev](https://yourportfolio.com)

## 🙏 Acknowledgments & Credits

Special thanks to the following technologies and services that made this project possible:

- **[Clerk](https://clerk.dev/)** - For providing excellent authentication services
- **[Cloudinary](https://cloudinary.com/)** - For reliable media storage and optimization
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** - For cloud database hosting
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - For beautiful, consistent iconography
- **[React Community](https://reactjs.org/)** - For the amazing ecosystem and support

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd Frontend
vercel --prod
```

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy to Railway
cd Backend
railway deploy
```

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform's dashboard.

---

<div align="center">
  <h3>🌟 Made with ❤️ using React, Node.js, and MongoDB</h3>
  <p>If you found this project helpful, please consider giving it a ⭐ on GitHub!</p>
</div>

<div align="center">
  <a href="#-vynce---modern-social-media-platform">Back to Top ⬆️</a>
</div>
