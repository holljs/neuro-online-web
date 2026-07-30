import React, { useState, useEffect } from "react";

type HistoryItem = {
  id: string;
  modeName: string;
  prompt: string;
  date: string;
  images?: string[];
  resultUrl?: string;
  url?: string;
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"photo" | "video" | "audio">("photo");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  // 🚀 Состояния для серверной пагинации
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const LIMIT = 15;

  // Функция получения user_id
  const getUserId = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get("user_id") || urlParams.get("vk_user_id");
    if (idFromUrl) return idFromUrl;
    
    return localStorage.getItem("vk_user_id") || localStorage.getItem("user_id") || "233876992";
  };

  // 📡 Загрузка истории с сервера бэкенда
  const fetchServerHistory = async (isInitial = false) => {
    const userId = getUserId();
    if (!userId || loading) return;

    setLoading(true);
    const currentOffset = isInitial ? 0 : offset;

    try {
      const res = await fetch(
        `https://neuro-master.online/api/history/${userId}?limit=${LIMIT}&offset=${currentOffset}&_t=${Date.now()}`
      );
      const data = await res.json();

      if (data.success && data.items) {
        const formattedItems: HistoryItem[] = data.items.map((item: any) => ({
          id: String(item.id),
          modeName: item.model || "Генерация",
          prompt: item.prompt || "Без текста",
          date: item.created_at ? new Date(item.created_at).toLocaleDateString("ru-RU") : "Недавно",
          resultUrl: item.result_url
        }));

        if (isInitial) {
          setHistory(formattedItems);
          setOffset(formattedItems.length);
        } else {
          setHistory((prev) => [...prev, ...formattedItems]);
          setOffset((prev) => prev + formattedItems.length);
        }

        // Кнопка показывается, если сервер вернул ровно LIMIT элементов (значит, есть ещё)
        setHasMore(data.has_more || formattedItems.length === LIMIT);
      }
    } catch (e) {
      console.error("Ошибка загрузки истории с сервера:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerHistory(true);
  }, []);

  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isVideoUrl = (url: string) => url.includes(".mp4") || url.includes("video") || url.includes(".mov");
  const isAudioUrl = (url: string) => url.includes(".mp3") || url.includes(".wav") || url.includes("audio");

  const getMediaUrl = (item: HistoryItem): string => {
    const rawUrl = item.resultUrl || item.url || (item.images && item.images[0]) || "";
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http") || rawUrl.startsWith("data:")) return rawUrl;
    return `https://neuro-master.online${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  };

  const handleDownload = async (url: string, filename: string, isVideo: boolean, isAudio: boolean) => {
    if (!url) return;
    try {
      let ext = ".png";
      if (isVideo) ext = ".mp4";
      if (isAudio) ext = ".mp3";

      const finalName = filename.replace(/\.[^/.]+$/, "") + ext;

      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response failed");
      const blob = await response.blob();

      if (blob.size < 100) {
        window.open(url, "_blank");
        return;
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  // Фильтрация истории
  const filteredHistory = history.filter((item) => {
    // Если картинка битая/незагрузившаяся — убираем её из отображения
    if (failedIds[item.id]) return false;

    const url = getMediaUrl(item);
    if (!url) return false;

    const matchesSearch =
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modeName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "video") return isVideoUrl(url);
    if (activeTab === "audio") return isAudioUrl(url);
    return !isVideoUrl(url) && !isAudioUrl(url);
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        
        {/* Шапка истории */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              История генераций
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Ваша галерея медиафайлов и промптов
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

        {/* Памятка о сроках хранения */}
        <div className="my-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <span className="text-lg">💡</span>
          <div>
            <span className="font-bold block mb-0.5">Правила хранения материалов:</span>
            <span>Изображения хранятся в галерее <b>30 дней</b>, а Видео и Музыка — <b>7 дней</b>. Пожалуйста, сохраняйте важные файлы на своё устройство заранее!</span>
          </div>
        </div>

        {/* Переключатель категорий */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl my-6">
          <button
            onClick={() => setActiveTab("photo")}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === "photo"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Изображения ({history.filter((i) => {
              const u = getMediaUrl(i);
              return u && !isVideoUrl(u) && !isAudioUrl(u) && !failedIds[i.id];
            }).length})
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === "video"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Видео ({history.filter((i) => {
              const u = getMediaUrl(i);
              return u && isVideoUrl(u) && !failedIds[i.id];
            }).length})
          </button>

          <button
            onClick={() => setActiveTab("audio")}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === "audio"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Музыка ({history.filter((i) => {
              const u = getMediaUrl(i);
              return u && isAudioUrl(u) && !failedIds[i.id];
            }).length})
          </button>
        </div>

        {/* Сетка карточек */}
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            <p className="font-medium text-gray-600 dark:text-gray-300 text-sm mb-1">
              {loading ? "Загружаем историю..." : "Ничего не найдено"}
            </p>
            <p>
              {searchQuery ? "Попробуйте изменить поисковый запрос." : "В этой категории пока нет генераций."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHistory.map((item) => {
                const mediaUrl = getMediaUrl(item);
                const isVideo = isVideoUrl(mediaUrl);
                const isAudio = isAudioUrl(mediaUrl);
                const isExpanded = !!expandedIds[item.id];
                const isLongPrompt = item.prompt.length > 80;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-3.5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.modeName}
                        </span>
                        <span className="text-gray-400 text-[10px] font-mono">{item.date}</span>
                      </div>

                      {mediaUrl && (
                        <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          {isVideo ? (
                            <video
                              src={mediaUrl}
                              controls
                              className="w-full h-full object-cover"
                              onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                            />
                          ) : isAudio ? (
                            <div className="w-full p-3 bg-white dark:bg-gray-900">
                              <audio
                                src={mediaUrl}
                                controls
                                className="w-full"
                                onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                              />
                            </div>
                          ) : (
                            <img
                              src={mediaUrl}
                              alt="Результат"
                              className="w-full h-full object-cover rounded-lg"
                              onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                            />
                          )}
                        </div>
                      )}

                      <div className="bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200/70 dark:border-gray-800 space-y-1">
                        <p className={`text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic ${!isExpanded ? "line-clamp-2" : ""}`}>
                          "{item.prompt}"
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          {isLongPrompt && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-semibold cursor-pointer"
                            >
                              {isExpanded ? "Свернуть ↑" : "Развернуть ↓"}
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyPrompt(item.prompt, item.id)}
                            className="ml-auto font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            {copiedId === item.id ? "✓ Скопировано" : "📋 Скопировать"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                      <button
                        onClick={() => handleDownload(mediaUrl, `neuro_master_${item.id}`, isVideo, isAudio)}
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Скачать {isVideo ? "видео" : isAudio ? "аудио" : "файл"}
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 font-medium transition cursor-pointer"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔥 КНОПКА «ПОКАЗАТЬ ЕЩЁ» 🔥 */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => fetchServerHistory(false)}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Загрузка..." : "Показать ещё 15 штук"}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}