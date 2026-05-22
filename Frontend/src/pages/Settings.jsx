import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/bacisComponets/Button.jsx';
import Input from '../components/bacisComponets/Input.jsx';
import { changePassword } from '../api/auth.js';
import { connectGoogle } from '../api/calendar.js';

function Settings() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return;
    setPwLoading(true);
    setPwError("");
    setPwSuccess("");
    try {
      await changePassword({ oldPassword, newPassword });
      setPwSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setPwError(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

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
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-sm flex items-center gap-2"
          style={{ color: "#859399", borderColor: "transparent" }}
        >
          ← Back
        </Button>
      </div>

      <main className="flex-grow max-w-3xl w-full mx-auto px-5 md:px-16 pt-10 pb-20">

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
        <div
          className="rounded-xl transition-all duration-300 mb-4"
          style={{
            background: "rgba(21,27,45,0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            onClick={() => { setShowPasswordForm((p) => !p); setPwError(""); setPwSuccess(""); }}
            className="w-full text-left p-4 flex items-center justify-between"
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
            <span style={{ color: "#859399" }}>{showPasswordForm ? "↑" : "›"}</span>
          </button>

          {showPasswordForm && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <Input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {pwError && <p className="text-xs" style={{ color: "#f87171" }}>{pwError}</p>}
              {pwSuccess && <p className="text-xs" style={{ color: "#34d399" }}>{pwSuccess}</p>}
              <Button
                variant="primary"
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="w-full"
              >
                {pwLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}
        </div>

        {/* Google Calendar */}
        <div
          className="rounded-xl transition-all duration-300"
          style={{
            background: "rgba(21,27,45,0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ background: "rgba(164,230,255,0.1)", border: "1px solid rgba(164,230,255,0.2)" }}
              >
                📅
              </div>
              <div>
                <p className="font-medium" style={{ color: "#dce1fb" }}>Google Calendar</p>
                <p className="text-xs" style={{ color: "#859399" }}>Connect to sync reminders</p>
              </div>
            </div>
            {user?.googleTokens?.accessToken ? (
            <span className="text-xs font-medium" style={{ color: "#34d399" }}>✓ Connected</span>
            ) : (
            <Button
                variant="cta"
                className="text-xs px-4 py-2 rounded-full"
                onClick={connectGoogle}
            >
                Connect
            </Button>
            )}
          </div>
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

export default Settings;