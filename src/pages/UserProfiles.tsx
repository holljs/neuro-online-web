import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "/api";

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number } | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
    }
  }, []);

  const fetchUserData = async (userId: number) => {
    try {
      const res = await axios.get(`${API_BASE}/user/${userId}`);
      if (res.data.success) {
        setUser({ id: userId, balance: res.data.balance });
        localStorage.setItem("user_id", userId.toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUser(null);
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

            {/* --- КНОПКИ ДЕЙСТВИЙ И ВОЗВРАТА --- */}
            <div className="grid grid-cols-1 gap-3">
              <a
                href={`/pay.html?app=artist&user_id=${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
              >
                💎 Пополнить баланс
              </a>

              {/* Кнопка возврата на главную */}
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
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Укажите ваш ID для входа</p>
          </div>
        )}
      </div>
    </div>
  );
}