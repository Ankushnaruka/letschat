# LetsChat

LetsChat is a full-stack real-time chat application built with the MERN stack and WebSockets. It supports user authentication, room-based messaging, and instant communication between users in different chat rooms.

---

## 🚀 Tech Stack

### Backend

- **Node.js & Express:**  
  REST API server for authentication, room management, and user operations.

- **MongoDB & Mongoose:**  
  Stores users, rooms, and messages. Mongoose schemas define data structure and relationships.

- **JWT Authentication:**  
  Secure user authentication using JSON Web Tokens.

- **WebSocket (`ws`):**  
  Real-time messaging using the `ws` library. Each client connects via WebSocket for instant message delivery.

- **CORS:**  
  Configured to allow frontend requests during development.

### Frontend

- **React:**  
  Modern UI built with React.

- **Vite:**  
  Fast development server and build tool.

- **Zustand:**  
  Lightweight state management for handling active room selection and global state.

- **React Router:**  
  Handles client-side routing for login and home pages.

---

## 📁 Project Structure

```
letschat/
│
├── backend/
│   ├── controllers/    # Express route handlers (auth, room, member management)
│   ├── middlewares/    # JWT authentication middleware
│   ├── models/         # Mongoose schemas for User, Room, Message
│   ├── routes/         # Express route definitions
│   ├── ws/             # WebSocket server setup
│   ├── .env            # Environment variables (JWT secret, Mongo URI, etc.)
│   └── letschatapp.js  # Main server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (rooms, message area, etc.)
│   │   ├── pages/        # Page-level components (login, home)
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   └── vite.config.js    # Vite configuration
│
└── .gitignore            # Ignores node_modules, .env, logs, etc.
```

---

## ✨ Key Features

- **User Authentication:**  
  Sign up and log in with JWT-secured endpoints.

- **Room Management:**  
  Create, join, leave, and manage chat rooms. Admins can add/remove members and promote/demote admins.

- **Real-Time Messaging:**  
  Send and receive messages instantly in rooms via WebSocket.

- **State Management:**  
  Uses Zustand for managing active room state across components.

- **Responsive UI:**  
  Built with React and styled for a modern chat experience.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (local or Atlas)

### Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/letschat.git
   cd letschat
   ```

2. **Backend**
   - Install dependencies:
     ```sh
     cd backend
     npm install
     ```
   - Configure `.env` with your MongoDB URI and JWT secret:
     ```
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=8080
     ```
   - Start the server:
     ```sh
     node letschatapp.js
     ```

3. **Frontend**
   - Install dependencies:
     ```sh
     cd ../frontend
     npm install
     ```
   - Start the development server:
     ```sh
     npm run dev
     ```

4. **Access the app**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔒 Environment & Git Ignore

- All `node_modules` and `.env` files are ignored via `.gitignore` to keep your repository clean and secure.
- Example `.gitignore` entries:
  ```
  node_modules/
  .env
  **/node_modules/
  **/.env
  *.log
  ```

---

## 📝 Notes

- WebSocket server runs on the same port as the backend (`:8080`).
- The frontend expects the backend at `http://localhost:8080`.
- Room and user membership logic is kept in sync between user and room documents.
- For production, review security, error handling, and scalability.

---

## 📄 License

MIT

---

**Happy chatting!**
