import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";

const API_BASE = "/api";

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number; name?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Инициализируем VK Bridge при загрузке
  useEffect(() => {
    bridge.send("VKWebAppInit");
    
    // Проверяем, заходил ли юзер ранее
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

  // НАСТОЯЩИЙ ВХОД ЧЕРЕЗ VK (без ввода паролей и ID)
  const handleVkAuth = async () => {
    setLoading(true);
    try {
      // Запрашиваем данные у ВКонтакте
      const vkUser = await bridge.send("VKWebAppGetUserInfo");
      if (vkUser && vkUser.id) {
        await fetchUserData(vkUser.id);
      }
    } catch (error) {
      console.error("Ошибка авторизации VK:", error);
      alert("Не удалось войти через ВКонтакте.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Личный кабинет
        </h2>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex justify-between items-center">
              <span className="text-sm font-bold">ID: {user.id}</span>
              <span className="text-xl font-black text-blue-600">{user.balance} кредитов</span>
            </div>
            <button
              onClick={() => { localStorage.removeItem("user_id"); setUser(null); }}
              className="px-4 py-2 border rounded-xl text-sm"
            >
              Выйти
            </button>
          </div>
        ) : (
          <button
            onClick={handleVkAuth}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            {loading ? "Авторизация..." : "Войти через VK ID"}
          </button>
        )}
      </div>
    </div>
  );
}