import React, { useEffect, useState } from "react";
import axios from "axios";
import MobileNavbar from "../components/MobileNavbar";

export default function SearchPage() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://test.vekoin.com/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesQuery =
      task.title.toLowerCase().includes(query.toLowerCase());

    if (filter === "done") return matchesQuery && task.status === "done";
    if (filter === "pending") return matchesQuery && task.status !== "done";

    return matchesQuery;
  });

  return (
    <>
      <div className="page-container">
        <h2>Search Tasks</h2>

        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("done")}>Done</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <div className="results">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.task_date.slice(0, 10)}</p>
              <span className={task.status === "done" ? "done" : "pending"}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <MobileNavbar />
    </>
  );
}