import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm.jsx";
import RssData from "./RssData.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false); 
  };

  return (
    <Router>
      <Routes>
        {/* Default Route: Redirect to Login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/RssData" replace />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />

        {/* RSS Data route (protected) */}
        <Route
          path="/RssData"
          element={
            isAuthenticated ? (
              <RssData onLogout={handleLogout} /> 
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all route: Redirect to Login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

