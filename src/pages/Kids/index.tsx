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
      route: "/kids/malysh",
      badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accentColor: "group-hover:text-emerald-500",
      borderHover: "hover:border-emerald-500/30",
      btnStyle: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
    },
    {
      id: "genius",
      title: "Нейро-Гений",
      age: "6+ лет",
      description: "Ментальная арифметика, развивающие игры, память и китайский язык",
      price: "250 ₽/навсегда",
      freeTrial: "24 часа бесплатно",
      vkAppId: "54612283",
      route: "/kids/genius",
      badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accentColor: "group-hover:text-amber-500",
      borderHover: "hover:border-amber-500/30",
      btnStyle: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20",
    },
    {
      id: "tutor",
      title: "Нейро-Репетитор",
      age: "Школьники",
      description: "Подготовка к ОГЭ, ЕГЭ и олимпиадам с персональным ИИ-анализом",
      price: "От 150 ₽",
      freeTrial: "6 кредитов в подарок",
      vkAppId: "54451631",
      route: "/kids/tutor",
      badgeStyle: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      accentColor: "group-hover:text-indigo-500",
      borderHover: "hover:border-indigo-500/30",
      btnStyle: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20",
    },
  ];

  const handleOpenApp = (vkAppId: string, route: string) => {
    // 1. Если запущены внутри VK Mini App
    if ((window as any).vkBridge) {
      (window as any).vkBridge
        .send("VKWebAppOpenApp", { app_id: parseInt(vkAppId) })
        .catch(() => {
          window.open(`https://vk.com/app${vkAppId}`, "_blank");
        });
      return;
    }

    // 2. Открываем веб-версию приложения VK в новой вкладке (без ошибки 404 роутера)
    window.open(`https://vk.com/app${vkAppId}`, "_blank");
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

        {/* Сетка карточек */}
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

              {/* Детали подписки и кнопка перехода */}
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

                {/* Кнопка запуска без ошибок роутинга */}
                <button
                  onClick={() => handleOpenApp(app.vkAppId, app.route)}
                  className={`w-full mt-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow ${app.btnStyle}`}
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

        {/* Назначение и аудитория */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">
            Назначение и целевая аудитория
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-gray-800/40 border border-emerald-100 dark:border-gray-800">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                Нейро-Малыш
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Первичный запуск речи, развитие артикуляции, изучение букв, цифр и звукоподражание.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-gray-800/40 border border-amber-100 dark:border-gray-800">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                Нейро-Гений
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Ментальный счёт, тренировка памяти и пространственного мышления, основы китайского языка.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-gray-800/40 border border-indigo-100 dark:border-gray-800">
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