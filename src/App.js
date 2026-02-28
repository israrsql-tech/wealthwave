// src/App.js

import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import React, { useState, useEffect, createContext, useContext, useRef,} from "react";
import "./style.css";
import { BrowserRouter as Router,  Routes, Route, Link, useLocation } from 'react-router-dom';
import { AboutPage, ContactPage, PrivacyPage, TermsPage } from './Pages';
import { MenuDrawer } from "./Pages";
import ChatWidget from "./ChatWidget";
import BudgetAlerts from "./BudgetAlerts";
import { formatIstDate } from "./utils/datetime";   // ✅
import BottomNav from "./BottomNav";
import ThemeSwitcher from "./ThemeSwitcher";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,Tooltip,  Legend,} from "chart.js";
import { Bar ,Doughnut} from "react-chartjs-2";
import "./i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";  // ← YE ADD KARO

const API_URL = "https://wealthwave-backend-production.up.railway.app/api";
// const API_URL = "http://10.113.213.87:4000/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement,Tooltip, Legend);


const formatCurrency = (value) => {
  const num = Number(value || 0);
  return `₹${num.toFixed(2)}`;
};

const isStrongPassword = (pwd) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(pwd);
};

// ===== Initial data =====
const initialCategories = [
  { id: 1, key: "groceries", name: "Groceries", icon: "🛒", color: "#10B981" },
  { id: 2, key: "entertainment", name: "Entertainment", icon: "🎮", color: "#F59E0B" },
  { id: 3, key: "transport", name: "Transport", icon: "🚗", color: "#3B82F6" },
  { id: 4, key: "bills_utilities", name: "Bills & Utilities", icon: "🧾", color: "#EF4444" },
  { id: 5, key: "salary_income", name: "Salary & Income", icon: "💰", color: "#10B981" },
  { id: 6, key: "healthcare", name: "Healthcare", icon: "🏥", color: "#EC4899" },
  { id: 7, key: "dining_out", name: "Dining Out", icon: "🍽️", color: "#F59E0B" },
  { id: 8, key: "shopping", name: "Shopping", icon: "🛍️", color: "#8B5CF6" },
];


const initialTransactions = [];
const initialBudgets = [];
const initialPots = [];
const initialPotMovements = [];
const initialBills = [];
const initialBillPayments = [];

// ===== Context =====
  const AppContext = createContext();
  export const useApp = () => useContext(AppContext);
  const AppProvider = ({ children }) => {
  const { user ,token} = useAuth();
  const { t } = useTranslation(); 

  const [categories] = useState(initialCategories);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [pots, setPots] = useState(initialPots);
  const [potMovements, setPotMovements] = useState(initialPotMovements);
  const [bills, setBills] = useState(initialBills);
  const [billPayments, setBillPayments] = useState(initialBillPayments);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [remindedBills, setRemindedBills] = useState([]);
 
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [theme]);


  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


useEffect(() => {
  if (!token) {
    setTransactions([]);
    return;
  }

  const loadTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load transactions");
        return;
      }

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Load transactions error:", err);
    }
  };

  loadTransactions();
}, [token]);

// Budgets load - EXACTLY TRANSACTIONS KE NEECCHE
useEffect(() => {
  if (!token) {
    setBudgets([]);
    return;
  }

  const loadBudgets = async () => {
    try {
      const res = await fetch(`${API_URL}/budgets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load budgets");
        return;
      }

      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error("Load budgets error:", err);
    }
  };

  loadBudgets();
}, [token]); // ← SAME DEPENDENCIES

// Load pots
useEffect(() => {
  if (!token) {
    setPots([]);
    return;
  }

  const loadPots = async () => {
    try {
      const res = await fetch(`${API_URL}/pots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setPots([]);
        return;
      }

      const data = await res.json();
      setPots(data);
    } catch (err) {
      console.error("Load pots error:", err);
      setPots([]);
    }
  };

  loadPots();
}, [token]);

// Load pot movements
useEffect(() => {
  if (!token) {
    setPotMovements([]);
    return;
  }

  const loadPotMovements = async () => {
    try {
      const res = await fetch(`${API_URL}/pot-movements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setPotMovements([]);
        return;
      }

      const data = await res.json();
      setPotMovements(data);
    } catch (err) {
      console.error("Load pot movements error:", err);
      setPotMovements([]);
    }
  };

  loadPotMovements();
}, [token]);
  
// Load bills
useEffect(() => {
  if (!token) {
    setBills([]);
    return;
  }

  const loadBills = async () => {
    try {
      const res = await fetch(`${API_URL}/bills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setBills([]);
        return;
      }

      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error("Load bills error:", err);
      setBills([]);
    }
  };

  loadBills();
}, [token]);

// Load bill payments
useEffect(() => {
  if (!token) {
    setBillPayments([]);
    return;
  }

  const loadBillPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/bill-payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setBillPayments([]);
        return;
      }

      const data = await res.json();
      setBillPayments(data);
    } catch (err) {
      console.error("Load bill payments error:", err);
      setBillPayments([]);
    }
  };

  loadBillPayments();
}, [token]);


const addTransaction = async (transaction) => {
  console.log("Sending transaction to API:", transaction); 
  try {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    });
    if (!res.ok) throw new Error("Failed to add");
    const newTx = await res.json();
    setTransactions((prev) => [newTx, ...prev]);
    showToast(t("toast.transactionAdded"));
  } catch (err) {
    console.error("Add transaction error:", err);
    showToast(t("toast.failedAddTransaction"), "error");
  }
};




  const deleteTransaction = async (id) => {
  try {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete");
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(t("toast.transactionDeleted"));
  } catch (err) {
    console.error("Delete transaction error:", err);
    showToast(t("toast.failedDeleteTransaction"), "error");
  }
};


