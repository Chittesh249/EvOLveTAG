import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ResearchPapers from './pages/ResearchPapers';
import UploadPaper from './pages/UploadPaper';

// Utility to check if token exists
const isAuthenticated = () => !!localStorage.getItem('token');

// Protected route component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/papers" element={<ResearchPapers />} />
        <Route path="/upload" element={<ProtectedRoute element={<UploadPaper />} />} />
        {/* Optional: redirect unknown routes */}
        <Route path="*" element={<Navigate to="/papers" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
