// src/LoginPage.js
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";

// Strong password check
const isStrongPassword = (pwd) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(pwd);
};

const LoginPage = () => {
  const { login, signup, resetPassword } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();

  const [message, setMessage] = useState("");

   const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");
   if (mode !== "login") {
  // strong password + confirm check (jo tum pehle se laga rahe the)
  if (!isStrongPassword(password)) {
    setError(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
    return;
  }
  
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }
 }
  try {
    if (mode === "signup") {
      if (!name || !phone || !email || !password || !confirmPassword) {
        setError(t("auth.allFieldsRequired"));
        return;
      }
      await signup({ email, password, name, phone });
      return;
    }

    if (mode === "login") {
      if (!email || !password) {
        setError(t("auth.emailPasswordRequired"));
        return;
      }

    if (!confirmPassword) {
    setError(t("auth.confirmPasswordRequired"));
    return;
  }
  if (password !== confirmPassword) {
    setError(t("auth.passwordsNotMatch"));
    return;
  }
      await login({ email, password });
      return;
    }
        // FORGOT / RESET PASSWORD
    if (mode === "forgot") {
      if (!email || !password) {
        setError(t("auth.emailNewPasswordRequired"));
        return;
      }

      // yahan tumhara AuthContext ka resetPassword call hoga
      await resetPassword({ email, newPassword: password });

      setMessage(t("auth.resetSuccess"));
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    // forgot ke liye baad me real API banaoge, filhaal skip kar sakte ho
  } catch (err) {
    setError(err.message || t("common.somethingWrong"));
  }
};


  return (
    <div className="auth-wrapper">

      <div className="wealthwave-bg"></div>
    <div className="watermark-overlay">
      <div className="wm-text">WEALTHWAVE</div>
      <div className="wm-icon">💰📈🔗</div>
    </div>
    
      <div className="auth-card">
        <div className="auth-inner">
          <div className="auth-logo">
            <span>💰</span> WealthWave
          </div>

          <h2 className="auth-title">
            {mode === "login"
              ? t("auth.welcomeBack")
              : mode === "signup"
              ? t("auth.createAccount")
              : t("auth.resetPassword")}
          </h2>


          <p className="auth-subtitle">
            {mode === "login" && t("auth.subtitleLogin")}
            {mode === "signup" && t("auth.subtitleSignup")}
            {mode === "forgot" && t("auth.subtitleForgot")}
          </p>


   <form onSubmit={handleSubmit} className="auth-form">
  {mode === "signup" && (
    <>
      <div className="form-group">
        <label className="form-label">
          <span>{t("auth.name")}</span>
        </label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("auth.name")}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <span>{t("auth.phone")}</span>
        </label>
        <input
          type="tel"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("auth.phone")}
        />
      </div>
    </>
  )}

  <div className="form-group">
    <label className="form-label">
    <span>{t("auth.email")}</span>
    </label>
    <input
      type="email"
      className={`form-control ${error ? "error" : ""}`}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder={t("auth.email")}
    />
  </div>

 <div className="form-group">
  <label className="form-label">
   {mode === "forgot" ? t("auth.newPassword") : t("auth.password")}
  </label>
  <div className="password-field-wrapper">
    <input
      type={showLoginPassword ? "text" : "password"}
      className="form-control"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      placeholder={
        mode === "forgot"
          ? t("auth.newPassword")
          : t("auth.password")
      }
    />
    <button
      type="button"
      className="password-toggle-btn"
      onClick={() => setShowLoginPassword((prev) => !prev)}
    >
   {showLoginPassword ? t("common.hide") : t("common.show")}
    </button>
  </div>
</div>



{(mode === "login" || mode === "signup" || mode === "forgot") && (
  <div className="form-group">
    <label className="form-label">
    <span>{t("auth.confirmPassword")}</span>
    </label>

    <div className="password-field-wrapper">
      <input
        type={showConfirmPassword ? "text" : "password"}
        className={`form-control ${error ? "error" : ""}`}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t("auth.confirmPassword")}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
      >
      {showConfirmPassword ? t("common.hide") : t("common.show")}
      </button>
    </div>
  </div>
)}


  {error && <div className="auth-error">{error}</div>}
  {message && <div className="auth-success">{message}</div>}

  <button type="submit" className="auth-primary-btn">
    {mode === "login"
      ? t("auth.signIn")
      : mode === "signup"
      ? t("auth.signUp")
      : t("auth.reset")}

  </button>
</form>


          <div className="auth-switch">
            {mode === "login" && (
              <>
                {t("auth.newHere")}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                >
                 {t("auth.createAccount")}
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                >
                  {t("auth.forgotPassword")}
                </button>
              </>
            )}

            {mode === "signup" && (
              <>
                {t("auth.alreadyAccount")}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                >
                  {t("auth.signIn")}
                </button>
              </>
            )}

            {mode === "forgot" && (
              <>
                {t("auth.rememberPassword")}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                >
                  {t("auth.backToLogin")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
