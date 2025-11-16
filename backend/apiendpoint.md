Collecting workspace information# 🚀 LetsChat API Endpoints Documentation

## 📋 Base URL
```
https://letschat-1-8pfq.onrender.com/api
```

---

## 🔐 Authentication Endpoints

### 1. **Sign Up**
- **Route:** `POST /auth/signup`
- **Description:** Register a new user
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Response (201):**
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. **Login**
- **Route:** `POST /auth/login`
- **Description:** Authenticate user and get tokens
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```
- **Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. **Refresh Token**
- **Route:** `POST /auth/refresh-token`
- **Description:** Get new access token using refresh token
- **Headers:**
```
Authorization: Bearer <refreshToken>
Content-Type: application/json
```
- **Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔑 Password Reset Endpoints

### 4. **Forgot Password**
- **Route:** `POST /auth/forgot-password`
- **Description:** Request password reset code via email
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "john_doe"
}
```
- **Response (200):**
```json
{
  "message": "Verification code sent to email"
}
```

---

### 5. **Verify Reset Code**
- **Route:** `POST /auth/verify-code`
- **Description:** Verify the password reset code
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```
- **Response (200):**
```json
{
  "message": "Code verified"
}
```

---

### 6. **Reset Password**
- **Route:** `POST /auth/reset-password`
- **Description:** Reset password with verified code
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "john_doe",
  "code": "123456",
  "newPassword": "newsecurepassword123"
}
```
- **Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## 👤 User Endpoints

### 7. **Get My Rooms**
- **Route:** `GET /auth/my-rooms`
- **Description:** Get all rooms for authenticated user
- **Headers:**
```
Authorization: Bearer <accessToken>
```
- **Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "General Chat",
    "uniqueName": "general-chat",
    "admins": ["507f1f77bcf86cd799439001"],
    "members": ["507f1f77bcf86cd799439001", "507f1f77bcf86cd799439002"],
    "requests": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 🏠 Room Management Endpoints

### 8. **Create Room**
- **Route:** `POST /rooms/make-room`
- **Description:** Create a new chat room
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "name": "General Chat",
  "uniqueName": "general-chat"
}
```
- **Response (201):**
```json
{
  "message": "Room created successfully",
  "room": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "General Chat",
    "uniqueName": "general-chat",
    "admins": ["507f1f77bcf86cd799439001"],
    "members": ["507f1f77bcf86cd799439001"],
    "requests": []
  }
}
```

---

### 9. **Delete Room**
- **Route:** `POST /rooms/delete-room`
- **Description:** Delete a room (admin only)
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```
- **Response (200):**
```json
{
  "message": "Room deleted successfully"
}
```

---

## 👥 Member Management Endpoints

### 10. **Add Member**
- **Route:** `POST /rooms/add-member`
- **Description:** Add a user to a room (admin only)
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011",
  "userIdToAdd": "507f1f77bcf86cd799439002"
}
```
- **Response (200):**
```json
{
  "message": "Member added successfully",
  "room": { /* room object */ }
}
```

---

### 11. **Remove Member**
- **Route:** `POST /rooms/remove-member`
- **Description:** Remove a user from a room (admin only)
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011",
  "userIdToRemove": "507f1f77bcf86cd799439002"
}
```
- **Response (200):**
```json
{
  "message": "Member removed successfully",
  "room": { /* room object */ }
}
```

---

### 12. **Leave Room**
- **Route:** `POST /rooms/leave`
- **Description:** Leave a room as current user
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```
- **Response (200):**
```json
{
  "message": "You have left the room",
  "room": { /* room object */ }
}
```

---

## 🛡️ Admin Management Endpoints

### 13. **Make Admin**
- **Route:** `POST /rooms/make-admin`
- **Description:** Promote a user to admin (admin only)
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011",
  "userIdToMakeAdmin": "507f1f77bcf86cd799439002"
}
```
- **Response (200):**
```json
{
  "message": "User promoted to admin successfully",
  "room": { /* room object */ }
}
```

---

