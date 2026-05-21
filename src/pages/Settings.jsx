import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Settings() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

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
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#859399" }}
        >
          ← Back
        </button>
      </div>

      <main className="flex-grow max-w-3xl w-full mx-auto px-5 md:px-16 pt-10 pb-20">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2" style={{ color: "#dce1fb" }}>Settings</h1>
        <p className="text-sm mb-10" style={{ color: "#859399" }}>Manage your preferences</p>

        {/* Profile */}
        <div
          className="p-5 rounded-xl flex items-center gap-4 mb-4"
          style={{
            background: "rgba(21,27,45,0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
            style={{ background: "rgba(0,209,255,0.15)", color: "#a4e6ff", border: "1px solid rgba(0,209,255,0.3)" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium" style={{ color: "#dce1fb" }}>{user?.name || "User"}</p>
            <p className="text-sm" style={{ color: "#859399" }}>{user?.email || ""}</p>
          </div>
        </div>

        {/* Completed Reminders */}
        <button
          onClick={() => navigate("/completed")}
          className="w-full text-left p-4 rounded-xl flex items-center justify-between group transition-all duration-300 mb-4"
          style={{
            background: "rgba(21,27,45,0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              ✓
            </div>
            <div>
              <p className="font-medium" style={{ color: "#dce1fb" }}>Completed Reminders</p>
              <p className="text-xs" style={{ color: "#859399" }}>View your activity history</p>
            </div>
          </div>
          <span style={{ color: "#859399" }}>›</span>
        </button>

        {/* Change Password */}
        <button
          className="w-full text-left p-4 rounded-xl flex items-center justify-between group transition-all duration-300"
          style={{
            background: "rgba(21,27,45,0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: "rgba(164,230,255,0.1)", border: "1px solid rgba(164,230,255,0.2)" }}
            >
              🔒
            </div>
            <div>
              <p className="font-medium" style={{ color: "#dce1fb" }}>Change Password</p>
              <p className="text-xs" style={{ color: "#859399" }}>Update your credentials</p>
            </div>
          </div>
          <span style={{ color: "#859399" }}>›</span>
        </button>

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

export default Settings;