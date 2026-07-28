import React, { useState, useEffect } from "react";

type HistoryItem = {
  id: string;
  modeName: string;
  prompt: string;
  date: string;
  images: string[];
  resultUrl?: string;
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"photo" | "video" | "audio">("photo");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("neuro_artist_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Ошибка чтения истории:", e);
    }
  }, []);

  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("neuro_artist_history", JSON.stringify(updated));
  };

  const isVideoUrl = (url: string) => url.includes(".mp4") || url.includes("video") || url.includes(".mov");
  const isAudioUrl = (url: string) => url.includes(".mp3") || url.includes(".wav") || url.includes("audio");

  const filteredHistory = history.filter((item) => {
    if (!item.resultUrl) return false;

    const matchesSearch =
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modeName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "video") return isVideoUrl(item.resultUrl);
    if (activeTab === "audio") return isAudioUrl(item.resultUrl);
    return !isVideoUrl(item.resultUrl) && !isAudioUrl(item.resultUrl);
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        
        {/* Шапка */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              История генераций
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Все ваши созданные изображения, видеоклипы и треки
            </p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Поиск по промптам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Переключатель категорий */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl my-6">
          <button
            onClick={() => setActiveTab("photo")}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "photo"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Изображения ({history.filter((i) => i.resultUrl && !isVideoUrl(i.resultUrl) && !isAudioUrl(i.resultUrl)).length})
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "video"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Видео ({history.filter((i) => i.resultUrl && isVideoUrl(i.resultUrl)).length})
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "audio"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Музыка ({history.filter((i) => i.resultUrl && isAudioUrl(i.resultUrl)).length})
          </button>
        </div>

        {/* Сетка результатов */}
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            <p className="font-medium text-gray-600 dark:text-gray-300 text-sm mb-1">
              Ничего не найдено
            </p>
            <p>
              {searchQuery ? "Попробуйте изменить поисковый запрос." : "В этой категории пока нет генераций."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-3.5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {item.modeName}
                    </span>
                    <span className="text-gray-400 text-[10px]">{item.date}</span>
                  </div>

                  {item.resultUrl && (
                    <div className="mb-2">
                      {isVideoUrl(item.resultUrl) ? (
                        <video src={item.resultUrl} controls className="w-full h-48 object-cover rounded-lg" />
                      ) : isAudioUrl(item.resultUrl) ? (
                        <div className="py-6 bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                          <audio src={item.resultUrl} controls className="w-full" />
                        </div>
                      ) : (
                        <img
                          src={item.resultUrl}
                          alt="Результат"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 italic">
                    "{item.prompt}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                  <a
                    href={item.resultUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Скачать
                  </a>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 font-medium transition"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}