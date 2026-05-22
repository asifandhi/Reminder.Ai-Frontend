import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompletedTasks } from '../api/sync.js';
import TaskCard from '../components/TaskCard.jsx';

function Completed() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCompletedTasks();
        setTasks(res.data.data.tasks);
      } catch (err) {
        console.error("Failed to fetch completed tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col font-geist antialiased"
      style={{
        background: "radial-gradient(circle at center, #151b2d 0%, #070d1f 60%, #000000 100%)",
        color: "#dce1fb",
      }}
    >
      {/* Back button */}
      <div className="px-5 md:px-16 pt-8">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#859399" }}
        >
          ← Back
        </button>
      </div>

      <main className="flex-grow max-w-3xl w-full mx-auto px-5 md:px-16 pt-10 pb-20">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: "#dce1fb" }}>Completed</h1>
        <p className="text-sm mb-10" style={{ color: "#859399" }}>Your finished reminders</p>

        {loading && (
          <p className="text-sm" style={{ color: "#859399" }}>Loading...</p>
        )}

        {!loading && tasks.length === 0 && (
          <p className="text-sm" style={{ color: "#859399" }}>No completed tasks yet.</p>
        )}

        {!loading && tasks.length > 0 && (
          <div className="flex flex-col gap-3">
            {tasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                index={i}
                variant="completed"
                onDelete={(id) => setTasks((prev) => prev.filter((t) => t._id !== id))}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="w-full py-12 border-t mt-auto"
        style={{ backgroundColor: "#070d1f", borderColor: "rgba(60,73,78,0.2)" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto px-5 gap-6 md:gap-0">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: "#a4e6ff" }}>ReminderAI</span>
          <span className="text-xs" style={{ color: "#859399" }}>© 2024 ReminderAI. All rights reserved.</span>
          <div className="flex gap-6 text-xs">
            {["Privacy", "Terms", "Support"].map((item) => (
              <a key={item} href="#" style={{ color: "#859399" }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Completed;