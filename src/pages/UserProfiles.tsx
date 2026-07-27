import React, { useState, useEffect } from "react";

const API_BASE = "/api";

type HistoryItem = {
  id: string;
  modeName: string;
  prompt: string;
  date: string;
  images: string[];
  resultUrl?: string;
};

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number } | null>(null);
  const [inputUserId, setInputUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Вкладка истории: "photo" | "video" | "audio"
  const [activeTab, setActiveTab] = useState<"photo" | "video" | "audio">("photo");

  // История генераций из localStorage
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
    }

    // Загрузка истории генераций
    try {
      const savedHistory = localStorage.getItem("neuro_artist_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Ошибка чтения истории:", e);
    }
  }, []);

  const fetchUserData = async (userId: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setUser({ id: userId, balance: data.balance });
        localStorage.setItem("user_id", userId.toString());
      } else {
        setError("Не удалось загрузить данные пользователя.");
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка соединения с сервером.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputUserId.replace(/\D/g, "");
    if (cleanId) {
      fetchUserData(parseInt(cleanId));
    } else {
      setError("Введите корректный цифровой VK ID");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUser(null);
    setInputUserId("");
  };

  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("neuro_artist_history", JSON.stringify(updated));
  };

  // Вспомогательные проверки типа медиа
  const isVideoUrl = (url: string) => url.includes(".mp4") || url.includes("video") || url.includes(".mov");
  const isAudioUrl = (url: string) => url.includes(".mp3") || url.includes(".wav") || url.includes("audio");

  // Фильтрация истории по выбранной вкладке
  const filteredHistory = history.filter((item) => {
    if (!item.resultUrl) return false;
    if (activeTab === "video") return isVideoUrl(item.resultUrl);
    if (activeTab === "audio") return isAudioUrl(item.resultUrl);
    // Для фото — всё, что не видео и не аудио
    return !isVideoUrl(item.resultUrl) && !isAudioUrl(item.resultUrl);
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* КАРТОЧКА ПРОФИЛЯИ БАЛАНСА */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Личный кабинет
        </h2>

        {user ? (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex justify-between items-center max-w-lg mx-auto">
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase font-semibold">Ваш профиль</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">id{user.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Баланс</p>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {user.balance} <span className="text-sm font-normal">кредитов</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              <a
                href={`/pay.html?app=artist&user_id=${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
              >
                💎 Пополнить баланс
              </a>

              <a
                href="/"
                className="w-full py-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
              >
                🏠 На главную
              </a>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:underline pt-2"
            >
              Выйти из аккаунта
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 py-2 max-w-md mx-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Введите ваш VK ID для входа:
            </p>
            <input
              type="text"
              placeholder="Например: 233876992"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none text-center text-lg font-mono"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md"
            >
              {loading ? "Загрузка..." : "Войти в кабинет"}
            </button>
          </form>
        )}
      </div>

      {/* МОЙ АРХИВ ГЕНЕРАЦИЙ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              📂 Мой Архив Генераций
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Ваши сохраненные медиафайлы</p>
          </div>

          {/* Переключатель вкладок */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("photo")}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "photo"
                  ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              🖼 Картинки ({history.filter((i) => i.resultUrl && !isVideoUrl(i.resultUrl) && !isAudioUrl(i.resultUrl)).length})
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "video"
                  ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              🎬 Видео ({history.filter((i) => i.resultUrl && isVideoUrl(i.resultUrl)).length})
            </button>
            <button
              onClick={() => setActiveTab("audio")}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "audio"
                  ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              🎵 Музыка ({history.filter((i) => i.resultUrl && isAudioUrl(i.resultUrl)).length})
            </button>
          </div>
        </div>

        {/* Контент архива */}
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            <p className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">
              В этой категории пока ничего нет
            </p>
            <p className="text-xs">
              Сгенерируйте {activeTab === "photo" ? "картинку" : activeTab === "video" ? "видеоклип" : "трек"}, и результат появится здесь.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-3 flex flex-col justify-between space-y-3 relative group"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {item.modeName}
                    </span>
                    <span className="text-gray-400 text-[10px]">{item.date}</span>
                  </div>

                  {item.resultUrl && (
                    <div className="mb-2">
                      {isVideoUrl(item.resultUrl) ? (
                        <video src={item.resultUrl} controls className="w-full h-44 object-cover rounded-lg" />
                      ) : isAudioUrl(item.resultUrl) ? (
                        <div className="py-4 bg-white dark:bg-gray-900 rounded-lg p-2 border border-gray-100 dark:border-gray-800">
                          <audio src={item.resultUrl} controls className="w-full" />
                        </div>
                      ) : (
                        <img
                          src={item.resultUrl}
                          alt="Результат"
                          className="w-full h-44 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 italic">
                    "{item.prompt}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                  <a
                    href={item.resultUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Скачать</span>
                    <span>📥</span>
                  </a>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 font-medium transition"
                    title="Удалить файл"
                  >
                    Удалить ✕
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