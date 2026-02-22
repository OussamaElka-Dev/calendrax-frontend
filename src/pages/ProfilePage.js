import React from "react";
import "../App.css";
import MobileNavbar from "../components/MobileNavbar";

export default function ProfilePage() {
  return (
    <>
      <div className="profile-container">

        <div className="profile-header">
          <div className="avatar">E</div>
          <h2>Elkasmi Dev</h2>
          <p className="email">Elka.dev@email.com</p>
        </div>

        <div className="settings-section">
          <h4>Account</h4>

          <div className="setting-item">
            <span>Personal Information</span>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item">
            <span>Password & Security</span>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item">
            <span>Notifications</span>
            <span className="arrow">›</span>
          </div>
        </div>

        <div className="settings-section">
          <h4>Preferences</h4>

          <div className="setting-item">
            <span>Language</span>
            <span className="value">English</span>
          </div>

          <div className="setting-item">
            <span>Theme</span>
            <span className="value">Light</span>
          </div>
        </div>

        <div className="settings-section">
          <h4>Support</h4>

          <div className="setting-item">
            <span>Help Center</span>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item logout">
            <span>Log Out</span>
          </div>
        </div>

      </div>

      <MobileNavbar />
    </>
  );
}