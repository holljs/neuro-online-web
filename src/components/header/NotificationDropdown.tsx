import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

type NotificationItem = {
  id: number;
  title: string;
  desc: string;
  time: string;
  isNew: boolean;
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "🚀 Видеомодель ByteDance!",
      desc: "Создавайте кинематографичные ролики со звуком.",
      time: "Сегодня",
      isNew: true,
    },
    {
      id: 2,
      title: "🎨 Обновление НейроХудожника",
      desc: "Улучшено сохранение черт лица в VIP-Микс.",
      time: "Вчера",
      isNew: false,
    },
  ]);

  // Загружаем сохранённый статус «прочитано»
  const [hasUnread, setHasUnread] = useState<boolean>(() => {
    const lastReadId = localStorage.getItem("last_read_notif_id");
    return lastReadId !== "1"; // Если id=1 уже прочитан, точек нет
  });

  const toggleDropdown = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // При открытии гасим красную точку и запоминаем это
    if (nextState && hasUnread) {
      setHasUnread(false);
      localStorage.setItem("last_read_notif_id", "1");
      setNotifs((prev) =>
        prev.map((item) => ({ ...item, isNew: false }))
      );
    }
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-10 h-10 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
        aria-label="Уведомления"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>

        {/* Красный кружочек только если есть непрочитанные */}
        {hasUnread && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse" />
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900 z-99999"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
            Уведомления
          </h4>
          <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
            Новости
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`p-2.5 rounded-xl border text-xs transition ${
                n.isNew
                  ? "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30"
                  : "bg-gray-50/50 border-gray-100 dark:bg-gray-800/30 dark:border-gray-800"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 dark:text-white">
                  {n.title}
                </span>
                <span className="text-[10px] text-gray-400">{n.time}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-snug">
                {n.desc}
              </p>
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}