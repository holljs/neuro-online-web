import { useState, useRef, useEffect } from "react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("user_id");
    if (savedId) setUserId(savedId);

    // Закрытие при клике мимо меню
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUserId(null);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка Аватарки */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm ring-2 ring-blue-500/20">
          {userId ? "VK" : "👤"}
        </div>
        <div className="hidden text-left lg:block">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {userId ? `id${userId}` : "Мой аккаунт"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {userId ? "Авторизован" : "Войти"}
          </p>
        </div>
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900 z-99999">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
            <p className="text-xs text-gray-400">Статус</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {userId ? `VK ID: ${userId}` : "Гость"}
            </p>
          </div>

          <div className="space-y-1">
            {/* 👤 Переход в Личный Кабинет */}
            <a
              href="/signin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
            >
              <span>👤</span> Личный кабинет
            </a>

            {/* ⚙️ Настройки */}
            <a
              href="/signin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
            >
              <span>⚙️</span> Настройки
            </a>

            {/* 💬 Поддержка (сообщения ВКонтакте) */}
            <a
              href="https://vk.com/im?media=&sel=-233876992"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
            >
              <span>💬</span> Поддержка
            </a>
          </div>

          {userId && (
            <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
              >
                <span>🚪</span> Выйти
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}