import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addReminder, getPendingTasks } from '../api/sync.js'
import TaskCard from '../components/TaskCard.jsx';
import Button from '../components/bacisComponets/Button.jsx';
import Header from '../components/header/Header.jsx';

function Home() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (!status) return;
    const fetchPending = async () => {
      try {
        const res = await getPendingTasks();
        setTasks(res.data.data.tasks);
      } catch (err) {
        console.error("Failed to fetch pending tasks:", err);
      }
    };
    fetchPending();
  }, [status]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await addReminder(text);
      setTasks((prev) => [...prev, ...res.data.data.tasks]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex flex-col font-geist antialiased"
      style={{
        background: "radial-gradient(circle at center, #151b2d 0%, #070d1f 60%, #000000 100%)",
        color: "#dce1fb",
      }}
    >
      <Header />

      {/* Decorative blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none -z-10"
        style={{ background: "rgba(0,209,255,0.06)", filter: "blur(120px)" }}
      />
      <div className="fixed bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none -z-10"
        style={{ background: "rgba(96,1,209,0.08)", filter: "blur(100px)" }}
      />

      <main className="flex-grow flex flex-col justify-end items-center px-5 md:px-16 pt-32 pb-20">
        <div className="max-w-3xl w-full flex flex-col items-center gap-12">

          {status ? (
            <>
              {/* Task Cards */}
              {tasks.length > 0 && (
                <div className="w-full max-w-2xl flex flex-col gap-3">
                  {tasks.map((task, i) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      index={i}
                      variant="pending"
                      onDelete={(id) => setTasks((prev) => prev.filter((t) => t._id !== id))}
                      onComplete={(id) => setTasks((prev) => prev.filter((t) => t._id !== id))}
                    />
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="w-full relative  group">
                <div className="absolute -inset-1 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{ background: "linear-gradient(to right, rgba(0,209,255,0.2), rgba(96,1,209,0.2))" }}
                />
                <div
                  className="relative w-full flex items-center p-2 rounded-full transition-all duration-300"
                  style={{
                    background: "rgba(21,27,45,0.4)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="ml-4  text-xl" style={{ color: "#859399" }}>🔍</span>
                  <input
                    className="flex-grow  bg-transparent border-none outline-none px-4 py-3 text-lg"
                    style={{ color: "#dce1fb" }}
                    placeholder="Paste WhatsApp/email text to create reminders..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKey}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="p-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#1e293b", color: "#a4e6ff" }}
                  >
                    {loading ? "⏳" : "↑"}
                  </Button>
                </div>
              </div>

              <p className="text-base text-center max-w-lg" style={{ color: "#859399" }}>
                Paste any text — ReminderAI extracts tasks and adds them to your Google Calendar.
              </p>
            </>
          ) : (
            /* Not logged in — landing CTA */
            <div className="flex flex-col items-center gap-6 text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ color: "#dce1fb" }}>
                Your AI Reminder
              </h1>
              <p className="text-lg max-w-md" style={{ color: "#859399" }}>
                Paste any WhatsApp or email text — ReminderAI extracts tasks and syncs them to Google Calendar.
              </p>
              <div className="flex gap-4">
                <Link to="/signup">
                  <Button variant="cta" className="px-8 py-3 rounded-full text-base">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="px-8 py-3 rounded-full text-base">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
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

export default Home;