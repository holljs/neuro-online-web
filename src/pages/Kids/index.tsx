import React from "react";
import { useNavigate } from "react-router";

export default function Kids() {
  const navigate = useNavigate();

  const kidsApps = [
    {
      id: "malysh",
      title: "Нейро-Малыш",
      age: "2–5 лет",
      description: "Запуск речи, базовый кругозор, эмоциональный интеллект и логика",
      price: "180 ₽ навсегда",
      freeTrial: "24 часа бесплатно",
      vkAppId: "54603838",
      // Нежный шалфейный / фисташковый пастельный тон
      badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accentColor: "group-hover:text-emerald-500",
      borderHover: "hover:border-emerald-500/30",
    },
    {
      id: "genius",
      title: "Нейро-Гений",
      age: "6+ лет",
      description: "Ментальная арифметика, развивающие игры, память и китайский язык",
      price: "150 ₽/мес",
      freeTrial: "24 часа бесплатно",
      vkAppId: "54612283",
      // Приглушённый песочно-янтарный тон
      badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accentColor: "group-hover:text-amber-500",
      borderHover: "hover:border-amber-500/30",
    },
    {
      id: "tutor",
      title: "Нейро-Репетитор",
      age: "Школьники",
      description: "Подготовка к ОГЭ, ЕГЭ и олимпиадам с персональным ИИ-анализом",
      price: "От 150 ₽",
      freeTrial: "6 кредитов в подарок",
      vkAppId: "51800000",
      // Нежно-лавандовый / индиго тон
      badgeStyle: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      accentColor: "group-hover:text-indigo-500",
      borderHover: "hover:border-indigo-500/30",
    },
  ];

  const openVkApp = (vkAppId: string) => {
    if ((window as any).vkBridge) {
      (window as any).vkBridge
        .send("VKWebAppOpenApp", { app_id: vkAppId })
        .catch(() => {
          window.open(`https://vk.com/app${vkAppId}`, "_blank");
        });
    } else {
      window.open(`https://vk.com/app${vkAppId}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Шапка */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>На главную</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              Детский центр
            </h1>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* Заголовок раздела */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Образовательные платформы
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Интерактивные развивающие тренажёры и ИИ-ассистенты для любого возраста
          </p>
        </div>

        {/* Сетка строгих карточек в софт-тонах */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kidsApps.map((app) => (
            <div
              key={app.id}
              className={`group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${app.borderHover}`}
            >
              <div>
                {/* Метка возраста */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${app.badgeStyle}`}
                  >
                    {app.age}
                  </span>
                  
                  {/* Аккуратный минималистичный индикатор (заглушка под маскота) */}
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:scale-125 transition-transform" />
                </div>

                {/* Заголовок и описание */}
                <h3
                  className={`text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors ${app.accentColor}`}
                >
                  {app.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {app.description}
                </p>
              </div>

              {/* Детали подписки и кнопка */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Тариф:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {app.price}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Бонус:
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {app.freeTrial}
                  </span>
                </div>

                <button
                  onClick={() => openVkApp(app.vkAppId)}
                  className="w-full mt-2 py-2.5 px-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <span>Открыть сервис</span>
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Аккуратная плашка специального предложения */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Бесплатный доступ
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Как протестировать все возможности?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Подпишитесь на нашу официальную группу ВКонтакте и напишите в сообщения слово{" "}
              <span className="font-semibold text-gray-900 dark:text-white">«Привет»</span> — бот автоматически зачислит 24 часа полного VIP-доступа ко всем образовательным тренажёрам.
            </p>
          </div>
        </div>

        {/* Таблица/Блок выбора сервиса */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
            Назначение и целевая аудитория
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                Нейро-Малыш
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Первичный запуск речи, развитие артикуляции, изучение букв, цифр и звукоподражание.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                Нейро-Гений
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Ментальный счёт, тренировка памяти и пространственного мышления, основы китайского языка.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                Нейро-Репетитор
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Глубокий разбор предметов, интерактивная подготовка к экзаменам и решение олимпиадных задач.
              </p>
            </div>
          </div>
        </div>

        {/* Подвал */}
        <footer className="pt-6 border-t border-gray-200/60 dark:border-gray-800/60 text-center text-xs text-gray-400 space-y-1">
          <p>© 2026 Нейро-Мастер. Все права защищены.</p>
          <p>Самозанятая Селяхова Наталья Викторовна | ИНН: 502204523550</p>
        </footer>
      </main>
    </div>
  );
}