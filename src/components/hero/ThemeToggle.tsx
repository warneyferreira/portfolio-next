"use client";

import { useSyncExternalStore } from "react";
import s from "./hero.module.css";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  const media = matchMedia("(prefers-color-scheme: dark)");
  const followSystem = () => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.setAttribute("data-theme", media.matches ? "dark" : "light");
    }
  };
  media.addEventListener("change", followSystem);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", followSystem);
  };
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-theme") === "dark",
    () => false,
  );

  return (
    <button className={s.themeToggle} type="button" aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"} onClick={() => {
      const next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z" />}
      </svg>
    </button>
  );
}
