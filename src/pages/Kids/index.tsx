import React from "react";
import { useNavigate } from "react-router";

export default function Kids() {
  const navigate = useNavigate();

  const kidsApps = [
    {
      id: "malysh",
      title: "Нейро-Малыш",
      age: "2-5 лет",
      description: "Запуск речи, буквы, цифры, сказки, раскраски",
      icon: "🍼",
      color: "from-pink-400 to-rose-500",
      price: "180 ₽ навсегда",
      freeTrial: "24 часа бесплатно",
      vkAppId: "54603838",
    },
    {
      id: "genius",
      title: "Нейро-Гений",
      age: "6+ лет",
      description: "Ментальная арифметика, память, китайский язык",
      icon: "🧠",
      color: "from-orange-400 to-red-500",
      price: "150 ₽/мес",
      freeTrial: "24 часа бесплатно",
      vkAppId: "54612283",
    },
    {
      id: "tutor",
      title: "Нейро-Репетитор",
      age: "Школьники",
      description: "Подготовка к ОГЭ, ЕГЭ, олимпиадам с ИИ-анализом",
      icon: "📚",
      color: "from-indigo-400 to-purple-600",
      price: "От 150 ₽",
      freeTrial: "6 кредитов в подарок",
      vkAppId: "51800000",
    },
  ];

  const openVkApp = (vkAppId: string) => {
    // Если мы внутри VK Mini App
    if (window.vkBridge) {
      window.vkBridge
        .send("VKWebAppOpenApp", { app_id: vkAppId })
        .catch(() => {
          window.open(`https://vk.com/app${vkAppId}`, "_blank");
        });
    } else {
      // Если мы на обычном сайте
      window.open(`https://vk.com/app${vkAppId}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Шапка */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <svg
              className="w-5 h-5"
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
            <span className="font-medium">На главную</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧒</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Детский центр
            </h1>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Приветствие */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Образование и развитие 🎓
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Три мощных приложения для детей разных возрастов. От запуска речи
            до подготовки к ЕГЭ.
          </p>
        </div>

        {/* Карточки детских приложений */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {kidsApps.map((app) => (
            <div
              key={app.id}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500 dark:hover:border-green-400 overflow-hidden"
            >
              {/* Градиентный фон */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Возраст */}
              <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                {app.age}
              </div>

              {/* Иконка */}
              <div
                className={`w-20 h-20 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {app.icon}
              </div>

              {/* Контент */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {app.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {app.description}
              </p>

              {/* Цена и пробный период */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Цена:
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {app.price}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    🎁
                  </span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {app.freeTrial}
                  </span>
                </div>
              </div>

              {/* Кнопка */}
              <button
                onClick={() => openVkApp(app.vkAppId)}
                className={`w-full bg-gradient-to-r ${app.color} text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
              >
                Открыть приложение
              </button>
            </div>
          ))}
        </div>

        {/* Информационный блок */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl"></div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Как получить бесплатный доступ?
              </h3>
              <p className="text-green-100 leading-relaxed">
                Подпишитесь на нашу группу ВКонтакте и напишите боту слово
                "Привет" — вы получите 24 часа VIP-доступа ко всем тренажёрам
                бесплатно!
              </p>
            </div>
          </div>
        </div>

        {/* Сравнение приложений */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Какое приложение выбрать? 🤔
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3"></div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Малыш (2-5 лет)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Если ребёнок только начинает говорить, учит буквы и цифры
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧒</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Гений (6+ лет)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Для развития памяти, логики и изучения китайского языка
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Репетитор (Школьники)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Для подготовки к экзаменам и олимпиадам с ИИ-помощником
              </p>
            </div>
          </div>
        </div>

        {/* Футер */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 Нейро-Мастер. Все права защищены.</p>
          <p className="mt-2">
            Самозанятая Селяхова Наталья Викторовна | ИНН: 502204523550
          </p>
        </footer>
      </main>
    </div>
  );
}