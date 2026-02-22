import React, { useEffect, useState } from "react";
import axios from "axios";
import MobileNavbar from "../components/MobileNavbar";

export default function HistoryPage() {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://test.vekoin.com/api/tasks");

      const doneTasks = res.data.filter(task => task.status === "done");
      setCompletedTasks(doneTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const groupedByDate = completedTasks.reduce((acc, task) => {
    const date = task.task_date.slice(0, 10);
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <>
      <div className="page-container">
        <h2>History</h2>

        {Object.keys(groupedByDate).map(date => (
          <div key={date} className="history-group">
            <h4>{date}</h4>
            {groupedByDate[date].map(task => (
              <div key={task.id} className="task-card done">
                {task.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <MobileNavbar />
    </>
  );
}