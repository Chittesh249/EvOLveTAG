import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './auth/Login';
import Signup from './auth/Signup';
import Profile from './pages/Profile';
import { fetchProfile } from './api/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await fetchProfile();
        setUser(user);
      } catch {
        setUser(null);
      }
    };
    init();
  }, []);

  const handleAuth = user => setUser(user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/profile" : "/login"} />} />
        <Route path="/login" element={<Login onAuth={handleAuth} />} />
        <Route path="/signup" element={<Signup onAuth={handleAuth} />} />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