// ← PURANA addBudget HATAO, YE API VERSION LAGAO
const addBudget = async (budget) => {
  try {
    const res = await fetch(`${API_URL}/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budget)  // name, amount, category direct budget object se
    });
    
    if (!res.ok) {
      console.error("Failed to add budget");
      showToast(t("toast.failedAddBudget"));

      return;
    }
    
    const newBudget = await res.json();
    setBudgets(prev => [newBudget, ...prev]);
    showToast(t("toast.budgetCreated"));
  } catch (err) {
    console.error("Add budget error:", err);
    showToast(t("toast.failedAddBudget"), "error");

  }
};

// ← PURANA updateBudget HATAO, YE LAGAO  
const updateBudget = async (id, updates) => {
  try {
    const res = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates)
    });
    
    if (!res.ok) {
      showToast('Failed to update budget', 'error');
      return;
    }
    
    setBudgets(budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    showToast(t("toast.budgetUpdated"));;
  } catch (err) {
    console.error("Update budget error:", err);
    showToast(t("toast.failedUpdateBudget"), "error");

  }
};

// ← PURANA deleteBudget HATAO, YE LAGAO
const deleteBudget = async (id) => {
  try {
    const res = await fetch(`${API_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    if (!res.ok) {
      showToast('Failed to delete budget', 'error');
      return;
    }
    
    setBudgets(budgets.filter((b) => b.id !== id));
    showToast(t("toast.budgetDeleted"));
  } catch (err) {
    console.error("Delete budget error:", err);
    showToast(t("toast.failedDeleteBudget"), "error");
  }
};


const addPot = async (data) => {
  try {
    const res = await fetch(`${API_URL}/pots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        target: data.target,
        current: data.current ?? 0,
      }),
    });

    if (!res.ok) {
      showToast('Failed to create pot', 'error');
      return;
    }

    const newPot = await res.json();
    setPots((prev) => [newPot, ...prev]);
    showToast(t('toast.potCreated'), 'success');
  } catch (err) {
    console.error('Add pot error:', err);
    showToast(t('toast.failedCreatePot'), 'error');

  }
};

const deletePot = async (id) => {
  try {
    const res = await fetch(`${API_URL}/pots/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      showToast('Failed to delete pot', 'error');
      return;
    }

    setPots((prev) => prev.filter((p) => p.id !== id));
    setPotMovements((prev) => prev.filter((m) => m.pot_id !== id));
    showToast(t('toast.potDeleted'), 'success');
  } catch (err) {
    console.error('Delete pot error:', err);
    showToast(t('toast.failedDeletePot'), 'error');
  }
};

const addPotMovement = async (potId, type, amount, note) => {
  try {
    const res = await fetch(`${API_URL}/pot-movements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pot_id: potId,
        type,
        amount,
        note,
      }),
    });

    if (!res.ok) {
      showToast('Failed to update pot', 'error');
      return;
    }

    const { movement, pot } = await res.json();

    setPotMovements((prev) => [movement, ...prev]);
    setPots((prev) =>
      prev.map((p) => (p.id === pot.id ? pot : p))
    );

    showToast(
    type === 'deposit' ? t('toast.potMoneyAdded') : t('toast.potMoneyWithdrawn'),
    'success'
  );
  } catch (err) {
    console.error('Add pot movement error:', err);
    showToast(t('toast.failedUpdatePot'), 'error');
  }
};


const addBill = async (data) => {
  try {
    const res = await fetch(`${API_URL}/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      showToast('Failed to add bill', 'error');
      return;
    }

    const newBill = await res.json();
    setBills((prev) => [newBill, ...prev]);
    showToast(t('toast.billAdded'), 'success');
  } catch (err) {
    console.error('Add bill error:', err);
    showToast(t('toast.failedAddBill'), 'error');
  }
};

const updateBill = async (id, updates) => {
  try {
    const res = await fetch(`${API_URL}/bills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      showToast('Failed to update bill', 'error');
      return;
    }

    const updated = await res.json();
    setBills((prev) => prev.map((b) => (b.id === id ? updated : b)));
    showToast(t('toast.billUpdated'), 'success');
  } catch (err) {
    console.error('Update bill error:', err);
    showToast(t('toast.failedUpdateBill'), 'error');
  }
};

const deleteBill = async (id) => {
  try {
    const res = await fetch(`${API_URL}/bills/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      showToast('Failed to delete bill', 'error');
      return;
    }

    setBills((prev) => prev.filter((b) => b.id !== id));
    setBillPayments((prev) => prev.filter((bp) => bp.bill_id !== id));
    showToast(t('toast.billDeleted'), 'success');
  } catch (err) {
    console.error('Delete bill error:', err);
    showToast(t('toast.failedDeleteBill'), 'error');
  }
};

const markBillAsPaid = async (billId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    const res = await fetch(`${API_URL}/bill-payments/mark-paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bill_id: billId, month: currentMonth }),
    });

    if (!res.ok) {
      showToast('Failed to mark bill as paid', 'error');
      return;
    }

    const { payments } = await res.json();
    setBillPayments(payments);

     const bill = bills.find((b) => b.id === billId);
    if (bill) {
      const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

      const tempTx = {
        id: Date.now(),          // temporary id
        user_id: user.id,
        title: bill.name,
        amount: bill.amount,
        type: 'expense',
        category_id: bill.category_id,          // 👈 IMPORTANT
        category: String(bill.category_id || ''),
       // category: 'Bills',       // ya jo bhi tumhari existing category name se match kare
        date: today,
        description: 'Bill payment',
        created_at: today,
      };

      setTransactions((prev) => [tempTx, ...prev]);
    }
    showToast(t('toast.billMarkedPaid'), 'success');
  } catch (err) {
    console.error('Mark bill as paid error:', err);
    showToast(t('toast.failedMarkBillPaid'), 'error');
  }
};

useEffect(() => {
  const today = new Date();
  const currentDay = today.getDate();

  const billsToRemind = bills.filter((bill) => {
    if (!bill.active) return false;
    const daysUntilDue = bill.due_day - currentDay;
    // 0,1,2,3 din pehle tak ka window
    return daysUntilDue >= 0 && daysUntilDue <= 3;
  });

  billsToRemind.forEach((bill) => {
    if (!remindedBills.includes(bill.id)) {
      const daysLeft = bill.due_day - currentDay;
      const msg =
        daysLeft === 0
          ? t("toast.billDueToday", { name: bill.name })
          : t("toast.billDueInDays", { name: bill.name, days: daysLeft });

      showToast(msg, "info");
      setRemindedBills((prev) => [...prev, bill.id]);
    }
  });
}, [bills, remindedBills]);



  return (
    <AppContext.Provider
      value={{
        categories,
        transactions,
        budgets,
        pots,
        potMovements,
        bills,
        billPayments,
        currentPage,
        setCurrentPage,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addPot,
        deletePot,
        addPotMovement,
        addBill,
        updateBill,
        deleteBill,
        markBillAsPaid,
        showToast,
        toast,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// const useApp = () => useContext(AppContext);

// ===== Reusable UI components (Sidebar, Modal, ConfirmDialog, Toast) =====

const Sidebar = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage } = useApp();
  const { t } = useTranslation();  // ← YE ADD
  const navigate = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">💰 WealthWave</div>
      </div>
      <nav className="nav-links">
        <button
          className={`nav-link ${
            currentPage === "dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("dashboard")}
        >
          <span>📊</span> {t('nav.dashboard')}
        </button>
        <button
          className={`nav-link ${
            currentPage === "transactions" ? "active" : ""
          }`}
          onClick={() => navigate("transactions")}
        >
          <span>💳</span> {t('nav.transactions')}
        </button>
        <button
          className={`nav-link ${
            currentPage === "budgets" ? "active" : ""
          }`}
          onClick={() => navigate("budgets")}
        >
          <span>📈</span> {t('nav.budgets')}
        </button>
        <button
          className={`nav-link ${currentPage === "pots" ? "active" : ""}`}
          onClick={() => navigate("pots")}
        >
          <span>🏦</span> {t('nav.pots')}
        </button>
        <button
          className={`nav-link ${currentPage === "bills" ? "active" : ""}`}
          onClick={() => navigate("bills")}
        >
          <span>📄</span> {t('nav.bills')}
        </button>
        <button
             className={`nav-link ${currentPage === "account" ? "active" : ""}`}
              onClick={() => navigate("account")}
              >
              <span>👤</span> {t('nav.account')}
              </button>

       </nav>
    </div>
  );
};








const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px" }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type}`}>
      <div>{toast.message}</div>
    </div>
  );
};

// ===== Pages: Dashboard, Transactions, Budgets, Pots, Bills =====
// (All logic copied from your original file, just using imports and exports)

const Dashboard = () => {
  const { transactions, budgets, pots, bills, billPayments, categories } =
    useApp();
    const catLabel = (cat) => (cat ? t(`categories.${cat.key}`, cat.name) : "");
    const { t } = useTranslation(); 

  // ===== Time filter state =====
  const [selectedMonth, setSelectedMonth] = useState("this-month"); // "this-month" | "last-3m" | "all" | "YYYY-MM"
  const [billsPage, setBillsPage] = useState(1);
  const billsPerPage = 5;
  const [latestPage, setLatestPage] = useState(1);
  const latestPerPage = 3;
  const currentYear = new Date().getFullYear();
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0"); // "01".."12"
  return `${currentYear}-${month}`;            // "2025-01" type
});
  const formatMonthLabel = (ym) => {
    const [year, month] = ym.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // ===== Transactions filter helper =====
  const filteredTransactions = transactions.filter((t) => {
    const today = new Date();
    const date = new Date(t.date);
    const ym = t.date.slice(0, 7); // "YYYY-MM"

    if (selectedMonth === "all") return true;

    if (selectedMonth === "this-month") {
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth()
      );
    }

    if (selectedMonth === "last-3m") {
      const threeMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate()
      );
      return date >= threeMonthsAgo;
    }

    // Specific month like "2025-11"
    return ym === selectedMonth;
  });

  // ===== Top stats =====
  const totalIncome = filteredTransactions
  .filter((t) => t.type === "income")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);

