import React from "react";
import { Link } from "react-router";

export default function ECommerce() {
  return (
    <div className="space-y-6">
      {/* Приветственный баннер */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-black mb-2">
          Добро пожаловать в Нейро-Онлайн! 👋
        </h1>
        <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
          Ваша единая экосистема искусственного интеллекта. Выберите нужный инструмент ниже и приступайте к работе.
        </p>
      </div>

      {/* Сетка карточек продуктов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Карточка 1: Нейро-Бро */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-2xl mb-4">
              🤖
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Нейро-Бро
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Универсальный текстовый ИИ-ассистент на базе ChatGPT, Gemini и Kimi. Поможет со статьями, кодом и аналитикой.
            </p>
          </div>
          <Link
            to="/neuro-bro"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 py-3 px-4 text-center font-medium text-white hover:bg-blue-700 transition"
          >
            Открыть чат
          </Link>
        </div>

        {/* Карточка 2: Нейро-Художник */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-2xl mb-4">
              🎨
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Нейро-Художник
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Студия генерации изображений, видео и иллюстраций. Создавайте фотореалистичные арты и графику за секунды.
            </p>
          </div>
          <Link
            to="/neuro-artist"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 py-3 px-4 text-center font-medium text-white hover:bg-purple-700 transition"
          >
            Создать арт
          </Link>
        </div>

        {/* Карточка 3: Нейро-Академия */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-2xl mb-4">
              🧸
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Нейро-Академия
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Образовательный хаб для всех возрастов: интерактивный «Нейро-Малыш», развитие логики с «Нейро-Гением» и «Нейро-Репетитор».
            </p>
          </div>
          <Link
            to="/neuro-malysh"
            className="inline-flex items-center justify-center rounded-lg bg-amber-600 py-3 px-4 text-center font-medium text-white hover:bg-amber-700 transition"
          >
            Перейти к обучению
          </Link>
        </div>
      </div>
    </div>
  );
}