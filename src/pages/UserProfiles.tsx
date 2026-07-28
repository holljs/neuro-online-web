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
  const [user, setUser] = useState<{ id: number; balance: number; energy: number } | null>(null);
  const [inputUserId, setInputUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"photo" | "video" | "audio">("photo");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
    }

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
      // Запрос к основному бэку (Художник)
      const resArtist = await fetch(`${API_BASE}/user/${userId}`);
      const dataArtist = await resArtist.json();

      // Запрос к бэку НейроБро (Энергия)
      let energyVal = 0;
      try {
        const resBro = await fetch(`${API_BASE}/bro/user/${userId}`);
        const dataBro = await resBro.json();
        if (dataBro.success) energyVal = dataBro.energy || 0;
      } catch (e) {
        console.log("Не удалось загрузить энергию Бро:", e);
      }

      if (dataArtist.success) {
        setUser({
          id: userId,
          balance: dataArtist.balance || 0,
          energy: energyVal,
        });
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      {/* КАРТОЧКА ПРОФИЛЯ И БАЛАНСОВ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Личный кабинет
        </h2>

        {user ? (
          <div className="space-y-6">
            <p className="text-center text-sm font-semibold text-gray-500">
              Ваш аккаунт: <span className="text-gray-900 dark:text-white font-bold text-base">id{user.id}</span>
            </p>

            {/* РАЗДЕЛЕНИЕ НА 2 СЕРВИСА */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 🎨 Нейро-Художник */}
              <div className="p-5 bg-blue-50/60 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/60 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white text-base">🎨 Нейро-Художник</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                      Арт / Видео
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Генерация изображений, анимация и клипы</p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{user.balance}</span>
                    <span className="text-xs font-semibold text-gray-500">кредитов</span>
                  </div>
                </div>

                <a
                  href={`/pay.html?app=artist&user_id=${user.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-md text-center"
                >
                  💎 Пополнить кредиты
                </a>
              </div>

              {/* 🤖 Нейро-Бро */}
              <div className="p-5 bg-purple-50/60 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/60 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white text-base">🤖 Нейро-Бро</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
                      Чат / ИИ
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Умный чат-помощник, анализ фото и кода</p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-purple-600 dark:text-purple-400">{user.energy}</span>
                    <span className="text-xs font-semibold text-gray-500">энергии</span>
                  </div>
                </div>

                <a
                  href={`/pay.html?app=bro&user_id=${user.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition shadow-md text-center"
                >
                  ⚡ Пополнить энергию
                </a>
              </div>

            </div>

            <div className="text-center pt-2">
              <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">
                Выйти из аккаунта
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 py-2 max-w-md mx-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Введите ваш VK ID для входа:</p>
            <input
              type="text"
              placeholder="Например: 233876992"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg font-mono focus:outline-none"
            />
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
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

      {/* СПРАВКА И СТОИМОСТЬ МОДЕЛЕЙ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Справка по списыванию ресурсов
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 dark:text-gray-300">
          <div>
            <p className="font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">🎨 Нейро-Художник (Кредиты):</p>
            <ul className="space-y-1.5 list-disc pl-4">
              <li><strong className="text-gray-800 dark:text-gray-200">Нейро-Художник:</strong> 1 кредит / арт</li>
              <li><strong className="text-gray-800 dark:text-gray-200">VIP / Мега-Микс / Бизнес:</strong> 3 кредита</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Ультра-Фото:</strong> 5 кредитов</li>
              <li><strong className="text-gray-800 dark:text-gray-200">ИИ-Режиссер (Видео 5 сек):</strong> 30 кредитов</li>
              <li><strong className="text-gray-800 dark:text-gray-200">ИИ-Режиссер (Видео 10 сек):</strong> 50 кредитов</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">🤖 Нейро-Бро (Энергия):</p>
            <ul className="space-y-1.5 list-disc pl-4">
              <li><strong className="text-gray-800 dark:text-gray-200">Быстрая модель (GPT-4o Mini):</strong> 3 энергии / ответ</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Думающая (Gemini Flash + Фото):</strong> 10 энергии / ответ</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Про-Кодер (Gemini 3.1 Pro + Код):</strong> 50 энергии / ответ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* МОЙ АРХИВ С ПОИСКОМ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              📂 Мой Архив Генераций
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Все созданные вами медиафайлы</p>
          </div>

          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="🔍 Поиск по промптам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("photo")}
            className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "photo"
                ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🖼 Картинки ({history.filter((i) => i.resultUrl && !isVideoUrl(i.resultUrl) && !isAudioUrl(i.resultUrl)).length})
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "video"
                ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🎬 Видео ({history.filter((i) => i.resultUrl && isVideoUrl(i.resultUrl)).length})
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "audio"
                ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🎵 Музыка ({history.filter((i) => i.resultUrl && isAudioUrl(i.resultUrl)).length})
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            <p className="text-base font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Ничего не найдено
            </p>
            <p className="text-xs">
              {searchQuery ? "Попробуйте изменить поисковый запрос." : "В этой категории пока нет генераций."}
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
                    <span className="font-bold text-blue-600 dark:text-blue-400">{item.modeName}</span>
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