import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/papers", label: "Papers" },
    { to: "/members", label: "Members" },
    { to: "/newsletters", label: "Newsletters" },
  ];

  return (
    <header className="site-header">
      <div className="header-inner container">
        <NavLink to="/home" className="logo">
          Evolve TAG
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          {token ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/upload" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Upload
                  </NavLink>
                  <NavLink to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Admin
                  </NavLink>
                </>
              )}
              <span className="nav-user">{user?.name || user?.email || "User"}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
