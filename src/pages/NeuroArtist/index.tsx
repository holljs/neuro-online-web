import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://83.217.202.227:8001/api";
const USER_ID = 233876992;
const BOT_TOKEN = "SuperSecret_987654321_Token"; // Проверь свой BOT_SECRET_TOKEN из .env

type CategoryType = "photo" | "video" | "audio" | "business";

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
  const [stylePrompt, setStylePrompt] = useState("Романтичный Поп");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentResultUrl, setCurrentResultUrl] = useState<string | null>(null);

  const [modalMedia, setModalMedia] = useState<string | null>(null);

  // 1. Автоматическая загрузка истории из localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("neuro_artist_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Ошибка чтения истории из localStorage:", e);
      return [];
    }
  });

  // 2. Сохранение истории в localStorage при изменениях
  useEffect(() => {
    try {
      localStorage.setItem("neuro_artist_history", JSON.stringify(history));
    } catch (e) {
      console.error("Ошибка сохранения истории в localStorage:", e);
    }
  }, [history]);

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
    audio: [
      { id: "music", name: "Нейро-Музыка", cost: "2 кр.", desc: "Создание песни с вокалом по тексту" },
      { id: "tts", name: "Озвучка текста", cost: "1 кр.", desc: "Превращение текста в красивую речь" },
    ],
    business: [
      { id: "wb_card", name: "Карточка WB / Ozon", cost: "3 кр.", desc: "Продающий баннер товара" },
      { id: "fashion", name: "Одежда на модели", cost: "3 кр.", desc: "Примерка на человека" },
      { id: "food", name: "Фуд-съемка", cost: "3 кр.", desc: "Мишлен-подача и коллажи" },
      { id: "furniture", name: "Интерьер и мебель", cost: "3 кр.", desc: "3D-визуализация комнат" },
    ],
  };

  const currentModes = modesByCategory[activeCategory];

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const [rawFiles, setRawFiles] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setRawFiles((prev) => [...prev, ...filesArray]);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setRawFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isVideoUrl = (url: string) => url.includes(".mp4") || url.includes("video") || url.includes(".mov");
  const isAudioUrl = (url: string) => url.includes(".mp3") || url.includes(".wav") || url.includes("audio");

  const checkStatus = async (taskId: string, modeObjName: string, base64Images: string[]) => {
    try {
      const res = await axios.get(`${API_BASE}/task_status/${taskId}?user_id=${USER_ID}`, {
        headers: { "X-Bot-Token": BOT_TOKEN },
      });

      if (res.data.status === "ready" && res.data.result_url) {
        const finalUrl = res.data.result_url;
        setCurrentResultUrl(finalUrl);
        setIsGenerating(false);

        const newItem: HistoryItem = {
          id: taskId,
          modeName: modeObjName,
          prompt: prompt || "Генерация медиа",
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          images: base64Images.length > 0 ? base64Images : selectedImages,
          resultUrl: finalUrl,
        };
        setHistory((prev) => [newItem, ...prev]);
      } else if (res.data.success === false) {
        alert("Ошибка генерации: " + (res.data.error || "Неизвестная ошибка"));
        setIsGenerating(false);
      } else {
        setTimeout(() => checkStatus(taskId, modeObjName, base64Images), 3000);
      }
    } catch (e) {
      console.error("Ошибка проверки статуса:", e);
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && activeMode !== "gfpgan" && selectedImages.length === 0) return;

    setIsGenerating(true);
    setCurrentResultUrl(null);

    const currentModeObj = currentModes.find((m) => m.id === activeMode);
    const modeName = currentModeObj?.name || "Генерация";

    try {
      const base64Images = await Promise.all(rawFiles.map((file) => convertFileToBase64(file)));

      const payload: any = {
        user_id: USER_ID,
        model: activeMode,
        prompt: prompt,
        image_urls: base64Images,
      };

      if (activeMode === "music") {
        payload.lyrics = prompt;
        payload.style_prompt = stylePrompt;
      }

      const response = await axios.post(`${API_BASE}/generate`, payload, {
        headers: { "X-Bot-Token": BOT_TOKEN },
      });

      if (response.data.success && response.data.task_id) {
        checkStatus(response.data.task_id, modeName, base64Images);
      } else {
        alert("Не удалось создать задачу на сервере");
        setIsGenerating(false);
      }
    } catch (e) {
      console.error("Ошибка генерации:", e);
      alert("Ошибка подключения к бэкенду или недостаточно кредитов.");
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Удалить всю историю генераций?")) {
      setHistory([]);
      localStorage.removeItem("neuro_artist_history");
    }
  };

  // Удаление конкретного элемента из истории
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Модальное окно просмотра */}
      {modalMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setModalMedia(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            {isVideoUrl(modalMedia) ? (
              <video src={modalMedia} controls autoPlay className="max-w-full max-h-[90vh] rounded-2xl" />
            ) : (
              <img src={modalMedia} alt="Во весь экран" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
            )}
            <button
              onClick={() => setModalMedia(null)}
              className="absolute top-3 right-3 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Левая колонка — Панель управления */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Студия генерации
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Выберите категорию, режим и настройте параметры запроса.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
            {[
              { id: "photo", label: "Фото и Арт" },
              { id: "video", label: "Видео" },
              { id: "audio", label: "Музыка и Звук" },
              { id: "business", label: "Для Бизнеса" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as CategoryType);
                  setActiveMode(modesByCategory[cat.id as CategoryType][0].id);
                }}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
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

        {/* Форма запроса */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          
          {["vip_mix", "seadream_mix", "ultra_photo", "gfpgan", "i2v", "wb_card", "fashion", "food", "furniture"].includes(activeMode) && (
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
          )}

          {activeMode === "music" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                Выберите стиль музыки
              </label>
              <select
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Романтичный Поп" className="dark:bg-gray-900">🎹 Романтичный Поп</option>
                <option value="Эпичный Рок" className="dark:bg-gray-900">🎸 Эпичный Рок</option>
                <option value="Хип-Хоп и Рэп" className="dark:bg-gray-900">🎤 Хип-Хоп / Рэп</option>
                <option value="Расслабляющий Джаз" className="dark:bg-gray-900">🎷 Расслабляющий Джаз</option>
                <option value="Кинематографичный Оркестр" className="dark:bg-gray-900">🎻 Кинематографичный</option>
              </select>
            </div>
          )}

          {activeMode !== "gfpgan" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                {activeMode === "music" ? "Текст песни" : activeMode === "tts" ? "Текст для озвучки" : "Текстовое описание (Промпт)"}
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
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
          >
            {isGenerating ? "Нейросеть генерирует..." : "Запустить генерацию"}
          </button>
        </div>

        {/* Результат */}
        {currentResultUrl && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 text-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              Результат готов
            </h3>
            
            {isVideoUrl(currentResultUrl) ? (
              <video src={currentResultUrl} controls autoPlay loop className="mx-auto rounded-xl max-h-[500px] w-full object-contain" />
            ) : isAudioUrl(currentResultUrl) ? (
              <audio src={currentResultUrl} controls className="w-full mx-auto mt-2" />
            ) : (
              <img
                src={currentResultUrl}
                alt="Результат"
                onClick={() => setModalMedia(currentResultUrl)}
                className="mx-auto rounded-xl max-h-[500px] object-contain cursor-pointer hover:opacity-95 transition"
              />
            )}

            <div className="mt-4">
              <a
                href={currentResultUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm"
              >
                <span>Скачать файл</span>
                <span>📥</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Правая колонка — История */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              История генераций
            </h3>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 transition"
              >
                Очистить всё
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-gray-400">История пока пуста. Запустите первую генерацию!</p>
          ) : (
            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-3 relative group"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {item.modeName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{item.date}</span>
                      {/* Кнопка точечного удаления элемента */}
                      <button
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        className="text-gray-400 hover:text-red-500 font-bold transition px-1"
                        title="Удалить из истории"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {item.prompt}
                  </p>

                  {item.resultUrl && (
                    <div className="pt-2">
                      {isVideoUrl(item.resultUrl) ? (
                        <video src={item.resultUrl} controls className="w-full h-48 object-cover rounded-xl" />
                      ) : isAudioUrl(item.resultUrl) ? (
                        <audio src={item.resultUrl} controls className="w-full" />
                      ) : (
                        <img
                          src={item.resultUrl}
                          alt="Результат"
                          onClick={() => setModalMedia(item.resultUrl!)}
                          className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer"
                        />
                      )}
                      
                      <a
                        href={item.resultUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="inline-block mt-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 underline"
                      >
                        Скачать файл 📥
                      </a>
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