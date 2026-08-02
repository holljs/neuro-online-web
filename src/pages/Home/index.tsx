import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const apps = [
    {
      id: "bro",
      title: "Нейро-Бро",
      subtitle: "ИИ-ассистент",
      description: "Отвечает на вопросы, анализирует фото, пишет код",
      icon: "🤖",
      color: "from-blue-500 to-indigo-600",
      path: "/bro",
      cost: "3-50 ⚡",
    },
    {
      id: "artist",
      title: "Нейро-Художник",
      subtitle: "Генерация медиа",
      description: "Картинки, видео, музыка по текстовому описанию",
      icon: "🎨",
      color: "from-purple-500 to-pink-600",
      path: "/artist",
      cost: "1-50 кр.",
    },
    {
      id: "kids",
      title: "Детский центр",
      subtitle: "Образование и игры",
      description: "Малыш, Гений и Репетитор — всё для развития детей",
      icon: "",
      color: "from-green-400 to-teal-600",
      path: "/kids",
      cost: "Бесплатно / VIP",
      isNew: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Шапка */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              N
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Нейро-Мастер
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Все ИИ-инструменты в одном месте
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">
              neuro-master.online
            </span>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Приветствие */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Добро пожаловать! 👋
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Выберите приложение, которое вам нужно. Все инструменты работают с
            единым аккаунтом ВКонтакте.
          </p>
        </div>

        {/* Карточки приложений */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {apps.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(app.path)}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 overflow-hidden"
            >
              {/* Градиентный фон при наведении */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Бейдж "Новинка" */}
              {app.isNew && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  NEW
                </div>
              )}

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
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                {app.subtitle}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {app.description}
              </p>

              {/* Стоимость */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {app.cost}
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Открыть →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Информационный блок */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl"></div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Единая авторизация через ВКонтакте
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Войдите один раз через VK ID — и все приложения будут доступны
                без повторной авторизации. Ваш баланс кредитов и энергии
                синхронизирован между всеми сервисами.
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