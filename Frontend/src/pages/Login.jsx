import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../api/auth.js';
import { login } from '../store/authSlice.js';
import Button from '../components/bacisComponets/Button.jsx';
import Input from '../components/bacisComponets/Input.jsx';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) return;
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      dispatch(login(res.data.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 font-geist antialiased"
      style={{ background: "radial-gradient(circle at center, #151b2d 0%, #070d1f 60%, #000000 100%)" }}
    >
      {/* Blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none -z-10"
        style={{ background: "rgba(0,209,255,0.06)", filter: "blur(120px)" }} />
      <div className="fixed bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none -z-10"
        style={{ background: "rgba(96,1,209,0.08)", filter: "blur(100px)" }} />

      <div
        className="w-full max-w-md p-8 rounded-2xl flex flex-col gap-6"
        style={{
          background: "rgba(21,27,45,0.4)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <span className="text-3xl font-bold tracking-tighter" style={{ color: "#a4e6ff" }}>
              ReminderAI
            </span>
          </Link>
          <p className="text-sm mt-2" style={{ color: "#859399" }}>Welcome back</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-center px-3 py-2 rounded-lg"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
            {error}
          </p>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKey}
            placeholder="you@example.com"
            className="rounded-xl text-sm"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#dce1fb",
            }}
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKey}
            placeholder="••••••••"
            className="rounded-xl text-sm"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#dce1fb",
            }}
          />
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#00d1ff", color: "#003543" }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm" style={{ color: "#859399" }}>
          No account?{" "}
          <Link to="/signup" className="font-semibold" style={{ color: "#a4e6ff" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;