const totalExpenses = filteredTransactions
  .filter((t) => t.type === "expense")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);

const balance = totalIncome - totalExpenses;

// ===== Category spending =====
const categorySpending = categories
  .map((cat) => {
    const spent = filteredTransactions
      .filter((t) => {
        if (t.type !== "expense") return false;

        // transaction ke andar category_id ya category dono me se jo mile use karo
        const txCatId = Number(t.category_id ?? t.category);
        const catId = Number(cat.id);

        return txCatId === catId;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return { ...cat, spent: Number(spent) || 0 };
  })
  .filter((c) => c.spent > 0);


  const latestTransactions = filteredTransactions.slice(0, 3);

  // ===== Upcoming bills (current month) =====
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const upcomingBills = bills.filter((bill) => {
    if (!bill.active) return false;
    const daysUntilDue = bill.due_day - currentDay;
    return daysUntilDue >= 0 && daysUntilDue <= 30;
  });
    const totalBillsPages = Math.ceil(upcomingBills.length / billsPerPage) || 1;
    const billsStart = (billsPage - 1) * billsPerPage;
    const paginatedBills = upcomingBills.slice(
    billsStart,
    billsStart + billsPerPage
);


  return (
    <div>
      {/* Time filter dropdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid var(--color-card-border)",
            fontSize: 14,
          }}
        >
          <option value="this-month">{t('dashboard.thisMonth')}</option>
          <option value="last-3m">{t('dashboard.last3Months')}</option>
          <option value="all">{t('dashboard.allTime')}</option>
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
      </div>

<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-label">{t('dashboard.totalBalance')}</div>
    <div
      className={`stat-value ${balance >= 0 ? "positive" : "negative"}`}
    >
      {formatCurrency(balance)}
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-label">{t('dashboard.totalIncome')}</div>
    <div className="stat-value positive">
      {formatCurrency(totalIncome)}
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-label">{t('dashboard.totalExpenses')}</div>
    <div className="stat-value negative">
      {formatCurrency(totalExpenses)}
    </div>
  </div>
</div>



      {/* Spending + Latest transactions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-24)",
          marginBottom: "var(--space-24)",
        }}
      >
        {/* Spending by Category (Bar chart) */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.spendingByCategory')}</h3>
          </div>
          {categorySpending.length > 0 ? (
            <Bar
              data={{
                labels: categorySpending.map((c) => catLabel(c)),

                datasets: [
                  {
                    label: t('dashboard.amountSpent'),
                    data: categorySpending.map((c) => c.spent),
                    backgroundColor: categorySpending.map((c) => c.color),
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const value = Number(ctx.parsed.y ?? 0);  // ensure number
                      return `₹${value.toFixed(2)}`;
                    },
                  },
                },
               },
                scales: {
                  x: { grid: { display: false } },
                  y: {
                    grid: { color: "#e5e7eb" },
                    ticks: { callback: (val) => `₹${val}` },
                  },
                },
              }}
              height={200}
            />
          ) : (
            <div className="empty-state">{t('dashboard.noSpendingData')}</div>
          )}
        </div>

        {/* Latest Transactions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.latestTransactions')}</h3>
          </div>
          {latestTransactions.length > 0 ? (
            <div className="transaction-list">
          {latestTransactions.map((transaction) => {
            const categoryId =
              transaction.category_id ?? parseInt(transaction.category);
            const category = categories.find((c) => c.id === categoryId);

            const merchant = transaction.merchant || transaction.title || "";

            return (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-icon">
                    {category?.icon}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-merchant">
                      {merchant}
                    </div>

                    {/* yahan date format */}
                    <div className="transaction-category">
                      {catLabel(category)} • {formatIstDate(transaction.date)}
                    </div>

                  </div>
                </div>

                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}

            </div>
          ) : (
            <div className="empty-state">{t('common.noTransactions')}</div>
          )}
                </div>
              </div>

              {/* Budgets, Savings Pots, Upcoming Bills */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "var(--space-24)",
                }}
              >
                



        {/* Budgets Donut */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.budgets')}</h3>
          </div>
          {budgets.filter((b) => b.active).length > 0 ? (
            (() => {
              const activeBudgets = budgets.filter((b) => b.active);

        const spentPerBudget = activeBudgets.map((budget) =>
          filteredTransactions
            .filter((t) => {
              if (t.type !== "expense") return false;

              const txCatId = Number(t.category_id ?? t.category);
              const budgetCatId = Number(budget.category_id);

              return txCatId === budgetCatId;
            })
            .reduce((sum, t) => sum + Number(t.amount || 0), 0)
        );


      const remainingPerBudget = activeBudgets.map(
        (budget, idx) => Math.max(Number(budget.limit || 0) - spentPerBudget[idx], 0)
      );

      return (
        <Doughnut
          data={{
            labels: activeBudgets.map((b) => {
              const category = categories.find(
                (c) => c.id === b.category_id
              );
              return category ? catLabel(category) : b.name;

            }),
            datasets: [
              {
                label: t('dashboard.spent'),
                data: spentPerBudget,
                backgroundColor: activeBudgets.map((b) => {
                  const category = categories.find(
                    (c) => c.id === b.category_id
                  );
                  return category?.color || "#10B981";
                }),
                borderWidth: 1,
              },
              {
                label: t('dashboard.remaining'),
                data: remainingPerBudget,
                backgroundColor: "rgba(148, 163, 184, 0.4)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              legend: { position: "right" },
              tooltip: {
  callbacks: {
    label: (ctx) => {
      const budget = activeBudgets[ctx.dataIndex];

      // Safe numeric values
      const rawSpent = spentPerBudget[ctx.dataIndex];
      const rawLimit = budget.limit;

      const spent = Number(rawSpent || 0);
      const limit = Number(rawLimit || 0);
      const pct = limit ? ((spent / limit) * 100) : 0;

      if (ctx.dataset.label === t('dashboard.spent')) {
        return `${t('dashboard.spentTooltip', { spent: spent.toFixed(2), limit: limit.toFixed(2), pct: pct.toFixed(0) })}`;
      }

      const rawRemaining = remainingPerBudget[ctx.dataIndex];
      const remaining = Number(rawRemaining || 0);
      const remainingPct = 100 - pct;

      return `${t('dashboard.remainingTooltip', { remaining: remaining.toFixed(2), pct: remainingPct.toFixed(0) })}`;
    },
  },
},


            },
          }}
          height={220}
        />
      );
    })()
  ) : (
    <div className="empty-state">{t('dashboard.noActiveBudgets')}</div>
  )}
</div>


        {/* Savings Pots horizontal bar */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.savingsPots')}</h3>
          </div>
          {pots.length > 0 ? (
            <Bar
              data={{
                labels: pots.map((p) => p.name),
                datasets: [
                  {
                    label: t('dashboard.current'),
                    data: pots.map((p) => p.current),
                    backgroundColor: "#10B981",
                  },
                  {
                    label: t('dashboard.target'), 
                    data: pots.map((p) => p.target),
                    backgroundColor: "#e5e7eb",
                  },
                ],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => ` ₹${ctx.parsed.x.toFixed(2)}`,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { color: "#e5e7eb" },
                    ticks: { callback: (val) => `₹${val}` },
                  },
                  y: { grid: { display: false } },
                },
              }}
              height={220}
            />
          ) : (
            <div className="empty-state">{t('dashboard.noSavingsPots')}</div>
          )}
        </div>

        {/* Upcoming Bills list */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.upcomingBills')}</h3>
          </div>
{upcomingBills.length > 0 ? (
  <>
    {paginatedBills.map((bill) => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const payment = billPayments.find(
        (bp) => bp.bill_id === bill.id && bp.month === currentMonth
      );
      const status =
        payment?.status || (currentDay > bill.due_day ? "overdue" : "due");

      return (
        <div
          key={bill.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "var(--space-12)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              {bill.name}
            </div>
            <div
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              {t('dashboard.dueDay', { day: bill.due_day })}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              {formatCurrency(bill.amount)}
            </div>
            <div
              className={`bill-status ${status}`}
              style={{ marginTop: "var(--space-4)" }}
            >
              {t(`bills.status.${status}`)} 
            </div>
          </div>
        </div>
      );
    })}

  {totalBillsPages > 1 && (
  <div className="bills-pagination">
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => setBillsPage((p) => Math.max(1, p - 1))}
      disabled={billsPage === 1}
    >
      {t('common.previous')}
    </button>
    <span className="bills-pagination-info">
      {t('dashboard.pageOf', { current: billsPage, total: totalBillsPages })}
    </span>
    <button
      className="btn btn-secondary btn-sm"
      onClick={() =>
        setBillsPage((p) => Math.min(totalBillsPages, p + 1))
      }
      disabled={billsPage === totalBillsPages}
    >
      {t('common.next')}
    </button>
  </div>
)}

  </>
) : (
  <div className="empty-state">{t('dashboard.noUpcomingBills')}</div>
)}

        </div>
      </div>
    </div>
  );
};





