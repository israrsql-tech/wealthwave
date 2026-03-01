// src/Pages.js - WEALTHWAVE SPECIFIC FEATURES
import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from './App';  // Tumhara App context
import { useTranslation } from "react-i18next";  

// YE TOP PE SIRF EK BAAR ADD KAR 
export const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);


  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);
  const { showToast, theme, setTheme } = useApp();
  const { t, i18n } = useTranslation();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.clear();
    showToast?.(t("toast.loggedOut"), "success");
    setTimeout(() => (window.location.href = "/"), 500);
  };

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <button onClick={() => setIsOpen(true)} className="menu-btn">
       ⋮
      </button>

      {isOpen && (
        <div className="drawer-overlay" onClick={() => setIsOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>

            {/* HEADER */}
            <div className="drawer-header">
              <h3>{t("common.menu")}</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* ================= MODE ================= */}
            <div className="drawer-section">
              <div
                className="drawer-title"
                onClick={() => toggleSection("mode")}
              >
                {t("theme.title")}
              </div>

              {openSection === "mode" && (
                <div className="drawer-content">
                  <button
                    onClick={() => setTheme("light")}
                    className={theme === "light" ? "active-item" : ""}
                  >
                    {t("theme.light")}
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={theme === "dark" ? "active-item" : ""}
                  >
                    {t("theme.dark")}
                  </button>

                  <button
                    onClick={() => setTheme("emerald")}
                    className={theme === "emerald" ? "active-item" : ""}
                  >
                    {t("theme.emerald")}
                  </button>
                </div>
              )}
            </div>

            {/* ================= LANGUAGE ================= */}
            <div className="drawer-section">
              <div
                className="drawer-title"
                onClick={() => toggleSection("language")}
              >
                {t("common.language")}
              </div>

              {openSection === "language" && (
                <div className="drawer-content">
                  {[
                    { code: "en", label: "English" },
                    { code: "hi", label: "Hindi" },
                    { code: "mr", label: "Marathi" },
                    { code: "gu", label: "Gujarati" },
                    { code: "ta", label: "Tamil" },
                    { code: "ml", label: "Malayalam" },
                    { code: "te", label: "Telugu" },
                    { code: "kn", label: "Kannada" },
                    { code: "bn", label: "Bengali" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={
                        i18n.language === lang.code ? "active-item" : ""
                      }
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================= MENU LINKS ================= */}
            <div className="drawer-section">
              <div
                className="drawer-title"
                onClick={() => toggleSection("menu")}
              >
                {t("common.navigation")}
              </div>

              {openSection === "menu" && (
                <div className="drawer-content">
                  <Link to="/about" onClick={() => setIsOpen(false)}>
                    {t("menu.about")}
                  </Link>

                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    {t("menu.contact")}
                  </Link>

                  <Link to="/privacy" onClick={() => setIsOpen(false)}>
                    {t("menu.privacy")}
                  </Link>

                  <Link to="/terms" onClick={() => setIsOpen(false)}>
                    {t("menu.terms")}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    {t("common.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AboutPage = () => {
  const { categories } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto">

        {/* BACK */}
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 mb-12 shadow-lg"
        >
          ← Back to Dashboard
        </Link>

        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            💰 WealthWave
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A full-stack personal finance management platform built with
            React, Node.js, and PostgreSQL.  
            Designed to help users track expenses, manage budgets, and gain
            AI-powered financial insights.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              🚀 <span>Core Features</span>
            </h2>

            <ul className="space-y-4 text-lg grid grid-cols-1 md:grid-cols-2">
              <li>Income & expense tracking</li>
              <li>Custom categories ({categories?.length || 8}+)</li>
              <li>Monthly budgets with alerts</li>
              <li>Multiple savings pots</li>
              <li>Recurring bill reminders</li>
              <li>Interactive financial visualizations</li>
              <li>AI-powered financial insights</li>
              <li>Light & dark theme support</li>
            </ul>
          </div>

          {/* TECH STACK */}
          <div className="bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              🛠️ <span>Technology Stack</span>
            </h2>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <h3 className="font-bold text-emerald-900 mb-4 text-xl">
                  Frontend
                </h3>
                <ul className="space-y-2">
                  <li>React 18 with Hooks</li>
                  <li>Chart.js data visualizations</li>
                  <li>Tailwind CSS responsive UI</li>
                  <li>Context API state management</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-emerald-900 mb-4 text-xl">
                  Backend
                </h3>
                <ul className="space-y-2">
                  <li>Node.js & Express REST APIs</li>
                  <li>PostgreSQL relational database</li>
                  <li>JWT-based authentication</li>
                  <li>Secure, role-based endpoints</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CREATOR */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 text-white p-12 lg:p-16 rounded-3xl text-center shadow-2xl">
          <h3 className="text-3xl lg:text-4xl font-bold mb-6">
            Built by Israr N. Khan
          </h3>

          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Full-Stack Developer | Mumbai, India
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://github.com/israr-dev/wealthwave"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              🌐 View GitHub Repository
            </a>

            <a
              href="https://www.linkedin.com/in/Israr Khan/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              💼 Connect on LinkedIn
            </a>
          </div>

          <p className="mt-8 text-lg opacity-80">
            Deployed on Vercel • Backend hosted on Railway
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { showToast } = useApp(); // Tumhara toast system

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Portfolio feedback:', formData);
    
    // Tumhara existing toast system use karo
    if (showToast) {
      showToast('Thanks for your feedback! Message received.', 'success');
    }
    
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 mb-12 shadow-lg">
          ← Back to Dashboard
        </Link>

        <div className="bg-white/90 backdrop-blur-xl p-10 lg:p-14 rounded-3xl shadow-2xl border border-white/50">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
              📞 Get In Touch
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Feedback on WealthWave? Hiring discussion? Portfolio review? 
              Drop a message!
              
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xl font-bold mb-4 text-gray-900">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-5 lg:p-6 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none text-lg bg-gray-50 hover:bg-white transition-all"
                placeholder="Israr N. Khan"
                required
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-4 text-gray-900">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-5 lg:p-6 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none text-lg bg-gray-50 hover:bg-white transition-all"
                placeholder="israrkhan171982@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-4 text-gray-900">Message</label>
              <textarea
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-5 lg:p-6 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none text-lg bg-gray-50 hover:bg-white transition-all resize-vertical"
                placeholder="What do you think about WealthWave? Any feedback or hiring questions?"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-6 px-10 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Send Message 🚀
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-lg text-gray-600">
              Or email directly: <a href="mailto:israrkhan171982@gmail.com" className="font-bold text-emerald-600 hover:underline">israrkhan171982@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
      {/* <MenuDrawer /> */}
    </div>
  );
};

// Privacy aur Terms same rakh sakte ho, ya chahiye to update kar dunga
export const PrivacyPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8 pt-20 md:pt-24">
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 mb-12 shadow-lg">
        ← Back to Dashboard
      </Link>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 flex items-center gap-3">
          🔒 Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-700 leading-relaxed text-lg">

          {/* 1️⃣ INFORMATION WE COLLECT */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address provided during registration</li>
              <li>Encrypted password (hashed using bcrypt)</li>
              <li>Financial data entered by the user (transactions, budgets, savings, bills)</li>
            </ul>
          </div>

          {/* 2️⃣ HOW WE USE DATA */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To authenticate and authorize users securely</li>
              <li>To display personalized financial insights and analytics</li>
              <li>To improve application performance and user experience</li>
            </ul>
          </div>

          {/* 3️⃣ DATA STORAGE & SECURITY */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Data Storage & Security
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>User data is stored securely in a PostgreSQL database</li>
              <li>Passwords are hashed using bcrypt encryption</li>
              <li>Authentication is handled via JWT tokens</li>
              <li>API endpoints are protected with token validation</li>
              <li>No third-party analytics or tracking services are used</li>
            </ul>
          </div>

          {/* 4️⃣ THIRD PARTY SERVICES */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Third-Party Services
            </h2>
            <p>
              Backend services are hosted on Railway. This project does not use
              third-party advertising networks or tracking tools.
            </p>
          </div>

          {/* 5️⃣ CONTACT */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Contact
            </h2>
            <p>
              If you have any privacy-related questions, please contact:
              <br />
              <strong className="text-emerald-600">
                israrkhan171982@gmail.com
              </strong>
            </p>
          </div>

          <p className="mt-12 text-sm opacity-75 text-center">
            Last updated: January 2026
          </p>

        </div>
      </div>
    </div>
  </div>
);

export const TermsPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8 pt-20 md:pt-24">
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 mb-12 shadow-lg">
        ← Back to Dashboard
      </Link>
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          📜 Terms of Service
        </h1>
        <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
          <p><strong>Project usage:</strong></p>
          <ul className="list-disc pl-6 space-y-3">
            <li> Full-stack college final year project</li>
            <li> React + Node.js + PostgreSQL stack</li>
            <li> Personal finance management app</li>
            <li> Demo deployment: Vercel + Railway</li>
            <li> Source code: GitHub public repo</li>
            <li> For portfolio/hiring showcase only</li>
          </ul>
          <p className="mt-12 text-sm opacity-75 text-center">
            Last updated: Jan 2026
          </p>
        </div>
      </div>
    </div>
     {/* <MenuDrawer /> */}

  </div>
);
