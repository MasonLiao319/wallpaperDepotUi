import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../routes/AuthContext";
import 'bootstrap-icons/font/bootstrap-icons.css';



export default function NavBar() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <nav className="navbar navbar-light bg-light">Loading...</nav>;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Wallpaper Depot</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user.firstName}</span>
                </li>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    <i className="bi bi-cart fs-5"></i> {/* Adjust size with fs-5 */}
                  </Link>
                </li>
                <li className="nav-item">
                <Link to="/logout" className="btn btn-outline-danger nav-link">
                  Logout
                </Link>
              </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    <i className="bi bi-cart fs-5"></i> {/* Adjust size with fs-5 */}
                  </Link>
                </li>

              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
