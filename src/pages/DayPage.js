// pages/DayPage.js - ICONS ONLY VERSION (.js extension)
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function DayPage() {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [newSubTaskTitles, setNewSubTaskTitles] = useState({});
  const [editingSubTaskId, setEditingSubTaskId] = useState(null);
  const [editingSubTaskTitle, setEditingSubTaskTitle] = useState("");
  const [showSubTasks, setShowSubTasks] = useState({});

  // ✅ FIXED: wrapped in useCallback
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://test.vekoin.com/api/tasks/date/${date}`
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [date]);

  // ✅ FIXED: dependency is fetchTasks
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ----- Tasks CRUD -----
  const addTask = async () => {
    if (!newTitle) return;
    try {
      await axios.post("https://test.vekoin.com/api/tasks", {
        title: newTitle,
        task_date: date,
        status: "pending",
      });
      setNewTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://test.vekoin.com/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleDone = async (task) => {
    try {
      await axios.put(`https://test.vekoin.com/api/tasks/${task.id}`, {
        ...task,
        status: task.status === "pending" ? "done" : "pending",
      });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (task) => {
    try {
      await axios.put(`https://test.vekoin.com/api/tasks/${task.id}`, {
        ...task,
        title: editingTitle,
      });
      setEditingTaskId(null);
      setEditingTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // ----- SubTasks CRUD -----
  const addSubTask = async (taskId) => {
    const title = newSubTaskTitles[taskId];
    if (!title) return;
    try {
      await axios.post(`https://test.vekoin.com/api/tasks/${taskId}/subtasks`, { title });
      setNewSubTaskTitles({ ...newSubTaskTitles, [taskId]: "" });
      fetchTasks();
    } catch (err) {
      console.error("Error adding sub-task:", err);
    }
  };

  const toggleSubTaskDone = async (subTask) => {
    try {
      await axios.put(`https://test.vekoin.com/api/subtasks/${subTask.id}`, {
        ...subTask,
        status: subTask.status === "pending" ? "done" : "pending",
      });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling sub-task:", err);
    }
  };

  const deleteSubTask = async (subTaskId) => {
    try {
      await axios.delete(`https://test.vekoin.com/api/subtasks/${subTaskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting sub-task:", err);
    }
  };

  const startEditingSubTask = (sub) => {
    setEditingSubTaskId(sub.id);
    setEditingSubTaskTitle(sub.title);
  };

  const saveEditSubTask = async (sub) => {
    try {
      await axios.put(`https://test.vekoin.com/api/subtasks/${sub.id}`, {
        ...sub,
        title: editingSubTaskTitle,
      });
      setEditingSubTaskId(null);
      setEditingSubTaskTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error saving sub-task:", err);
    }
  };

  return (
    <div className="day-container">
      <h1>Tasks for {date}</h1>
      <Link to="/calendar-view" className="back-link">Back to Calendar</Link>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task">
            {/* Main Task */}
            {editingTaskId === task.id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="task-edit-input"
                />
                <button className="save icon-btn" onClick={() => saveEdit(task)}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </button>
                <button className="cancel icon-btn" onClick={() => setEditingTaskId(null)}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <span
                  className={`task-title ${task.status === "done" ? "done" : ""}`}
                  onClick={() => toggleDone(task)}
                >
                  {task.title}
                </span>
                <button className="edit icon-btn" onClick={() => startEditing(task)}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button className="delete icon-btn" onClick={() => deleteTask(task.id)}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
                <button
                  className="show-subtasks icon-btn"
                  onClick={() => setShowSubTasks({ ...showSubTasks, [task.id]: !showSubTasks[task.id] })}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 11l5 5 5-5z"/>
                  </svg>
                </button>
              </>
            )}

            {/* Sub-tasks */}
            {showSubTasks[task.id] && (
              <div className="subtasks">
                {task.sub_tasks && task.sub_tasks.map((sub) => (
                  <div key={sub.id} className="subtask">
                    {editingSubTaskId === sub.id ? (
                      <>
                        <input
                          value={editingSubTaskTitle}
                          onChange={(e) => setEditingSubTaskTitle(e.target.value)}
                          className="subtask-input"
                        />
                        <div className="button-container">
                          <button className="save icon-btn" onClick={() => saveEditSubTask(sub)}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </button>
                          <button className="cancel icon-btn" onClick={() => setEditingSubTaskId(null)}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span
                          className={sub.status === "done" ? "done" : ""}
                          onClick={() => toggleSubTaskDone(sub)}
                        >
                          {sub.title}
                        </span>
                        <div className="button-container">
                          <button className="edit icon-btn" onClick={() => startEditingSubTask(sub)}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          <button className="delete icon-btn" onClick={() => deleteSubTask(sub.id)}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add sub-task input */}
                <div className="add-subtask">
                  <input
                    className="subtask-input"
                    value={newSubTaskTitles[task.id] || ""}
                    onChange={(e) => setNewSubTaskTitles({ ...newSubTaskTitles, [task.id]: e.target.value })}
                    placeholder="New sub-task"
                  />
                  <button className="add icon-btn" onClick={() => addSubTask(task.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Task */}
      <div className="add-task">
        <input
          className="task-edit-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New Task"
        />
        <button className="add icon-btn" onClick={addTask}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
