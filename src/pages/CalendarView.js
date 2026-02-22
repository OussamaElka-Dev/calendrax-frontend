import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import MobileNavbar from "../components/MobileNavbar";

export default function CalendarView() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [tasksByDate, setTasksByDate] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date());

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

  const handleDateClick = (info) => {
    navigate(`/day/${info.dateStr}`);
  };

  const handleDatesSet = (arg) => {
    setSelectedMonth(arg.view.currentStart);
  };

  const dayCellClassNames = (arg) => {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, "0");
    const day = String(arg.date.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;
    const tasks = tasksByDate[date] || [];

    if (tasks.length === 0) return "";

    let totalSubtasks = 0;
    let completedSubtasks = 0;

    tasks.forEach(task => {
      if (task.sub_tasks && task.sub_tasks.length > 0) {
        totalSubtasks += task.sub_tasks.length;

        task.sub_tasks.forEach(sub => {
          if (sub.status === "done") completedSubtasks++;
        });
      } else {
        totalSubtasks++;
        if (task.status === "done") completedSubtasks++;
      }
    });

    const percentage = (completedSubtasks / totalSubtasks) * 100;

    if (percentage === 100) return "day-green";
    if (percentage >= 75) return "day-orange";
    if (percentage >= 50) return "day-yellow";
    return "day-red";
  };

  return (
    <>
      <div className="calendar-container">
        <h1 className="page-title">Calendar</h1>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,next today"
          }}
          dateClick={handleDateClick}
          datesSet={handleDatesSet}
          dayCellClassNames={dayCellClassNames}
        />
      </div>

      <MobileNavbar />
    </>
  );
}