// ===== Transactions page & modal =====

const Transactions = () => {
  const { transactions, categories, addTransaction, deleteTransaction } =
    useApp();
  const catLabel = (cat) => (cat ? t(`categories.${cat.key}`, cat.name) : "");

  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 10;



  let filtered = transactions.filter((t) => {
  const merchant = t.merchant || t.title || "";       // dono ko cover karo
  const notes = t.notes || t.description || "";

  const matchesSearch =
    merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notes.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesType =
    filterType === "all" ? true : t.type === filterType;

  const matchesCategory =
    filterCategory === "all"
      ? true
      : Number(t.category_id ?? t.category) === Number(filterCategory);

  return matchesSearch && matchesType && matchesCategory;
});




  // let filtered = transactions.filter((t) => {
  //   const matchesSearch =
  //     t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     t.notes.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesType = filterType === "all" || t.type === filterType;
  //   const matchesCategory =
  //     filterCategory === "all" || t.category_id === parseInt(filterCategory);
  //   return matchesSearch && matchesType && matchesCategory;
  // });

  filtered = filtered.sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "amount-high":
        return b.amount - a.amount;
      case "amount-low":
        return a.amount - b.amount;
      case "merchant":
        return (a.merchant || a.title || "")
          .toLowerCase()
          .localeCompare((b.merchant || b.title || "").toLowerCase());
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-24)",
        }}
      >
        <h2>{t('transactions.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          {t('transactions.addTransaction')}
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder={t('transactions.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">{t('transactions.allTypes')}</option>
          <option value="income">{t('transactions.income')}</option>
          <option value="expense">{t('transactions.expense')}</option>
        </select>
        <select
          className="form-control"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">{t('transactions.allCategories')}</option>
{categories.map((cat) => (
  <option key={cat.id} value={cat.id}>
    {catLabel(cat)}
  </option>
))}

        </select>
        <select
          className="form-control"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">{t('transactions.sort.newestFirst')}</option>
          <option value="date-asc">{t('transactions.sort.oldestFirst')}</option>
          <option value="amount-high">{t('transactions.sort.amountHigh')}</option>
          <option value="amount-low">{t('transactions.sort.amountLow')}</option>
          <option value="merchant">{t('transactions.sort.merchantAZ')}</option>
        </select>
      </div>

            <div className="card">
          {paginatedTransactions.length > 0 ? (
        <div className="transaction-list">
          {paginatedTransactions.map((transaction) => {
      const categoryId =
        transaction.category_id ?? parseInt(transaction.category);
      const category = categories.find((c) => c.id === categoryId);
      const merchant = transaction.merchant || transaction.title || "";
     
      // const txDateObj = new Date(transaction.date);
      // const formattedDate = txDateObj.toLocaleString("en-IN", {
      //   timeZone: "Asia/Kolkata",
      //   day: "2-digit",
      //   month: "2-digit",
      //   year: "numeric",
      //   hour: "2-digit",
      //   minute: "2-digit",
      // });
      return (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-info">
            <div className="transaction-icon">
              {category?.icon}
            </div>
            <div className="transaction-details">
              <div className="transaction-merchant">
                {merchant}
              </div>
              <div className="transaction-category">
                {catLabel(category)} • {formatIstDate(transaction.date)}
              </div>

            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-16)",
            }}
          >
            <div className={`transaction-amount ${transaction.type}`}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>

            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirm(transaction.id);
              }}
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      );
    })}
  </div>
) : (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <p>{t('transactions.noTransactionsFound')}</p>
          </div>
        )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
          >
            {t('common.previous')}
          </button>

          <span style={{ padding: "0 12px" }}>
            {currentPage} / {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={currentPage === totalPages}
          >
            {t('common.next')}
          </button>
        </div>
      )}
      </div>

      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          addTransaction(data);
          setShowModal(false);
        }}
      />

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          deleteTransaction(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title={t('transactions.deleteTitle')}
        message={t('transactions.deleteMessage')}  // ✅ FIXED
      />
    </div>
  );
};


const TransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const { categories } = useApp();
  const catLabel = (cat) => (cat ? t(`categories.${cat.key}`, cat.name) : "");
  const { t } = useTranslation();
  const getTodayIST = () => {
    const now = new Date();
    // local time ko IST (Asia/Kolkata) me convert karke sirf date lo
    const formatter = new Intl.DateTimeFormat("en-CA", {
      // en-CA => YYYY-MM-DD format
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(now);
    const y = parts.find((p) => p.type === "year").value;
    const m = parts.find((p) => p.type === "month").value;
    const d = parts.find((p) => p.type === "day").value;
    return `${y}-${m}-${d}`; // "YYYY-MM-DD"
  };


  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    type: "expense",
    category_id: "",
    date: getTodayIST(),
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.merchant.trim()) newErrors.merchant =t('transactions.errors.merchantRequired');
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = t('transactions.errors.amountRequired');
    if (!formData.category_id)
      newErrors.category_id = t('transactions.errors.categoryRequired');
    if (!formData.date) newErrors.date = t('transactions.errors.dateRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  onSubmit({
    title: formData.merchant,                    // DB ka column
    amount: parseFloat(formData.amount),
    type: formData.type,
    category: String(formData.category_id || formData.categoryid), // jo tum use kar rahe ho
    date: formData.date,
    description: formData.notes,
  });

  setFormData({
    merchant: "",
    amount: "",
    type: "expense",
    category_id: "",
    date: getTodayIST(),
    notes: "",
  });
  setErrors({});
};


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('transactions.addTransactionTitle')}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('transactions.merchant')}</label>
          <input
            type="text"
            className={`form-control ${errors.merchant ? "error" : ""}`}
            value={formData.merchant}
            onChange={(e) =>
              setFormData({ ...formData, merchant: e.target.value })
            }
            placeholder={t('transactions.merchantPlaceholder')}
          />
          {errors.merchant && (
            <div className="form-error">{errors.merchant}</div>
          )}
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{t('transactions.amount')}</label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors.amount ? "error" : ""}`}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder={t('transactions.amountPlaceholder')}
            />
            {errors.amount && (
              <div className="form-error">{errors.amount}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t('transactions.type')}</label>
            <select
              className="form-control"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="expense">{t('transactions.expense')}</option>
              <option value="income">{t('transactions.income')}</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{t('transactions.category')}</label>
            <select
              className={`form-control ${
                errors.category_id ? "error" : ""
              }`}
              value={formData.category_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">{t('transactions.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {catLabel(cat)}
                </option>
              ))}

            </select>
            {errors.category_id && (
              <div className="form-error">{errors.category_id}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t('transactions.date')}</label>
            <input
              type="date"
              className={`form-control ${errors.date ? "error" : ""}`}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            {errors.date && (
              <div className="form-error">{errors.date}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('transactions.notes')}</label>
          <textarea
            className="form-control"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder={t('transactions.notesPlaceholder')}
            rows={3}
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {t('transactions.addTransactionButton')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ===== Budgets page & modal =====

const Budgets = () => {
  const {
    budgets,
    categories,
    transactions,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useApp();
  const catLabel = (cat) => (cat ? t(`categories.${cat.key}`, cat.name) : "");
  const { t } = useTranslation(); 
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-24)",
        }}
      >
        <h2>{t('budgets.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          {t('budgets.createBudget')}
        </button>
      </div>

<div>
  {budgets
    .filter((b) => b.active)
    .map((budget) => {
      const category = categories.find(
        (c) => c.id === budget.category_id
      );

      // Dashboard donut jaisa hi expense + category filter
      const budgetExpenses = transactions.filter((t) => {
        if (t.type !== "expense") return false;

        const txCatId = Number(t.category_id ?? t.category);
        const budgetCatId = Number(budget.category_id);

        return txCatId === budgetCatId;
      });

      const spent = budgetExpenses.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );

      const limit = Number(budget.limit || 0);
      const percentage = limit ? (spent / limit) * 100 : 0;

      const status =
        percentage < 50
          ? "low"
          : percentage < 75
          ? "medium"
          : "high";

      const budgetTransactions = budgetExpenses.slice(0, 3);

      return (
        <div key={budget.id} className="budget-item">
          <div className="budget-header">
            <div>
              <div className="budget-name">
                {category?.icon} {budget.name}
              </div>
                <div className="budget-amount">
                      {t('budgets.spentOfLimit', { 
                        spent: formatCurrency(spent), 
                        limit: formatCurrency(limit),
                        percentage: percentage.toFixed(0)
                      })}
                    </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "var(--space-8)",
              }}
            >
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setEditingBudget(budget);
                  setShowModal(true);
                }}
              >
                {t('common.edit')}
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setDeleteConfirm(budget.id)}
              >
               {t('common.delete')}
              </button>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${status}`}
              style={{
                width: `${Math.min(percentage, 100)}%`,
              }}
            />
          </div>
          {budgetTransactions.length > 0 && (
            <div style={{ marginTop: "var(--space-16)" }}>
              <div
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginBottom: "var(--space-8)",
                  color: "var(--color-text-secondary)",
                }}
              >
                 {t('budgets.latestTransactions')}
              </div>
              {budgetTransactions.map((t) => {
                const name = t.merchant || t.title || "Transaction";
                return (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--font-size-sm)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    <span>{name}</span>
                    <span>- {formatCurrency(Number(t.amount || 0))}</span>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      );
    })}