### 14. **Remove Admin**
- **Route:** `POST /rooms/remove-admin`
- **Description:** Demote an admin to regular member (admin only)
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011",
  "userIdToRemoveAdmin": "507f1f77bcf86cd799439002"
}
```
- **Response (200):**
```json
{
  "message": "Admin rights removed successfully",
  "room": { /* room object */ }
}
```

---

## 📨 Join Request Endpoints

### 15. **Request Room Join**
- **Route:** `POST /rooms/request-joinroom`
- **Description:** Send a join request to a room
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```
- **Response (200):**
```json
{
  "message": "Join request sent successfully",
  "room": { /* room object */ }
}
```

---

### 16. **Cancel Join Request**
- **Route:** `POST /rooms/cancel-request`
- **Description:** Cancel a pending join request
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```
- **Response (200):**
```json
{
  "message": "Join request cancelled successfully",
  "room": { /* room object */ }
}
```

---

## 💬 Message Endpoints

### 17. **Get Room Messages**
- **Route:** `POST /rooms/get-messages`
- **Description:** Get all messages in a room
- **Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```
- **Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```
- **Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "sender": {
      "_id": "507f1f77bcf86cd799439001",
      "username": "john_doe"
    },
    "room": "507f1f77bcf86cd799439011",
    "text": "Hello everyone!",
    "media": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 🔌 WebSocket Events

### Connection
```
wss://letschat-1-8pfq.onrender.com
```
### Headers
```
Authorization: Bearer eyJfaWQiOiI2OGI5ZDQ0NDJm......
```

### Message Format
```json
{
  "text": "Hello!",
  "roomID": "507f1f77bcf86cd799439011"
}
```

### Receive Message
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "sender": "507f1f77bcf86cd799439001",
  "roomID": "507f1f77bcf86cd799439011",
  "text": "Hello!",
  "time": "2024-01-15T10:30:00.000Z",
  "media": null
}
```

---

## ✅ Health Check Endpoint

### 18. **Ping**
- **Route:** `GET /ping`
- **Description:** Check server health
- **Response (200):**
```
pong
```

---

## 🔒 Authentication

All endpoints (except signup, login, forgot-password, verify-code, reset-password, and ping) require:

```
Authorization: Bearer <accessToken>
```

**Token Format:** JWT signed with `JWT_SECRET`

---

## 📊 Error Responses

### Common Errors

**401 Unauthorized:**
```json
{
  "message": "Access token missing"
}
```

**403 Forbidden:**
```json
{
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "message": "Room not found"
}
```

**400 Bad Request:**
```json
{
  "message": "All fields are required"
}
```

**500 Server Error:**
```json
{
  "message": "Server error",
  "error": "error details"
}
```

---

## 🔄 Summary Table

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/auth/signup` | ❌ | Register user |
| 2 | POST | `/auth/login` | ❌ | Login user |
| 3 | POST | `/auth/refresh-token` | ✅ | Refresh access token |
| 4 | POST | `/auth/forgot-password` | ❌ | Request password reset |
| 5 | POST | `/auth/verify-code` | ❌ | Verify reset code |
| 6 | POST | `/auth/reset-password` | ❌ | Reset password |
| 7 | GET | `/auth/my-rooms` | ✅ | Get user's rooms |
| 8 | POST | `/rooms/make-room` | ✅ | Create room |
| 9 | POST | `/rooms/delete-room` | ✅ | Delete room |
| 10 | POST | `/rooms/add-member` | ✅ | Add member |
| 11 | POST | `/rooms/remove-member` | ✅ | Remove member |
| 12 | POST | `/rooms/leave` | ✅ | Leave room |
| 13 | POST | `/rooms/make-admin` | ✅ | Promote to admin |
| 14 | POST | `/rooms/remove-admin` | ✅ | Demote admin |
| 15 | POST | `/rooms/request-joinroom` | ✅ | Request to join |
| 16 | POST | `/rooms/cancel-request` | ✅ | Cancel join request |
| 17 | POST | `/rooms/get-messages` | ✅ | Get messages |
| 18 | GET | `/ping` | ❌ | Health check |