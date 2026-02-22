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
  const [animateToday, setAnimateToday] = useState(false);

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

  // ✅ TODAY BUTTON FUNCTION
  const goToToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();

    setAnimateToday(true);

    setTimeout(() => {
      setAnimateToday(false);
    }, 1000);
  };

  // ✅ COLOR + ANIMATION LOGIC
  const dayCellClassNames = (arg) => {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, "0");
    const day = String(arg.date.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;
    const tasks = tasksByDate[date] || [];

    const today = new Date();
    const isToday =
      today.getFullYear() === arg.date.getFullYear() &&
      today.getMonth() === arg.date.getMonth() &&
      today.getDate() === arg.date.getDate();

    let baseClass = "";

    if (tasks.length > 0) {
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

      if (percentage === 100) baseClass = "day-green";
      else if (percentage >= 75) baseClass = "day-orange";
      else if (percentage >= 50) baseClass = "day-yellow";
      else baseClass = "day-red";
    }

    if (isToday && animateToday) {
      return `${baseClass} today-animate`;
    }

    return baseClass;
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
            right: "prev,next"
          }}
          dateClick={handleDateClick}
          dayCellClassNames={dayCellClassNames}
        />

        {/* ✅ TODAY BUTTON */}
        <button className="today-btn" onClick={goToToday}>
          Today
        </button>
      </div>

      <MobileNavbar />
    </>
  );
}