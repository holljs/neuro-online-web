import React from "react";
import { Link } from "react-router";
import { BoxCubeIcon, PlugInIcon } from "../../icons";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Заголовок */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Сервисы Нейро-Мастер
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Выберите нужный инструмент для работы
        </p>
      </div>

      {/* Две аккуратные карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
        {/* Карточка 1: Нейро-Бро */}
        <Link
          to="/neuro-bro"
          className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlugInIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Нейро-Бро
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                Универсальный ИИ-ассистент. Отвечает на вопросы, анализирует фото, помогает с кодом и текстами.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">3-50 ⚡</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              Открыть →
            </span>
          </div>
        </Link>

        {/* Карточка 2: Нейро-Художник */}
        <Link
          to="/neuro-artist"
          className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BoxCubeIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Нейро-Художник
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                Студия генерации медиа. Создание фото, оживление видео, создание музыки и обработка изображений.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">1-50 кр.</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              Открыть →
            </span>
          </div>
        </Link>
        {/* Карточка 3: Нейро-Криэйтор */}
        <Link
          to="/auto-posting"
          className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Нейро-Криэйтор
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                ИИ сам создаёт картинки и публикует их в вашу группу ВК по расписанию. Вы спите — контент идёт!
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">от 900 ₽/мес</span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
              Открыть →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}