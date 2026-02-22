import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import CalendarPage from "./pages/CalendarPage";
import DayPage from "./pages/DayPage";
import CalendarView from "./pages/CalendarView";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalendarPage />} />
      <Route path="/day/:date" element={<DayPage />} />
      <Route path="/calendar" element={<CalendarView />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}

export default App;
