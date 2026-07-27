import React, { useState, useEffect } from "react";
import axios from "axios";

// Объявляем глобальный объект VKID, который загрузился из index.html
declare const VKID: any;

const API_BASE = "/api";

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number } | null>(null);

  // При загрузке страницы проверяем, есть ли уже вошедший юзер
  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
    }
  }, []);

  // Функция загрузки профиля с сервера
  const fetchUserData = async (userId: number) => {
    try {
      const res = await axios.get(`${API_BASE}/user/${userId}`);
      if (res.data.success) {
        setUser({ id: userId, balance: res.data.balance });
        localStorage.setItem("user_id", userId.toString());
      }
    } catch (e) {
      console.error("Ошибка авторизации:", e);
    }
  };

  // 🔥 КЛИК ПО КНОПКЕ "ВОЙТИ ЧЕРЕЗ VK ID"
  const handleVkLogin = () => {
    if (typeof VKID !== "undefined") {
      // Открываем официальное окно входа ВКонтакте
      VKID.Auth.login({
        appId: 54451681, // ID твоего приложения VK
        redirectUrl: "https://neuro-master.online/signin",
      });
    } else {
      alert("Служба VK ID ещё загружается, попробуйте через секунду!");
    }
  };

  // Выход из профиля
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUser(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Личный кабинет
        </h2>

        {user ? (
          /* --- ЕСЛИ ЮЗЕР УЖЕ ВОШЕЛ --- */
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

            <div className="flex gap-3">
              <a
                href={`/pay.html?app=artist&user_id=${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md"
              >
                💎 Пополнить баланс
              </a>
              <button
                onClick={handleLogout}
                className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Выйти
              </button>
            </div>
          </div>
        ) : (
          /* --- КНОПКА ВХОДА ДЛЯ ГОСТЯ --- */
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Войдите с помощью аккаунта ВКонтакте, чтобы видеть баланс с любого устройства.
            </p>

            <button
              onClick={handleVkLogin}
              className="w-full py-4 rounded-xl bg-[#0077FF] text-white font-bold text-base hover:bg-[#0066EA] transition shadow-lg flex items-center justify-center gap-2"
            >
              Войти с VK ID
            </button>
          </div>
        )}
      </div>
    </div>
  );
}