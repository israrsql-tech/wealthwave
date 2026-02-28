// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const API_URL = "https://wealthwave-backend-production.up.railway.app/api";
// const API_URL = "http://10.113.213.87:4000/api";


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // user: { id, email, name, phone, avatar }
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Load current user on app start ----
useEffect(() => {
  const savedToken = localStorage.getItem("wealthwave_token");

  const loadUser = async () => {
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      setToken(savedToken);
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem("wealthwave_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  // ---- SIGNUP (API) ----
  const signup = async ({ email, password, name, phone }) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");

    localStorage.setItem("wealthwave_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  // ---- LOGIN (API) ----
  const login = async ({ email, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("wealthwave_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  // ---- LOGOUT ----
  const logout = () => {
    localStorage.removeItem("wealthwave_token");
    setToken(null);
    setUser(null);
  };

  // ---- PROFILE UPDATE (DB via API) ----
  const updateProfile = async ({ name, phone, password, avatar }) => {
  console.log("updateProfile payload:", { name, phone, hasPwd: !!password });
    if (!token) return;

    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone, avatar ,password}), // password baad me handle kar sakte ho
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    setUser(data.user);
  };

  // ---- RESET PASSWORD (placeholder) ----
  const resetPassword = async ({ email, newPassword }) => {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Password reset failed");
  }

  // Optionally: auto-login mat karo, sirf success message dikhana hai
};
  const value = {
    user,
    token,
    signup,
    login,
    logout,
    updateProfile,
    resetPassword,
  };

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
