import React from "react";

export default function DashboardStats({ tasksByDate, selectedMonth }) {

  const today = new Date();
  const month = selectedMonth.getMonth();
  const year = selectedMonth.getFullYear();

  const countTasks = (filterFn) => {
    let total = 0;
    let done = 0;

    Object.entries(tasksByDate).forEach(([date, tasks]) => {
      const current = new Date(date);

      if (filterFn(current)) {
        tasks.forEach(task => {

          if (task.sub_tasks && task.sub_tasks.length > 0) {
            task.sub_tasks.forEach(sub => {
              total++;
              if (sub.status === "done") done++;
            });
          } else {
            total++;
            if (task.status === "done") done++;
          }

        });
      }
    });

    return total ? Math.round((done / total) * 100) : 0;
  };

  const monthlyProgress = countTasks(
    (date) =>
      date.getMonth() === month &&
      date.getFullYear() === year
  );

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weeklyProgress = countTasks(
    (date) =>
      date >= startOfWeek &&
      date <= endOfWeek &&
      date.getMonth() === month &&
      date.getFullYear() === year
  );

  const dailyProgress = countTasks(
    (date) =>
      date.getDate() === today.getDate() &&
      date.getMonth() === month &&
      date.getFullYear() === year
  );

  return (
    <div className="stats-grid">

      <div className="kpi-card">
        <div className="kpi-label">Monthly Progress</div>
        <div className="kpi-value">{monthlyProgress}%</div>
        <div className="kpi-bar">
          <div className="kpi-fill" style={{ width: `${monthlyProgress}%` }} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">Weekly Progress</div>
        <div className="kpi-value">{weeklyProgress}%</div>
        <div className="kpi-bar">
          <div className="kpi-fill blue" style={{ width: `${weeklyProgress}%` }} />
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-label">Today's Progress</div>
        <div className="kpi-value">{dailyProgress}%</div>
        <div className="kpi-bar">
          <div className="kpi-fill purple" style={{ width: `${dailyProgress}%` }} />
        </div>
      </div>

    </div>
  );
}