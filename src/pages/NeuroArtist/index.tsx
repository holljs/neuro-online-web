import React, { useState } from "react";
import axios from "axios";

// --- НАСТРОЙКИ ПОДКЛЮЧЕНИЯ К СЕРВЕРУ ---
const API_BASE = "http://83.217.202.227:8001/api";
const USER_ID = 233876992; // Твой VK ID
const BOT_TOKEN = "SuperSecret_987654321_Token"; // Вставь токен из .env файла бэкенда

type CategoryType = "photo" | "video" | "business";

type HistoryItem = {
  id: string;
  modeName: string;
  prompt: string;
  date: string;
  images: string[];
  resultUrl?: string;
};

export default function NeuroArtist() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("photo");
  const [activeMode, setActiveMode] = useState<string>("t2i");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentResultUrl, setCurrentResultUrl] = useState<string | null>(null);

  // История генераций
  const [history, setHistory] = useState<HistoryItem[]>([]);

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

  // Обработка загрузки файлов
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Опрос сервера на статус готовности
  const checkStatus = async (taskId: string, modeObjName: string) => {
    try {
      const res = await axios.get(`${API_BASE}/task_status/${taskId}?user_id=${USER_ID}`, {
        headers: { "X-Bot-Token": BOT_TOKEN },
      });

      if (res.data.status === "ready" && res.data.result_url) {
        const finalUrl = res.data.result_url;
        setCurrentResultUrl(finalUrl);
        setIsGenerating(false);

        // Добавляем в историю
        const newItem: HistoryItem = {
          id: taskId,
          modeName: modeObjName,
          prompt: prompt || "Генерация по изображению",
          date: "Только что",
          images: [...selectedImages],
          resultUrl: finalUrl,
        };
        setHistory((prev) => [newItem, ...prev]);
      } else if (res.data.success === false) {
        alert("Ошибка генерации: " + (res.data.error || "Неизвестная ошибка"));
        setIsGenerating(false);
      } else {
        // Опрашиваем сервер каждые 3 секунды
        setTimeout(() => checkStatus(taskId, modeObjName), 3000);
      }
    } catch (e) {
      console.error("Ошибка проверки статуса:", e);
      setIsGenerating(false);
    }
  };

  // Запуск реальной генерации
  const handleGenerate = async () => {
    if (!prompt.trim() && activeMode !== "gfpgan" && selectedImages.length === 0) return;

    setIsGenerating(true);
    setCurrentResultUrl(null);

    const currentModeObj = currentModes.find((m) => m.id === activeMode);
    const modeName = currentModeObj?.name || "Генерация";

    try {
      const response = await axios.post(
        `${API_BASE}/generate`,
        {
          user_id: USER_ID,
          model: activeMode,
          prompt: prompt,
          image_urls: [], // Для передачи базовых URL из внешних источников
        },
        {
          headers: { "X-Bot-Token": BOT_TOKEN },
        }
      );

      if (response.data.success && response.data.task_id) {
        checkStatus(response.data.task_id, modeName);
      } else {
        alert("Не удалось создать задачу на сервере");
        setIsGenerating(false);
      }
    } catch (e) {
      console.error("Ошибка отправки генерации:", e);
      alert("Ошибка подключения к бэкенду или недостаточно кредитов.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Левая колонка — Панель управления */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Студия генерации
          </h2>
          <p className="text-sm text-gray-500">
            Выберите категорию, режим и настройте параметры запроса.
          </p>

          {/* Табы категорий */}
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

          {/* Сетка режимов */}
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

        {/* Настройки и Загрузка Изображений */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Прикрепить изображения
            </label>
            <label className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition bg-gray-50/50 dark:bg-gray-800/30 block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Нажмите, чтобы прикрепить файлы, или перетащите их сюда
              </p>
              <p className="text-xs text-gray-400 mt-1">Поддерживаются JPG, PNG, WEBP</p>
            </label>

            {/* Предпросмотр загруженных фото */}
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedImages.map((src, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={src} alt="Загруженное" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            {isGenerating ? "Нейросеть генерирует..." : "Запустить генерацию"}
          </button>
        </div>

        {/* Окно результатов текущей генерации */}
        {currentResultUrl && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 text-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              Результат готов
            </h3>
            {currentResultUrl.endsWith(".mp4") ? (
              <video src={currentResultUrl} controls className="mx-auto rounded-xl max-h-[500px]" />
            ) : (
              <img src={currentResultUrl} alt="Результат" className="mx-auto rounded-xl max-h-[500px] object-contain" />
            )}
            <a
              href={currentResultUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 underline"
            >
              Открыть в полном размере
            </a>
          </div>
        )}
      </div>

      {/* Правая колонка — История генераций */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
            История генераций
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-gray-400">История пока пуста. Запустите первую генерацию!</p>
          ) : (
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
                  {item.resultUrl && (
                    <div className="pt-2">
                      {item.resultUrl.endsWith(".mp4") ? (
                        <video src={item.resultUrl} className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <img src={item.resultUrl} alt="Результат" className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}