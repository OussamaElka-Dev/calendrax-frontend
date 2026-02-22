import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaHistory, FaUser, FaPlus } from "react-icons/fa";
import "./Mobile.css";

function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="mobile-navbar">
      <div
        className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => navigate("/calendar")}
      >
        <FaHome />
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${location.pathname === "/search" ? "active" : ""}`}
        onClick={() => navigate("/search")}
      >
        <FaSearch />
        <span>Search</span>
      </div>

      {/* CENTER PLUS BUTTON */}
      <div className="nav-plus" onClick={() => navigate("/calendar-view")}>
        <FaPlus />
      </div>

      <div
        className={`nav-item ${location.pathname === "/history" ? "active" : ""}`}
        onClick={() => navigate("/history")}
      >
        <FaHistory />
        <span>History</span>
      </div>

      <div
        className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <FaUser />
        <span>Profile</span>
      </div>
    </div>
  );
}

export default MobileNavbar;