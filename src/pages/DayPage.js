// pages/DayPage.js
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
        `http://127.0.0.1:8000/api/tasks/date/${date}`
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
      await axios.post("http://127.0.0.1:8000/api/tasks", {
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
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleDone = async (task) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
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
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
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
      await axios.post(`http://127.0.0.1:8000/api/tasks/${taskId}/subtasks`, { title });
      setNewSubTaskTitles({ ...newSubTaskTitles, [taskId]: "" });
      fetchTasks();
    } catch (err) {
      console.error("Error adding sub-task:", err);
    }
  };

  const toggleSubTaskDone = async (subTask) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/subtasks/${subTask.id}`, {
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
      await axios.delete(`http://127.0.0.1:8000/api/subtasks/${subTaskId}`);
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
      await axios.put(`http://127.0.0.1:8000/api/subtasks/${sub.id}`, {
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
      <Link to="/" className="back-link">Back to Calendar</Link>

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
                <button className="save" onClick={() => saveEdit(task)}>Save</button>
                <button className="cancel" onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  className={`task-title ${task.status === "done" ? "done" : ""}`}
                  onClick={() => toggleDone(task)}
                >
                  {task.title}
                </span>
                <button className="edit" onClick={() => startEditing(task)}>Edit</button>
                <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
                <button
                  className="show-subtasks"
                  onClick={() => setShowSubTasks({ ...showSubTasks, [task.id]: !showSubTasks[task.id] })}
                >
                  {showSubTasks[task.id] ? "Hide Subtasks" : "Show Subtasks"}
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
                          <button className="save" onClick={() => saveEditSubTask(sub)}>Save</button>
                          <button className="cancel" onClick={() => setEditingSubTaskId(null)}>Cancel</button>
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
                          <button className="edit" onClick={() => startEditingSubTask(sub)}>Edit</button>
                          <button className="delete" onClick={() => deleteSubTask(sub.id)}>Delete</button>
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
                  <button className="add" onClick={() => addSubTask(task.id)}>Add</button>
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
        <button className="add" onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}
