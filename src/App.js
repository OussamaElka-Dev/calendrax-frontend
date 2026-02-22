import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import CalendarPage from "./pages/CalendarPage";
import DayPage from "./pages/DayPage";
import CalendarView from "./pages/CalendarView";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>

      {/* Login is default */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App Pages */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/day/:date" element={<DayPage />} />
      <Route path="/calendar-view" element={<CalendarView />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />

    </Routes>
  );
}

export default App;
