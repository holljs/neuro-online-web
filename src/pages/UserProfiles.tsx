import React, { useState, useEffect } from "react";

const API_BASE = "/api";

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number; energy: number } | null>(null);
  const [inputUserId, setInputUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
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

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        
        {/* Кнопка "На главную" в шапке ЛК */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Личный кабинет
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Управление балансом и сервисами
            </p>
          </div>

          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold transition"
          >
            ← На главную
          </a>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                Идентификатор аккаунта
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white text-base">
                ID: {user.id}
              </span>
            </div>

            {/* Карточки сервисов */}
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

            {/* Низ карточки: Поддержка и Выход */}
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
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 py-2 max-w-sm mx-auto text-center">
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
    </div>
  );
}