import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ActivityBar from "./components/currentactivitybar";
import Allrooms from "./components/rooms";
import Login from "./pages/login";
import Home from "./pages/home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !token ? <Login onLogin={setToken} /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/home"
          element={
            token ? (
              <>
                <Home/>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;