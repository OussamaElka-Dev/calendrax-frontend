import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import CalendarPage from "./pages/CalendarPage";
import DayPage from "./pages/DayPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalendarPage />} />
      <Route path="/day/:date" element={<DayPage />} />
    </Routes>
  );
}

export default App;
