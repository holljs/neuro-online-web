import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState([
    {
      id: 1,
      title: "🚀 Видеомодель ByteDance!",
      desc: "Создавайте кинематографичные ролики до 10 секунд со звуком.",
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
    {
      id: 3,
      title: "🎁 Бонус при входе",
      desc: "Ваш баланс успешно подтянулся через VK ID.",
      time: "2 дня назад",
      isNew: false,
    },
  ]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const hasUnread = notifs.some((n) => iIsNew(n));
  function iIsNew(n: any) { return n.isNew; }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-10 h-10 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>

        {hasUnread && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
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