</div>


      <BudgetModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBudget(null);
        }}
        budget={editingBudget}
        onSubmit={(data) => {
          if (editingBudget) {
            updateBudget(editingBudget.id, data);
          } else {
            addBudget(data);
          }
          setShowModal(false);
          setEditingBudget(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          deleteBudget(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title={t('budgets.deleteTitle')}
        message={t('budgets.deleteMessage')}
      />
    </div>
  );
};

const BudgetModal = ({ isOpen, onClose, budget, onSubmit }) => {
  const { categories, budgets } = useApp();
  const catLabel = (cat) => (cat ? t(`categories.${cat.key}`, cat.name) : "");
  const { t } = useTranslation();  // ✅ ADD
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    limit: "",
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        category_id: budget.category_id,
        limit: budget.limit,
        active: budget.active,
      });
    } else {
      setFormData({
        name: "",
        category_id: "",
        limit: "",
        active: true,
      });
    }
  }, [budget]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())
      newErrors.name = t('budgets.errors.nameRequired');
    if (formData.name.trim().length < 3)
      newErrors.name = t('budgets.errors.nameMinLength');
    if (
      !budget &&
      budgets.some(
        (b) =>
          b.name.toLowerCase() === formData.name.toLowerCase()
      )
    ) {
      newErrors.name =t('budgets.errors.nameExists');
    }
    if (!formData.category_id)
      newErrors.category_id = t('budgets.errors.categoryRequired');
    if (!formData.limit || parseFloat(formData.limit) <= 0)
      newErrors.limit = t('budgets.errors.limitRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        limit: parseFloat(formData.limit),
        category_id: parseInt(formData.category_id),
        period: "monthly",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budget ?t('budgets.editTitle') : t('budgets.createTitle')}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('budgets.name')}</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "error" : ""}`}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder={t('budgets.namePlaceholder')}
          />
          {errors.name && (
            <div className="form-error">{errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">{t('budgets.category')}</label>
          <select
            className={`form-control ${
              errors.category_id ? "error" : ""
            }`}
            value={formData.category_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_id: e.target.value,
              })
            }
          >
            <option value="">{t('budgets.selectCategory')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {catLabel(cat)}
              </option>
            ))}

          </select>
          {errors.category_id && (
            <div className="form-error">{errors.category_id}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">{t('budgets.monthlyLimit')}</label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.limit ? "error" : ""}`}
            value={formData.limit}
            onChange={(e) =>
              setFormData({ ...formData, limit: e.target.value })
            }
            placeholder={t('budgets.limitPlaceholder')}
          />
          {errors.limit && (
            <div className="form-error">{errors.limit}</div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {budget ? t('budgets.updateButton') : t('budgets.createButton')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ===== Pots page & modals =====

const Pots = () => {
const { pots, potMovements, addPot, deletePot, addPotMovement } =
    useApp();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(null);
  const [movementType, setMovementType] = useState("deposit");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const safePots = Array.isArray(pots) ? pots : [];

const totalSaved = safePots.reduce(
  (sum, p) => sum + Number(p.current || 0),
  0
);

const totalTarget = safePots.reduce(
  (sum, p) => sum + Number(p.target || 0),
  0
);

  const safeTotalSaved = Number.isFinite(totalSaved) ? totalSaved : 0;
  const safeTotalTarget = Number.isFinite(totalTarget) ? totalTarget : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-24)",
        }}
      >
        <h2>{t('pots.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          {t('pots.createPot')}
        </button>
      </div>

      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
          marginBottom: "var(--space-24)",
        }}
      >
        <div className="stat-card">
          <div className="stat-label">{t('pots.totalSaved')}</div>
          <div className="stat-value positive">
            {formatCurrency(safeTotalSaved)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t('pots.totalTarget')}</div>
          <div className="stat-value">
            {formatCurrency(safeTotalTarget)}
          </div>
        </div>
      </div>

      <div>
        {pots.map((pot) => {
          const percentage = (pot.current / pot.target) * 100;
          const movements = potMovements
            .filter((pm) => pm.pot_id === pot.id)
            .slice(0, 5);

          return (
            <div key={pot.id} className="pot-item">
              <div className="pot-header">
                <div>
                  <div className="pot-name">{pot.name}</div>
                  <div
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-secondary)",
                      marginTop: "var(--space-4)",
                    }}
                  >
                    {t('pots.currentOfTarget', {
                      current: formatCurrency(pot.current),
                      target: formatCurrency(pot.target),
                      percentage: percentage.toFixed(0)
                    })}
                  </div>

                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteConfirm(pot.id)}
                >
                  {t('common.delete')}
                </button>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill low"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                  }}
                />
              </div>
              <div className="pot-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setShowMovementModal(pot.id);
                    setMovementType("deposit");
                  }}
                >
                  {t('pots.addMoney')}
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setShowMovementModal(pot.id);
                    setMovementType("withdraw");
                  }}
                  disabled={pot.current <= 0}
                >
                  {t('pots.withdraw')}
                </button>
              </div>
              {movements.length > 0 && (
                <div
                  style={{
                    marginTop: "var(--space-16)",
                    paddingTop: "var(--space-16)",
                    borderTop: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-semibold)",
                      marginBottom: "var(--space-8)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {t('pots.recentActivity')}
                  </div>
                  {movements.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "var(--font-size-sm)",
                        marginBottom: "var(--space-4)",
                      }}
                    >
                      <span>
                        <span>
                        {m.note} • {formatIstDate(m.date)}
                      </span>

                      </span>
                      <span
                        style={{
                          color:
                            m.type === "deposit"
                              ? "var(--color-green)"
                              : "var(--color-red)",
                        }}
                      >
                        {m.type === "deposit" ? "+" : "-"}
                        {formatCurrency(m.amount)}

                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PotModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          addPot(data);
          setShowModal(false);
        }}
      />

      <PotMovementModal
        isOpen={showMovementModal !== null}
        onClose={() => setShowMovementModal(null)}
        pot={pots.find((p) => p.id === showMovementModal)}
        type={movementType}
        onSubmit={(amount, note) => {
          addPotMovement(showMovementModal, movementType, amount, note);
          setShowMovementModal(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          deletePot(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title={t('pots.deleteTitle')}
        message={t('pots.deleteMessage')}
      />
    </div>
  );
};

const PotModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", target: "", current: 0 });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())
      newErrors.name = t('pots.errors.nameRequired');
    if (!formData.target || parseFloat(formData.target) <= 0)
      newErrors.target = t('pots.errors.targetRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        target: parseFloat(formData.target),
        current: parseFloat(formData.current || 0),
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('pots.createTitle')}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('pots.name')}</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "error" : ""}`}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder={t('pots.namePlaceholder')}
          />
          {errors.name && (
            <div className="form-error">{errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">{t('pots.targetAmount')}</label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.target ? "error" : ""}`}
            value={formData.target}
            onChange={(e) =>
              setFormData({ ...formData, target: e.target.value })
            }
            placeholder={t('pots.targetPlaceholder')}
          />
          {errors.target && (
            <div className="form-error">{errors.target}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">{t('pots.initialAmount')}</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={formData.current}
            onChange={(e) =>
              setFormData({ ...formData, current: e.target.value })
            }
            placeholder={t('pots.initialPlaceholder')}
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
           {t('pots.createButton')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const PotMovementModal = ({ isOpen, onClose, pot, type, onSubmit }) => {
  const { t } = useTranslation();  // ✅ ADD
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setNote("");
      setError("");
    }
  }, [isOpen]);

  if (!pot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError(t('pots.errors.amountRequired'));
      return;
    }
    if (type === "withdraw" && value > pot.current) {
      setError(t('pots.errors.withdrawExcess'));
      return;
    }
    onSubmit(value, note || (type === "deposit" ? t('pots.defaultDepositNote') : t('pots.defaultWithdrawNote')));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pots.movementTitle', { action: type === "deposit" ? t('pots.addMoney') : t('pots.withdraw'), potName: pot.name })}
    >
    
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('pots.amount')}</label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${error ? "error" : ""}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('pots.amountPlaceholder')}
          />
          {error && <div className="form-error">{error}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">{t('pots.note')}</label>
          <input
            type="text"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('pots.notePlaceholder')}
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
           {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {type === "deposit" ? t('pots.addMoneyButton') : t('pots.withdrawButton')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ===== Bills page & modal =====

const Bills = () => {
  const {
    bills,
    billPayments,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
  } = useApp();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const getBillStatus = (bill) => {
    const payment = billPayments.find(
      (bp) => bp.bill_id === bill.id && bp.month === currentMonth
    );
    if (payment) return payment.status;
    const today = new Date().getDate();
    if (today > bill.due_day) return "overdue";
    return "due";
  };



  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-24)",
        }}
      >
        <h2>{t('bills.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
         {t('bills.addBill')}
        </button>
      </div>

      <div>
        {bills.map((bill) => {
          const status = getBillStatus(bill);
          const payment = billPayments.find(
            (bp) => bp.bill_id === bill.id && bp.month === currentMonth
          );

          return (
            <div key={bill.id} className="bill-item">
              <div className="bill-header">
                <div>
                  <div className="bill-name">{bill.name}</div>
                  <div
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-text-secondary)",
                      marginTop: "var(--space-4)",
                    }}
                  >
                    {t('bills.details', {
                      amount: formatCurrency(bill.amount),
                      dueDay: bill.due_day,
                      autoPay: bill.autopay ? t('bills.autoPayOn') : t('bills.manual'),
                      frequency: bill.frequency
                    })}
                  </div>

                  {payment?.paid_on && (() => {
                    const paidDate = new Date(payment.paid_on);

                    const formatted = paidDate.toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        style={{
                          fontSize: "var(--font-size-sm)",
                          color: "var(--color-text-secondary)",
                          marginTop: "var(--space-4)",
                        }}
                      >
                        {t('bills.paidOn', { date: formatted })}
                      </div>
                    );
                  })()}

                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={`bill-status ${status}`}>
                    {t(`bills.status.${status}`)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-8)",
                      marginTop: "var(--space-8)",
                      justifyContent: "flex-end",
                    }}
                  >
                    {status !== "paid" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => markBillAsPaid(bill.id)}
                      >
                       {t('bills.markAsPaid')}
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setEditingBill(bill);
                        setShowModal(true);
                      }}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleteConfirm(bill.id)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BillModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBill(null);
        }}
        bill={editingBill}
        onSubmit={(data) => {
          if (editingBill) {
            updateBill(editingBill.id, data);
          } else {
            addBill(data);
          }
          setShowModal(false);
          setEditingBill(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          deleteBill(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title={t('bills.deleteTitle')}
        message={t('bills.deleteMessage')}
      />
    </div>
  );
};

// ===== Bill Modal =====

const BillModal = ({ isOpen, onClose, bill, onSubmit }) => {
  const { categories } = useApp();
  const catLabel = (cat) => (cat ? t(`categories.${cat.key}`, cat.name) : "");
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    due_day: 1,
    frequency: "monthly",
    auto_pay: false,
    active: true,
    category_id: "", // NEW
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        amount: bill.amount,
        due_day: bill.due_day,
        frequency: bill.frequency,
        auto_pay: bill.auto_pay,
        active: bill.active,
        category_id: bill.category_id ?? "",
      });
    } else {
      setFormData({
        name: "",
        amount: "",
        due_day: 1,
        frequency: "monthly",
        auto_pay: false,
        active: true,
        category_id: "",
      });
    }
  }, [bill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      due_day: parseInt(formData.due_day, 10),
      category_id: parseInt(formData.category_id, 10),
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={bill ? t('bills.editTitle') : t('bills.createTitle')}>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">{t('bills.name')}</label>
          <input
            className="form-control"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('bills.amount')}</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        {/* 👉 CATEGORY FIELD YAHAN HAI */}
        <div className="form-group">
          <label className="form-label">{t('bills.category')}</label>
          <select
            className="form-control"
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            required
          >
            <option value="">{t('bills.selectCategory')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {catLabel(cat)}
              </option>
            ))}

          </select>
        </div>
        {/* 👆 CATEGORY SELECT */}

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{t('bills.dueDay')}</label>
            <input
              type="number"
              min="1"
              max="31"
              className="form-control"
              value={formData.due_day}
              onChange={(e) =>
                setFormData({ ...formData, due_day: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('bills.frequency')}</label>
            <select
              className="form-control"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
            >
              <option value="monthly">{t('bills.monthly')}</option>
              <option value="quarterly">{t('bills.quarterly')}</option>
              <option value="yearly">{t('bills.yearly')}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.auto_pay}
              onChange={(e) =>
                setFormData({ ...formData, auto_pay: e.target.checked })
              }
            />
            <span>{t('bills.autoPay')}</span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
            <span>{t('bills.active')}</span>
          </label>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {bill ? t('bills.saveChanges') : t('bills.addBillButton')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
// ==== Bills component yahan khatam hota hai ====

// ==== yahan Account component add karo ====
const Account = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");

const handleSave = async (e) => {
  e.preventDefault();
  setMessage("");

  if (newPassword && !isStrongPassword(newPassword)) {
    setMessage(t('account.passwordWeak'));
    return;
  }

  const updates = {};
  if (name && name !== user.name) updates.name = name;
  if (phone && phone !== user.phone) updates.phone = phone;
  if (newPassword) updates.password = newPassword;

    const apply = async (extra) => {
      try {
        await updateProfile({ ...updates, ...extra });
        setMessage(t('account.profileUpdated'));
      } catch (err) {
        console.error("updateProfile error:", err);
        setMessage(t('account.updateFailed'));
      }
      setEditing(false);
      setNewPassword("");
    };

  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = () => {
      apply({ avatar: reader.result });
    };
    reader.readAsDataURL(avatarFile);
  } else {
    apply({});
  }
};


  const avatarSrc =
    user?.avatar ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user?.name || user?.email || "User");

  return (
    <div className="card account-card">
      <div className="card-header" style={{ justifyContent: "space-between" }}>
        <h3 className="card-title">
          {user?.name || t('account.title')}
        </h3>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? t('common.cancel') : t('account.edit')}
        </button>
      </div>

      <form onSubmit={handleSave} className="auth-form">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <img
            src={avatarSrc}
            alt={t('account.avatarAlt')}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0] || null)}
            />
          )}
        </div>

        {/* Email readonly */}
        <div className="form-group">
          <label className="form-label">{t('account.email')}</label>
          <input
            type="email"
            className="form-control"
            value={user?.email || ""}
            disabled
          />
        </div>

        {/* Name */}
        <div className="form-group">
          <label className="form-label">{t('account.name')}</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">{t('account.name')}</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
          />
        </div>

         {/* Change password */}
        <div className="form-group">
          <label className="form-label">{t('account.newPassword')}</label>
          <div className="password-field-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!editing}
              placeholder={t('account.passwordPlaceholder')}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={!editing}
            >
              {showPassword ? t('common.hide') : t('common.show')}
            </button>
          </div>
        </div>


        {message && (
          <div className="auth-error" style={{ color: "#4ade80" }}>
            {message}
          </div>
        )}

        {editing && (
          <button type="submit" className="btn btn-primary">
            {t('account.saveChanges')}
          </button>
        )}
      </form>
    </div>
  );
};




