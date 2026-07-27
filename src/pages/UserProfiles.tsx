import React, { useState, useEffect } from "react";

const API_BASE = "/api";

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number } | null>(null);
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
    const cleanId = inputUserId.replace(/\D/g, ""); // Оставляем только цифры
    if (cleanId) {
      fetchUserData(parseInt(cleanId));
    } else {
      setError("Введите корректный цифровой VK ID (например, 233876992)");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUser(null);
    setInputUserId("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Личный кабинет
        </h2>

        {user ? (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex justify-between items-center">
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

            <div className="grid grid-cols-1 gap-3">
              <a
                href={`/pay.html?app=artist&user_id=${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
              >
                💎 Пополнить баланс
              </a>

              <a
                href="/"
                className="w-full py-3.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold text-sm hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2"
              >
                🎨 Создавать картинки и видео
              </a>

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        ) : (
          /* Форма входа по VK ID */
          <form onSubmit={handleLogin} className="space-y-4 py-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Введите ваш VK ID для входа в личный кабинет:
            </p>
            <input
              type="text"
              placeholder="Например: 233876992"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
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
    </div>
  );
}