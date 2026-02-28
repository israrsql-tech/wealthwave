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
  const { categories } = useApp(); // Real categories show karo

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 mb-12 shadow-lg">
          ← Back to Dashboard
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            💰 WealthWave
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Full-stack personal finance tracker built with React + Node.js + PostgreSQL. 
            Track transactions, budgets, savings pots, bills with AI-powered insights.
          </p>
        </div>

        {/* FEATURES - TERA ACTUAL PROJECT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              🚀 <span>Core Features</span>
            </h2>
            <ul className="space-y-4 text-lg grid grid-cols-1 md:grid-cols-2">
              <li> Income & Expense tracking</li>
              <li> Custom categories ({categories?.length || 8}+)</li>
              <li> Monthly budgets + alerts</li>
              <li> Multiple savings pots</li>
              <li> Recurring bill reminders</li>
              <li> Real-time charts </li>
              <li> AI Chat insights</li>
              <li> Dark/Light theme</li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              🛠️ <span>Tech Stack</span>
            </h2>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <h3 className="font-bold text-emerald-900 mb-4 text-xl">Frontend</h3>
                <ul className="space-y-2">
                  <li> React 18 + Hooks</li>
                  <li> Chart.js visualizations</li>
                  <li> Tailwind CSS responsive</li>
                  <li> Context API state</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 mb-4 text-xl">Backend</h3>
                <ul className="space-y-2">
                  <li> Node.js + Express APIs</li>
                  <li> PostgreSQL database</li>
                  <li> JWT authentication</li>
                  <li> RESTful endpoints</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CREATOR SECTION */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 text-white p-12 lg:p-16 rounded-3xl text-center shadow-2xl">
          <h3 className="text-3xl lg:text-4xl font-bold mb-6">Built by Israr N. Khan</h3>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Full-stack Developer | Navi Mumbai, Maharashtra | Final Year Project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://github.com/israr-dev/wealthwave" 
               className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              🌐 Live GitHub Repo
            </a>
            <a href="https://linkedin.com/in/israr-n-khan" 
               className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              💼 Connect on LinkedIn
            </a>
          </div>
          <p className="mt-8 text-lg opacity-80">Deployed on Vercel | API: Railway</p>
        </div>
      </div>
         {/* <MenuDrawer /> */}

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
                placeholder="israrkhan171982@gmail.com.com"
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
              Or email directly: <a href="mailto:israrkhan171982@gmail.com" className="font-bold text-emerald-600 hover:underline">israrkhan171982@gmail.com.com</a>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          🔒 Privacy Policy
        </h1>
        <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
          <p><strong>WealthWave data security:</strong></p>
          <ul className="list-disc pl-6 space-y-3">
            <li>✅ PostgreSQL database with JWT authentication</li>
            <li>✅ Passwords hashed with bcrypt</li>
            <li>✅ API endpoints secured with token validation</li>
            <li>✅ No third-party analytics/tracking</li>
            <li>✅ LocalStorage tokens encrypted</li>
            <li>✅ Demo project - Railway hosted backend</li>
          </ul>
          <p className="mt-12 text-sm opacity-75 text-center">
            Last updated: Jan 2026 | Portfolio showcase
          </p>
        </div>
      </div>
    </div>
     {/* <MenuDrawer /> */}

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
