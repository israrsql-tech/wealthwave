// src/BudgetAlerts.js
import { useEffect } from "react";
import { useApp } from "./App";

const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { start, end, today, daysInMonth };
};

const BudgetAlerts = () => {
  const { budgets, transactions, categories, showToast } = useApp();

  useEffect(() => {
    if (!budgets.length || !transactions.length) return;

    const { start, end, today, daysInMonth } = getCurrentMonthRange();

    const monthTx = transactions.filter((t) => {
      if (t.type !== "expense") return false;
      const d = new Date(t.date);
      return d >= start && d < end;
    });

    budgets
      .filter((b) => b.active)
      .forEach((b) => {
        const catId = Number(b.category_id);
        const limit = Number(b.limit || 0);
        if (!limit || !catId) return;

        const spent = monthTx
          .filter((t) => Number(t.category_id ?? t.category) === catId)
          .reduce((s, t) => s + Number(t.amount || 0), 0);

        const pct = (spent / limit) * 100;
        if (pct < 100) return; // sirf jab >100% ho

        const daysPassed = today;
        const daysLeft = daysInMonth - today;
        const cat = categories.find((c) => c.id === catId);
        const name = b.name || cat?.name || "Budget";

        showToast(
          `You are out of your ${name} budget (${pct.toFixed(
            0
          )}% used). ${daysPassed} din beet gaye, ${daysLeft} din baaki hain.`,
          "error"
        );
      });
  }, [budgets, transactions, categories, showToast]);

  return null; // sirf logic, UI nahi
};

export default BudgetAlerts;
