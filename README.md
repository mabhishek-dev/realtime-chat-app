# Real-Time Chat App (Chatty)

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)

A full-stack **real-time chat application** built with **React, TypeScript, Node.js, Express, MongoDB, and Socket.IO**.  
The application allows users to communicate instantly, send images, manage profiles, and experience seamless real-time messaging.

---

## Live Demo

[View Live Demo](https://realtime-chat-app-346v.onrender.com)

> ⚠️ **Note:**  
> This project is deployed on Render (free tier) as a **single service** (backend serves the frontend).  
> On first load, the server may take around **30–60 seconds** to start.  
> Once the backend becomes active, the frontend will load automatically.

---

## Tech Stack

### Frontend

- **React (TypeScript)**
- **Vite**
- **Tailwind CSS + DaisyUI**
- **Zustand**
- **React Router**
- **Axios**
- **Socket.IO Client**

---

### Backend

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **Socket.IO**
- **JWT**
- **bcryptjs**
- **Cookie Parser**

---

### Services

- **Cloudinary** (image storage)

---

## Features

- Real-time one-to-one messaging using Socket.IO  
- Send and receive text and images instantly  
- Online/offline user status with active user filtering  
- Secure authentication using JWT + HTTP-only cookies (7-day session)  
- Protected routes with proper authorization  
- Profile management with avatar upload  
- Message timestamps  
- Multiple UI themes with persistent preference  
- Toast notifications for user feedback  
- Zustand-based state management for smooth UI updates  

---

## Project Structure

```text
realtime-chat-app/
│
├── frontend/
├── backend/
└── screenshots/
```

---

## Environment Variables

Create a `.env` file inside the **backend** folder and update it with your own values:

```
NODE_ENV=development
PORT=5001

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/mabhishek-dev/realtime-chat-app.git
cd realtime-chat-app
```

---

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

### Run Application

Open two terminals

**Backend**
```bash
cd backend
npm run dev
```

**Frontend**
```bash
cd frontend
npm run dev
```

---

## Screenshots

### Chat Demo
![Chat](https://raw.githubusercontent.com/mabhishek-dev/realtime-chat-app/main/screenshots/demo-chat.png)

### Home Page
![Home](https://raw.githubusercontent.com/mabhishek-dev/realtime-chat-app/main/screenshots/home-page.png)

### Login Page
![Login](https://raw.githubusercontent.com/mabhishek-dev/realtime-chat-app/main/screenshots/login-page.png)

### Signup Page
![Signup](https://raw.githubusercontent.com/mabhishek-dev/realtime-chat-app/main/screenshots/sign-up-page.png)

### Profile Page
![Profile](https://raw.githubusercontent.com/mabhishek-dev/realtime-chat-app/main/screenshots/profile-page.png)

### Settings Page
![Settings](https://raw.githubusercontent.com/mabhishek-dev/realtime-chat-app/main/screenshots/settings-page.png)

---

## License

This project is licensed under the **MIT License**.
