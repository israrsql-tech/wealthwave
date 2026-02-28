// src/BottomNav.js
import React from "react";
import { useApp } from "./App";
import { useTranslation } from "react-i18next";

const BottomNav = () => {
  const { currentPage, setCurrentPage } = useApp();
  const { t } = useTranslation();
  const go = (page) => setCurrentPage(page);

  return (
    <div className="bottom-nav">
      <button
        className={currentPage === "dashboard" ? "bn-item active" : "bn-item"}
        onClick={() => go("dashboard")}
      >
      <span>🏠</span> 
      <span>{t("nav.dashboard")}</span>
      </button>
      
      <button
        className={currentPage === "transactions" ? "bn-item active" : "bn-item"}
        onClick={() => go("transactions")}
      >
        <span>💸</span>
        <span>{t("nav.transactions")}</span>
      </button>
      
      <button
        className={currentPage === "budgets" ? "bn-item active" : "bn-item"}
        onClick={() => go("budgets")}
      >
        <span>📊</span>
        <span>{t("nav.budgets")}</span>
      </button>
      



      <button
        className={currentPage === "bills" ? "bn-item active" : "bn-item"}
        onClick={() => go("bills")}
      >
        <span>🧾</span>
        <span>{t("nav.bills")}</span>
      </button>
      
      <button
        className={currentPage === "pots" ? "bn-item active" : "bn-item"}
        onClick={() => go("pots")}
      >
        <span>💰</span>
        <span>{t("nav.pots")}</span>
      </button>
      
      <button
        className={currentPage === "account" ? "bn-item active" : "bn-item"}
        onClick={() => go("account")}
      >
        <span>👤</span>
        <span>{t("nav.account")}</span>
      </button>
    </div>
  );
};

export default BottomNav;
