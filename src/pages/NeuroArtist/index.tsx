import React, { useState } from "react";

type CategoryType = "photo" | "video" | "business";

type HistoryItem = {
  id: string;
  modeName: string;
  prompt: string;
  date: string;
  mediaUrl?: string;
};

export default function NeuroArtist() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("photo");
  const [activeMode, setActiveMode] = useState<string>("t2i");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBusinessTemplate, setSelectedBusinessTemplate] = useState("product");

  // История генераций (как в Телеграм!)
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      modeName: "Ультра-Фото",
      prompt: "Девушка в кофеине, естественный свет, надпись 'Доброе утро'",
      date: "Сегодня, 14:20",
    }
  ]);

  // Режимы по категориям без эмодзи
  const modesByCategory = {
    photo: [
      { id: "t2i", name: "Нейро-Художник", cost: "1 кр.", desc: "Генерация артов по тексту" },
      { id: "vip_mix", name: "VIP-Микс", cost: "3 кр.", desc: "Точное сохранение лиц и внешности" },
      { id: "seadream_mix", name: "Мега-Микс", cost: "3 кр.", desc: "Постеры, баннеры и рекламный дизайн" },
      { id: "ultra_photo", name: "Ультра-Фото", cost: "5 кр.", desc: "Премиум-реализм и русский текст" },
      { id: "gfpgan", name: "Реставратор", cost: "3 кр.", desc: "Повышение четкости и удаление шума" },
    ],
    video: [
      { id: "i2v", name: "Живое Фото", cost: "3 кр.", desc: "Анимация и оживление портрета" },
      { id: "bytedance_5", name: "ИИ-Режиссер (5 сек)", cost: "30 кр.", desc: "Видеоролик с нативным звуком" },
      { id: "bytedance_10", name: "ИИ-Режиссер (10 сек)", cost: "50 кр.", desc: "Длинный клип с эффектами" },
    ],
    business: [
      { id: "wb_card", name: "Карточка WB / Ozon", cost: "3 кр.", desc: "Продающий баннер товара" },
      { id: "fashion", name: "Одежда на модели", cost: "3 кр.", desc: "Примерка на человека" },
      { id: "food", name: "Фуд-съемка", cost: "3 кр.", desc: "Мишлен-подача и коллажи" },
      { id: "furniture", name: "Интерьер и мебель", cost: "3 кр.", desc: "3D-визуализация комнат" },
    ],
  };

  const currentModes = modesByCategory[activeCategory];

  const handleGenerate = () => {
    if (!prompt.trim() && activeMode !== "gfpgan") return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      // Добавляем запись в историю
      const currentModeObj = currentModes.find((m) => m.id === activeMode);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        modeName: currentModeObj?.name || "Генерация",
        prompt: prompt || "Без текста (Реставрация)",
        date: "Только что",
      };
      setHistory((prev) => [newItem, ...prev]);
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Левая колонка — Рабочая панель (2/3 ширины) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Заголовок */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Студия генерации
          </h2>
          <p className="text-sm text-gray-500">
            Выберите категорию, режим и настройте параметры запроса.
          </p>

          {/* Главные категории: Фото / Видео / Бизнес */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 mt-6 gap-6">
            {[
              { id: "photo", label: "Фото и Арт" },
              { id: "video", label: "Видео и Анимация" },
              { id: "business", label: "Для Бизнеса" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as CategoryType);
                  setActiveMode(modesByCategory[cat.id as CategoryType][0].id);
                }}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeCategory === cat.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Список режимов внутри выбранной категории */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {currentModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  activeMode === mode.id
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {mode.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {mode.cost}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{mode.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Настройки и ввод */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          {/* Загрузка фото для нужных режимов */}
          {["vip_mix", "seadream_mix", "ultra_photo", "gfpgan", "i2v", "wb_card", "fashion", "food", "furniture"].includes(activeMode) && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Исходные изображения
              </label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition bg-gray-50/50 dark:bg-gray-800/30">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Перетащите файлы сюда или <span className="text-blue-600">выберите на компьютере</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Допустимы JPG, PNG, WEBP</p>
              </div>
            </div>
          )}

          {/* Промпт */}
          {activeMode !== "gfpgan" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Текстовое описание (Промпт)
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Подробно опишите, что должна создать нейросеть..."
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isGenerating ? "Идет генерация..." : "Запустить генерацию"}
          </button>
        </div>
      </div>

      {/* Правая колонка — История генераций (1/3 ширины, как в ТГ!) */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
            История генераций
          </h3>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {item.modeName}
                  </span>
                  <span className="text-gray-400">{item.date}</span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">
                  {item.prompt}
                </p>
                <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                  Медиафайл
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}