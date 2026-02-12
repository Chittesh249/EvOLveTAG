import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PaperList from "./pages/PaperList";
import UploadPaper from "./pages/UploadPaper";
import AdminDashboard from "./pages/AdminDashboard";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import Newsletters from "./pages/Newsletters";
import NewsletterDetail from "./pages/NewsletterDetail";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="container" style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { token, loading, isAdmin } = useAuth();
  if (loading) return <div className="container" style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/profile" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="papers" element={<PaperList />} />
        <Route path="members" element={<Members />} />
        <Route path="members/:id" element={<MemberProfile />} />
        <Route path="newsletters" element={<Newsletters />} />
        <Route path="newsletters/:slugOrId" element={<NewsletterDetail />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="upload" element={<ProtectedRoute><UploadPaper /></ProtectedRoute>} />
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
