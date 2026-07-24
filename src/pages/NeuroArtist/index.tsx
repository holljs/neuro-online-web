import React, { useState } from "react";

type ModeType =
  | "t2i"
  | "vip_mix"
  | "seadream_mix"
  | "ultra_photo"
  | "gfpgan"
  | "i2v"
  | "bytedance"
  | "business";

export default function NeuroArtist() {
  const [activeMode, setActiveMode] = useState<ModeType>("t2i");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBusinessTemplate, setSelectedBusinessTemplate] = useState("product");

  // Список режимов из твоего ТГ-бота
  const modes = [
    { id: "t2i", name: "🎨 Нейро-Художник", cost: "1 кр.", desc: "Генерация артов по тексту" },
    { id: "vip_mix", name: "👑 VIP-Микс", cost: "3 кр.", desc: "Точное сохранение лиц" },
    { id: "seadream_mix", name: "🪄 Мега-Микс", cost: "3 кр.", desc: "Постеры, баннеры и дизайн" },
    { id: "ultra_photo", name: "🌟 Ультра-Фото", cost: "5 кр.", desc: "Премиум-реализм + текст" },
    { id: "gfpgan", name: "📜 Реставратор", cost: "3 кр.", desc: "Улучшение и удаление шума" },
    { id: "i2v", name: "✨ Живое Фото", cost: "3 кр.", desc: "Оживлению фото в видео" },
    { id: "bytedance", name: "🎥 ИИ-Режиссёр", cost: "30-50 кр.", desc: "Видеоклипы 5-10 секунд со звуком" },
    { id: "business", name: "💼 Для Бизнеса", cost: "3 кр.", desc: "Маркетплейсы, еда, модель" },
  ];

  const handleGenerate = () => {
    if (!prompt.trim() && activeMode !== "gfpgan") return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Шапка раздела */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Нейро-Художник & Студия Креатива 🎨
        </h2>
        <p className="text-sm text-gray-500">
          Выберите режим генерации, укажите детали и создавайте профессиональный контент.
        </p>

        {/* Переключатель режимов (Табы) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-6">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as ModeType)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                activeMode === mode.id
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                  : "border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div>
                <div className="font-bold text-xs sm:text-sm truncate">{mode.name}</div>
                <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{mode.desc}</div>
              </div>
              <span className="text-[10px] font-semibold mt-2 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 w-fit">
                {mode.cost}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Панель параметров для выбранного режима */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-gray-900 space-y-4">
        
        {/* Шаблоны для Бизнес-режима */}
        {activeMode === "business" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Выберите бизнес-шаблон:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "product", name: "📦 Карточка товара WB/Ozon" },
                { id: "fashion", name: "👗 Одежда на модели" },
                { id: "furniture", name: "🛋 Замена мебели" },
                { id: "repair", name: "🧱 Ремонт (обои/пол)" },
                { id: "food", name: "🍰 Еда (Мишлен / Коллаж)" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedBusinessTemplate(tmpl.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedBusinessTemplate === tmpl.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Зона загрузки фото (показываем для режимов, требующих исходники) */}
        {["vip_mix", "seadream_mix", "ultra_photo", "gfpgan", "i2v", "bytedance", "business"].includes(activeMode) && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Загрузите исходные фотографии (до 3-14 шт.)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition">
              <span className="text-2xl mb-2 block">📸</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Перетащите фото сюда или <span className="text-purple-600 font-semibold">выберите файл</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Поддерживаются JPG, PNG, WEBP</p>
            </div>
          </div>
        )}

        {/* Текстовое поле для промпта */}
        {activeMode !== "gfpgan" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Текстовое описание (Промпт)
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeMode === "ultra_photo"
                  ? 'Опишите кадр и укажите текст в кавычках, например: Девушка с кофе, надпись "Доброе утро"'
                  : "Опишите, что именно должна нарисовать нейросеть..."
              }
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Кнопка запуска */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto rounded-xl bg-purple-600 px-8 py-3 text-sm font-bold text-white hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isGenerating ? "⏳ Нейросеть генерирует..." : "🚀 Запустить генерацию"}
        </button>
      </div>

      {/* Галерея результатов */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Результат
        </h3>
        <div className="aspect-square max-w-md rounded-2xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
          <span className="text-4xl mb-2">🖼️</span>
          Здесь появится сгенерированное изображение или видеоклип
        </div>
      </div>
    </div>
  );
}