import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "huge">(
    () => (localStorage.getItem("app_font_size") as "normal" | "large" | "huge") || "normal"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-size-normal", "font-size-large", "font-size-huge");
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem("app_font_size", fontSize);
  }, [fontSize]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Настройки приложения
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Управление внешним видом и удобством использования
          </p>
        </div>

        {/* Блок настройки шрифта */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>👁️</span> Размер шрифта и читаемость
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Выберите комфортный размер текста для работы с сервисом
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFontSize("normal")}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                fontSize === "normal"
                  ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              Обычный (A)
            </button>

            <button
              type="button"
              onClick={() => setFontSize("large")}
              className={`py-3 px-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                fontSize === "large"
                  ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              Крупный (A+)
            </button>

            <button
              type="button"
              onClick={() => setFontSize("huge")}
              className={`py-3 px-3 rounded-xl border text-base font-bold transition cursor-pointer ${
                fontSize === "huge"
                  ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              Огромный (A++)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}