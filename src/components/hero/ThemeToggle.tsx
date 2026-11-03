"use client";

import { useSyncExternalStore } from "react";
import s from "./hero.module.css";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });

  /* sem escolha salva, o tema acompanha o sistema ao vivo */
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
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"),
    () => "light",
  );
  const dark = theme === "dark";

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = dark ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    const box = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--theme-x", `${box.left + box.width / 2}px`);
    root.style.setProperty("--theme-y", `${box.top + box.height / 2}px`);
    document.startViewTransition(apply);
  }

  return (
    <button type="button" className={s.toggle} aria-pressed={dark} onClick={toggle}>
      <span className={s.srOnly}>Modo escuro</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <mask id="theme-moon">
          <rect width="24" height="24" fill="#fff" />
          <circle className={s.bite} cx="24" cy="4" r="7" fill="#000" />
        </mask>
        <circle className={s.disc} cx="12" cy="12" r="5" mask="url(#theme-moon)" />
        <g className={s.rays}>
          <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
        </g>
      </svg>
    </button>
  );
}
