# LetsChat API reference

This document describes the routes currently mounted by `backend/letschatapp.js` and `backend/routes/`.

## Base URLs

| Service | Local example | Deployed example |
| --- | --- | --- |
| REST API | `http://localhost:<PORT>/api` | `https://letschat-1-8pfq.onrender.com/api` |
| Health check | `http://localhost:<PORT>/ping` | `https://letschat-1-8pfq.onrender.com/ping` |
| WebSocket | `ws://localhost:<PORT>` | `wss://letschat-1-8pfq.onrender.com` |

All REST request and response bodies use JSON unless specified otherwise. Send `Content-Type: application/json` with JSON request bodies.

## Authentication

- Signup and login return an access token (15 minutes) and refresh token (7 days). They also set `httpOnly` cookies.
- Protected REST routes accept `Authorization: Bearer <accessToken>` or the `accessToken` cookie.
- Refresh uses `Authorization: Bearer <refreshToken>`.
- Logout reads the `refreshToken` cookie; send requests with credentials so the browser includes it.
- WebSocket connections accept the access token in `?token=<accessToken>` or an Authorization bearer header. The frontend uses the query parameter.

Example protected REST request:

```http
GET /api/auth/my-rooms
Authorization: Bearer <accessToken>
```

## Authentication routes

| Method | Path | Auth | Request | Success |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | No | `{ "username", "email", "password" }` | `201`, message, `userId`, `accessToken`, `refreshToken` |
| `POST` | `/api/auth/login` | No | `{ "username", "password" }` | `200`, message, `userId`, `accessToken`, `refreshToken` |
| `POST` | `/api/auth/logout` | Refresh-token cookie | No body | `200`, `{ "message": "Logout successful" }` |
| `POST` | `/api/auth/refresh-token` | Refresh token in bearer header | No body | `200`, new `accessToken` and `refreshToken` |
| `POST` | `/api/auth/forgot-password` | No | `{ "username" }` | `200`, verification email sent |
| `POST` | `/api/auth/verify-code` | No | `{ "email", "code" }` | `200`, code verified |
| `POST` | `/api/auth/reset-password` | No | `{ "username", "code", "newPassword" }` | `200`, password reset |

Signup example:

```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "your-password"
}
```

Login example:

```json
{
  "username": "jane_doe",
  "password": "your-password"
}
```

Password reset codes expire after three minutes. The verify-code endpoint checks the code but does not issue a separate reset token; reset-password checks the code again.

## User and room discovery routes

| Method | Path | Auth | Request | Success |
| --- | --- | --- | --- | --- |
| `GET` | `/api/auth/my-rooms` | Access token | None | Array of rooms the user belongs to, with populated members/admins/requests |
| `GET` | `/api/auth/users/:id` | Access token | Mongo user ID in path | User `{ "_id", "username", "email" }` |
| `GET` | `/api/rooms/all-rooms` | Access token | Optional `?search=<term>` | Array of rooms, newest first; search matches name or unique name |

Example room search:

```http
GET /api/rooms/all-rooms?search=general
Authorization: Bearer <accessToken>
```

## Room routes

All routes in this section require an access token. Admin-only actions are marked in the permission column.

| Method | Path | Request JSON | Permission / result |
| --- | --- | --- | --- |
| `POST` | `/api/rooms/make-room` | `{ "name", "uniqueName" }` | Creates a room; current user becomes its first member and admin. Returns `201` and the room. |
| `POST` | `/api/rooms/delete-room` | `{ "roomId" }` | Admin only. Deletes the room and removes it from users' room lists. |
| `POST` | `/api/rooms/add-member` | `{ "roomId", "userIdToAdd" }` or `{ "roomId", "username" }` | Admin only. Adds the user and clears their join request. |
| `POST` | `/api/rooms/remove-member` | `{ "roomId", "userIdToRemove" }` | Admin only. Removes the user and any admin role. |
| `POST` | `/api/rooms/leave` | `{ "roomId" }` | Current user leaves and loses any admin role in that room. |
| `POST` | `/api/rooms/make-admin` | `{ "roomId", "userIdToMakeAdmin" }` | Admin only. Promotes a user; adds them as a member if needed. |
| `POST` | `/api/rooms/remove-admin` | `{ "roomId", "userIdToRemoveAdmin" }` | Admin only. Removes the target's admin role but keeps membership. |
| `POST` | `/api/rooms/request-joinroom` | `{ "roomId" }` | Current user requests to join. Rejects existing members and duplicate requests. |
| `POST` | `/api/rooms/cancel-request` | `{ "roomId" }` | Current user cancels their pending request. |
| `POST` | `/api/rooms/reject-request` | `{ "roomId", "userIdToReject" }` | Admin only. Removes the target's pending request. |
| `POST` | `/api/rooms/get-messages` | `{ "roomId" }` | Room members only. Returns messages oldest first, with sender username populated. |

Successful room updates generally return `{ "message", "room" }`. Delete returns `{ "message" }`.

## WebSocket chat protocol

Connect to the WebSocket base URL with a valid access token:

```text
wss://letschat-1-8pfq.onrender.com/?token=<accessToken>
```

The server first sends a connection event:

```json
{
  "type": "connected",
  "userId": "<user-id>"
}
```

Send a room message as JSON. `roomID` must identify an existing room that the connected user belongs to. `text` is required by the message schema; `media` may contain a media URL.

```json
{
  "roomID": "<room-id>",
  "text": "Hello, room!",
  "media": null
}
```

The server saves the message, publishes it to Redis, and broadcasts this shape to connected members:

```json
{
  "_id": "<message-id>",
  "sender": "<user-id>",
  "senderUsername": "jane_doe",
  "roomID": "<room-id>",
  "text": "Hello, room!",
  "time": "2026-09-27T10:30:00.000Z",
  "media": null
}
```

The `media` URL can be uploaded directly to Cloudinary by the frontend. See [`frontend/CLOUDINARY_SETUP.md`](../frontend/CLOUDINARY_SETUP.md).

The server closes unauthenticated connections with code `4001`, invalid-token connections with `4002`, and connections for a logged-out user with `4003`. Room or persistence errors are returned as JSON messages with an `error` property.

### Image-only message note

The frontend currently sends image messages with an empty `text` value. The Mongoose message schema marks `text` as required, so image-only messages may fail validation. Include non-empty text with media or update the schema/validation to support media-only messages.

## Health check

`GET /ping` is unauthenticated and returns plain text `pong` with HTTP `200` when the Express server is responding. It is mounted at the server root, outside the `/api` prefix.

## Common status codes

| Status | Meaning |
| --- | --- |
| `200` | Request completed successfully. |
| `201` | Resource created successfully. |
| `400` | Missing/invalid input, duplicate request, or invalid operation. |
| `401` | Access token is missing. |
| `403` | Token is invalid/expired, or the user lacks permission. |
| `404` | User, room, or requested resource was not found. |
| `409` | Signup username already exists. |
| `500` | Server-side error. |

Errors usually return JSON with a `message` field; some handlers also return an `error` field or use an `error` field alone. Exact error text depends on the endpoint.
