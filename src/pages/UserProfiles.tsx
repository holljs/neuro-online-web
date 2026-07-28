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

  // Основные вкладки Личного кабинета
  const [activeMenu, setActiveMenu] = useState<"account" | "price" | "help" | "history">("account");

  // Состояние архива
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
      const resArtist = await fetch(`${API_BASE}/user/${userId}`);
      const dataArtist = await resArtist.json();

      let energyVal = 0;
      try {
        const resBro = await fetch(`${API_BASE}/bro/user/${userId}`);
        const dataBro = await resBro.json();
        if (dataBro.success) energyVal = dataBro.energy || 0;
      } catch (e) {
        console.error("Ошибка загрузки энергии:", e);
      }

      if (dataArtist.success) {
        setUser({
          id: userId,
          balance: dataArtist.balance || 0,
          energy: energyVal,
        });
        localStorage.setItem("user_id", userId.toString());
      } else {
        setError("Не удалось загрузить данные аккаунта.");
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        
        {/* Шапка ЛК */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Личный кабинет
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Управление сервисами, тарифами и архивом
            </p>
          </div>

          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold transition"
          >
            ← На главную
          </a>
        </div>

        {/* Меню-переключатель (Под заголовком) */}
        <div className="flex flex-wrap gap-2 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveMenu("account")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "account"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Аккаунт и Баланс
          </button>

          <button
            onClick={() => setActiveMenu("price")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "price"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Прайс
          </button>

          <button
            onClick={() => setActiveMenu("help")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "help"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Справка
          </button>

          <button
            onClick={() => setActiveMenu("history")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "history"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            История генераций ({history.length})
          </button>
        </div>

        {/* СОДЕРЖИМОЕ ВКЛАДОК */}

        {/* 1. ВКЛАДКА: АККАУНТ И БАЛАНС */}
        {activeMenu === "account" && (
          <div className="pt-6 space-y-6">
            {user ? (
              <>
                <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Идентификатор аккаунта
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white text-base">
                    ID: {user.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Нейро-Художник */}
                  <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                          Нейро-Художник
                        </h2>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                          Арт / Видео
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Генерация изображений, анимация и клипы
                      </p>

                      <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {user.balance}{" "}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">кредитов</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`/pay.html?app=artist&user_id=${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition shadow-sm block"
                      >
                        Пополнить кредиты
                      </a>

                      <a
                        href="/neuro-artist"
                        className="w-full py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-xs text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition block"
                      >
                        Перейти к Художнику →
                      </a>
                    </div>
                  </div>

                  {/* Нейро-Бро */}
                  <div className="p-5 rounded-2xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-950/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                          Нейро-Бро
                        </h2>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded">
                          Чат / ИИ
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Интеллектуальный чат, анализ файлов и кода
                      </p>

                      <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {user.energy}{" "}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">энергии</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`/pay.html?app=bro&user_id=${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition shadow-sm block"
                      >
                        Пополнить энергию
                      </a>

                      <a
                        href="/neuro-bro"
                        className="w-full py-2 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-semibold text-xs text-center hover:bg-purple-50 dark:hover:bg-purple-900/20 transition block"
                      >
                        Перейти к Нейро-Бро →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 text-xs">
                  <a
                    href="https://vk.me/club191367447"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition font-medium"
                  >
                    Служба поддержки
                  </a>

                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 font-medium transition"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4 py-4 max-w-sm mx-auto text-center">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Введите ваш VK ID для авторизации:
                </p>
                <input
                  type="text"
                  placeholder="Например: 233876992"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-center text-base font-mono focus:outline-none focus:border-blue-500"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm"
                >
                  {loading ? "Загрузка..." : "Войти в кабинет"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 2. ВКЛАДКА: ПРАЙС (СПИСАНИЯ) */}
        {activeMenu === "price" && (
          <div className="pt-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Стоимость генераций и моделей
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
                <p className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Нейро-Художник (Кредиты)
                </p>
                <ul className="space-y-1.5 pt-1">
                  <li>• <strong>Нейро-Художник:</strong> 1 кредит / арт</li>
                  <li>• <strong>VIP-Микс / Мега-Микс / Бизнес:</strong> 3 кредита</li>
                  <li>• <strong>Ультра-Фото:</strong> 5 кредитов</li>
                  <li>• <strong>ИИ-Режиссер (Видео 5 сек):</strong> 30 кредитов</li>
                  <li>• <strong>ИИ-Режиссер (Видео 10 сек):</strong> 50 кредитов</li>
                  <li>• <strong>Нейро-Музыка:</strong> 2 кредита / трек</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2">
                <p className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  Нейро-Бро (Энергия)
                </p>
                <ul className="space-y-1.5 pt-1">
                  <li>• <strong>Быстрая модель (GPT-4o Mini):</strong> 3 энергии / ответ</li>
                  <li>• <strong>Думающая (Gemini Flash + Фото):</strong> 10 энергии / ответ</li>
                  <li>• <strong>Про-Кодер (Gemini 3.1 Pro + Код):</strong> 50 энергии / ответ</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. ВКЛАДКА: СПРАВКА */}
        {activeMenu === "help" && (
          <div className="pt-6 space-y-4 text-xs text-gray-600 dark:text-gray-300">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Справка и частые вопросы
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">
                  Как пополнить баланс?
                </p>
                <p>
                  Выберите сервис («Нейро-Художник» или «Нейро-Бро») и нажмите кнопку «Пополнить». Оплата производится через форму VK Pay или сторонние платежные методы.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">
                  Где сохраняются генерации?
                </p>
                <p>
                  Все созданные изображения, видеоклипы и треки сохраняются во вкладке «История генераций».
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white mb-1">
                  Нужна помощь с аккаунтом?
                </p>
                <p>
                  Напишите в нашу{" "}
                  <a
                    href="https://vk.me/club191367447"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-semibold underline"
                  >
                    службу поддержки ВКонтакте
                  </a>
                  , указав ваш VK ID.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. ВКЛАДКА: ИСТОРИЯ ГЕНЕРАЦИЙ */}
        {activeMenu === "history" && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Архив генераций
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">История созданных медиафайлов</p>
              </div>

              <div className="w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Поиск по промптам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-3.5 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Вкладки типа медиа */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => setActiveTab("photo")}
                className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === "photo"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Картинки ({history.filter((i) => i.resultUrl && !isVideoUrl(i.resultUrl) && !isAudioUrl(i.resultUrl)).length})
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === "video"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Видео ({history.filter((i) => i.resultUrl && isVideoUrl(i.resultUrl)).length})
              </button>
              <button
                onClick={() => setActiveTab("audio")}
                className={`flex-1 px-4 py-2 text-xs font-semibold rounded-lg transition ${
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
              <div className="py-12 text-center text-gray-400 text-xs">
                <p className="font-medium text-gray-600 dark:text-gray-300 text-sm mb-1">
                  Ничего не найдено
                </p>
                <p>
                  {searchQuery ? "Попробуйте изменить запрос." : "В этой категории пока нет генераций."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-3 flex flex-col justify-between space-y-3"
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

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic">
                        "{item.prompt}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs">
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
        )}

      </div>
    </div>
  );
}