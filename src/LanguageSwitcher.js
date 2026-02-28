// src/LanguageSwitcher.js
import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 12 }}>{t("common.language")}</span>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
        <option value="gu">Gujarati</option>
        <option value="ta">Tamil</option>
        <option value="ml">Malayalam</option>
        <option value="te">Telugu</option>
        <option value="kn">Kannada</option>
        <option value="bn">Bengali</option>

      </select>
    </label>
  );
}
