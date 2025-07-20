import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ResearchPapers from './pages/ResearchPapers';
import UploadPaper from './pages/UploadPaper';
import Layout from './components/Layout';
import PaperList from './pages/PaperList';
import Home from "./pages/Home";
import BlogPage from './pages/BlogPage';
import BlogPost from './components/Blog/BlogPost';
import CreatePost from './components/Blog/CreatePost';
import PostList from './components/Blog/PostList';

// Utility to check if token exists
const isAuthenticated = () => !!localStorage.getItem('token');

// Protected route component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Main routes with Layout (includes Navbar) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<PaperList />} />
        <Route path="papers" element={<PaperList />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="upload" element={<ProtectedRoute element={<UploadPaper />} />} />
        
        {/* Blog routes nested under Layout */}
        <Route path="blog" element={<BlogPage />}>
          <Route index element={<PostList />} />
          <Route path="create" element={<ProtectedRoute element={<CreatePost />} />} />
          <Route path="posts/:id" element={<BlogPost />} />
        </Route>
      </Route>
      
      {/* Auth routes without Layout */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Optional: redirect unknown routes */}
      <Route path="*" element={<Navigate to="/papers" replace />} />
    </Routes>
  );
}

export default App;