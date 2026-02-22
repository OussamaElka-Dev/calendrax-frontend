import React from "react";
import "./Mobile.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function ProgressCharts({ tasksByDate, selectedMonth }) {

  const month = selectedMonth.getMonth();
  const year = selectedMonth.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calculateDailyProgress = (dateKey) => {
    const tasks = tasksByDate[dateKey] || [];

    let total = 0;
    let done = 0;

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

    return total ? Math.round((done / total) * 100) : 0;
  };

  const chartData = [];
  let daysDone = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const percent = calculateDailyProgress(dateKey);

    if (percent === 100) daysDone++;

    chartData.push({
      day,
      progress: percent
    });
  }

  const daysLeft = daysInMonth - daysDone;

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="chart-card">

      <div className="chart-header">
        <div>
          <h3>Monthly Performance</h3>
          <p>Daily productivity overview</p>
        </div>

        <div className="days-summary">
          <div>
            <span className="summary-number">{daysDone}</span>
            <span className="summary-label">Done</span>
          </div>
          <div>
            <span className="summary-number">{daysLeft}</span>
            <span className="summary-label">Left</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={isMobile ? 220 : 320}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

          <XAxis
            dataKey="day"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={isMobile ? 4 : 0}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={30}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="progress"
            stroke="#16a34a"
            strokeWidth={isMobile ? 2 : 3}
            dot={isMobile ? false : { r: 4 }}
            activeDot={{ r: isMobile ? 4 : 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}