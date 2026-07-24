import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const tools = [
    {
      title: "Нейро-Бро",
      desc: "Универсальный ИИ-помощник для решения любых задач, работы с текстом и кодом.",
      path: "/neuro-bro",
      tag: "Текст и Чат",
    },
    {
      title: "Нейро-Художник",
      desc: "Генерация изображений, обработка фото, создание видеоклипов и материалов для бизнеса.",
      path: "/neuro-artist",
      tag: "Медиа & Дизайн",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Приветственный блок */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Добро пожаловать в NeuroStudio
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl">
          Единая платформа искусственного интеллекта. Выберите нужный инструмент для работы с текстом, изображениями и видео.
        </p>
      </div>

      {/* Сетка инструментов */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Доступные инструменты
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {tool.title}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {tool.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                Открыть инструмент &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}