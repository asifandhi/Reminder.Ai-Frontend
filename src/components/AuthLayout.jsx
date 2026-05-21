import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authentication, authStatus, navigate]);

  return loader ? (
    <div
      className="flex items-center justify-center w-full h-screen"
      style={{ background: "radial-gradient(circle at center, #151b2d 0%, #070d1f 60%, #000000 100%)" }}
    >
      <p className="text-sm animate-pulse" style={{ color: "#a4e6ff" }}>Loading...</p>
    </div>
  ) : <>{children}</>;
}