import React from "react";
import { useApp } from "./App";
import { useTranslation } from "react-i18next";


const ThemeSwitcher = () => {
const { t } = useTranslation();
const { theme, setTheme } = useApp();


  const handleChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="theme-switcher">
      <select value={theme} onChange={handleChange}>
        <option value="light">{t("theme.light")}</option>
        <option value="dark">{t("theme.dark")}</option>
        <option value="emerald">{t("theme.emerald")}</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
