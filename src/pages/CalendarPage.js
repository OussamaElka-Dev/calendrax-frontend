import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

import DashboardStats from "../components/DashboardStats";
import ProgressCharts from "../components/ProgressCharts";
import MobileNavbar from "../components/MobileNavbar";

export default function CalendarPage() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [selectedMonth] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://test.vekoin.com/api/tasks");

      const grouped = {};

      res.data.forEach(task => {
        const formattedDate = task.task_date.slice(0, 10);

        if (!grouped[formattedDate]) {
          grouped[formattedDate] = [];
        }

        grouped[formattedDate].push(task);
      });

      setTasksByDate(grouped);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <>
      <div className="calendar-container">
        <h1 className="page-title">Dashboard</h1>

        <DashboardStats
          tasksByDate={tasksByDate}
          selectedMonth={selectedMonth}
        />

        <ProgressCharts
          tasksByDate={tasksByDate}
          selectedMonth={selectedMonth}
        />
      </div>

      <MobileNavbar />
    </>
  );
}