// ===== Protected App (login ke baad hi dashboard) =====
const ProtectedApp = () => {
  const { user, logout } = useAuth();      // AuthContext se
  const { currentPage, toast } = useApp(); // AppContext se
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 1) User login nahi hai → sirf LoginPage
  if (!user) {
    return <LoginPage />;
  }

  // 2) User login hai → tumhara same old layout
  const pageTitle = t(`nav.${currentPage}`);  // Magic line! "dashboard" → "डैशबोर्ड"

  // const pageTitle =
  //   currentPage === "dashboard"
  //     ? "Dashboard"
  //     : currentPage === "transactions"
  //     ? "Transactions"
  //     : currentPage === "budgets"
  //     ? "Budgets"
  //     : currentPage === "pots"
  //     ? "Savings Pots"
  //     : "Bills";

  return (
    <Router>
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

        <div
          className={`main-content ${
            !sidebarOpen ? "sidebar-collapsed" : ""
          }`}
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
        <div className="top-bar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
           ✦
          </button>
          <h1 className="page-title">
            {t('common.welcome')} {user?.name || user?.email} 
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               {/* <ThemeSwitcher />  
               <LanguageSwitcher />
                */}
           <MenuDrawer />
        </div>
       </div>
       <div className="page-scrollable">
         <Routes>
              {/* TERA ORIGINAL DASHBOARD PAGES */}
              <Route path="/" element={
                <>
            
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "transactions" && <Transactions />}
          {currentPage === "budgets" && <Budgets />}
          {currentPage === "pots" && <Pots />}
          {currentPage === "bills" && <Bills />}
          {currentPage === "account" && <Account />}
                  </>
              } />
               {/* 🚀 NEW PAGES */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
        </div>
      </div>

      <Toast toast={toast} />
      <ChatWidget/>
      <BudgetAlerts />
       <BottomNav />
    </div>
    </Router>
  );
};

// ===== Root App: Auth + App providers wrap =====
const App = () => (
  <AuthProvider>
    <AppProvider>
      <ProtectedApp />
    </AppProvider>
  </AuthProvider>
);

export default App;