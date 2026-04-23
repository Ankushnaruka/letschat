# LetsChat Frontend

A React chat application connected to the LetsChat API.

## Project Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root component & state management
    ├── styles.js             # Global CSS-in-JS styles
    ├── components/
    │   ├── AuthScreen.jsx    # Login / Sign up screen
    │   ├── Sidebar.jsx       # Room list sidebar
    │   ├── ChatHeader.jsx    # Active room header with actions
    │   ├── MessageList.jsx   # Scrollable message thread
    │   ├── MessageInput.jsx  # Text input + send button
    │   ├── RightPanel.jsx    # Room info, members, requests
    │   ├── CreateRoomModal.jsx  # Modal to create a new room
    │   ├── EmptyState.jsx    # Shown when no room is selected
    │   └── Toast.jsx         # Notification toasts
    ├── hooks/
    │   └── useWebSocket.js   # WS connection with auto-reconnect
    └── utils/
        ├── api.js            # Fetch wrapper for REST API
        └── helpers.js        # Date formatting & message grouping
```

## Getting Started

```bash
npm install
npm run dev
```

## API
- Base URL: `https://letschat-1-8pfq.onrender.com/api`
- WebSocket: `wss://letschat-1-8pfq.onrender.com`
