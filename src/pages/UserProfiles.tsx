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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Личный кабинет
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Управление балансом и параметрами вашего профиля
        </p>

        {user ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                Идентификатор аккаунта
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                ID: {user.id}
              </span>
            </div>

            {/* Карточки сервисов */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Нейро-Художник */}
              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                      Нейро-Художник
                    </h2>
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider bg-gray-200/60 dark:bg-gray-700 px-2 py-0.5 rounded">
                      Арт / Видео
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Генерация изображений, анимация и клипы
                  </p>

                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.balance}{" "}
                    <span className="text-xs font-normal text-gray-500">кредитов</span>
                  </div>
                </div>

                <a
                  href={`/pay.html?app=artist&user_id=${user.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold text-xs text-center hover:opacity-90 transition shadow-sm"
                >
                  Пополнить кредиты
                </a>
              </div>

              {/* Нейро-Бро */}
              <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                      Нейро-Бро
                    </h2>
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider bg-gray-200/60 dark:bg-gray-700 px-2 py-0.5 rounded">
                      Чат / ИИ
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Интеллектуальный чат, анализ файлов и кода
                  </p>

                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.energy}{" "}
                    <span className="text-xs font-normal text-gray-500">энергии</span>
                  </div>
                </div>

                <a
                  href={`/pay.html?app=bro&user_id=${user.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold text-xs text-center hover:opacity-90 transition shadow-sm"
                >
                  Пополнить энергию
                </a>
              </div>

            </div>

            <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
              <a
                href="https://vk.me/club191367447"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
              >
                Служба поддержки
              </a>

              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 py-2 max-w-sm mx-auto">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
              Введите ваш VK ID для авторизации:
            </label>
            <input
              type="text"
              placeholder="Например: 233876992"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-center text-base font-mono focus:outline-none focus:border-gray-500"
            />
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold text-xs hover:opacity-90 transition shadow-sm"
            >
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}