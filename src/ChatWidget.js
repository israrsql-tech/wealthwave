// src/ChatWidget.js
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "./App";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";

const ChatWidget = () => {
  const { transactions, pots, bills, budgets } = useApp(); // for auto re-run triggers
  const { token } = useAuth();
  const { i18n } = useTranslation(); // i18n.language [web:231]

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const API_URL = "https://wealthwave-backend-production.up.railway.app/api";
  // const API_URL = "http://10.113.213.87:4000/api"; 


  // --- auto re-run controls ---
  const [autoRerun, setAutoRerun] = useState(true);
  const lastQueryRef = useRef("");
  const rerunTimerRef = useRef(null);
  const inFlightRef = useRef(false);

  // Keep latest messages available inside async callbacks (avoid stale state issues)
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const callAI = async (userText) => {
    if (!token) throw new Error("No token. Please login again.");

    const history = (messagesRef.current || []).slice(-8).map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const r = await fetch(`${API_URL}/ai/finance-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: userText,
        history,
        lang: i18n.language,
        period: { type: "thisMonth" }, // later dropdown se dynamic kar lena
      }),
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.message || "AI failed");
    return data.reply || "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    lastQueryRef.current = trimmed;

    pushMessage({ from: "user", text: trimmed });
    setInput("");

    inFlightRef.current = true;

    try {
      pushMessage({ from: "bot", text: "Thinking..." });
      const reply = await callAI(trimmed);

      // Replace "Thinking..." with actual reply
      setMessages((prev) => [...prev.slice(0, -1), { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: "AI error. Please try again." },
      ]);
    } finally {
      inFlightRef.current = false;
    }
  };

  // ✅ Auto re-run: when any finance data changes, rerun last query (debounced)
  useEffect(() => {
    if (!isOpen) return;
    if (!autoRerun) return;
    if (!lastQueryRef.current) return;
    if (inFlightRef.current) return;

    // debounce multiple quick changes (e.g., add bill + refresh list)
    if (rerunTimerRef.current) clearTimeout(rerunTimerRef.current);

    rerunTimerRef.current = setTimeout(async () => {
      if (!isOpen) return;
      if (!autoRerun) return;
      if (!lastQueryRef.current) return;
      if (inFlightRef.current) return;

      inFlightRef.current = true;

      try {
        pushMessage({ from: "bot", text: "Data updated. Refreshing analysis..." });
        const reply = await callAI(lastQueryRef.current);

        // Replace the refresh placeholder with the new reply
        setMessages((prev) => [...prev.slice(0, -1), { from: "bot", text: reply }]);
      } catch (e) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { from: "bot", text: "Auto-refresh failed. Please ask again." },
        ]);
      } finally {
        inFlightRef.current = false;
      }
    }, 700);

    return () => {
      if (rerunTimerRef.current) clearTimeout(rerunTimerRef.current);
    };
    // NOTE: using array references, updates/add/delete generally create new arrays -> triggers effect
  }, [transactions, budgets, bills, pots, isOpen, autoRerun]);

  return (
    <>
      <button className="chat-toggle" onClick={toggleOpen} aria-label="Open finance assistant">
        💬
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-title">WealthWave Assistant</div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 12, userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={autoRerun}
                  onChange={(e) => setAutoRerun(e.target.checked)}
                  style={{ marginRight: 6 }}
                />
                Auto re-run
              </label>

              <button className="chat-close" onClick={toggleOpen}>
                ✕
              </button>
            </div>
          </div>

          <div className="chat-suggestions">
            {[
              "spending summary",
              "monthly summary",
              "compare this month with last 3 months",
              "compare bills this month with last 6 months",
              "budget status",
              "category wise spending",
            ].map((q) => (
              <button
                key={q}
                type="button"
                className="chat-suggestion-chip"
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-message ${m.from === "user" ? "chat-user" : "chat-bot"}`}
              >
                {m.text.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about your spending..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
