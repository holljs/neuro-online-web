import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "/api";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  
  // Данные авторизованного юзера
  const [user, setUser] = useState<{ id: number; email?: string; balance: number } | null>(null);

  // 1. При загрузке страницы проверяем, залогинен ли юзер
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUserId = localStorage.getItem("user_id");

    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
    }
  }, []);

  // Получение баланса и данных профиля
  const fetchUserData = async (userId: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get(`${API_BASE}/user/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.success) {
        setUser({
          id: userId,
          email: localStorage.getItem("user_email") || undefined,
          balance: res.data.balance,
        });
      }
    } catch (e) {
      console.error("Ошибка загрузки профиля:", e);
    }
  };

  // 2. Отправка 6-значного кода на почту
  const handleSendCode = async () => {
    if (!email.includes("@")) {
      alert("Введите корректный E-mail!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/send-code`, { email });
      if (res.data.success) {
        setStep("code");
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Ошибка отправки письма");
    } finally {
      setLoading(false);
    }
  };

  // 3. Проверка кода и вход
  const handleVerifyCode = async () => {
    if (code.length < 6) {
      alert("Введите 6-значный код из письма");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-code`, { email, code });
      if (res.data.success) {
        // Сохраняем токен и ID в браузере
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user_id", res.data.user_id.toString());
        localStorage.setItem("user_email", res.data.email);

        setUser({
          id: res.data.user_id,
          email: res.data.email,
          balance: 0,
        });

        // Обновляем баланс
        fetchUserData(res.data.user_id);
      }
    } catch (e: any) {
      alert(e.response?.data?.detail || "Неверный код!");
    } finally {
      setLoading(false);
    }
  };

  // Выход из профиля
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setUser(null);
    setStep("email");
    setEmail("");
    setCode("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Личный кабинет
        </h2>

        {user ? (
          /* --- АВТОРИЗОВАННЫЙ ПРОФИЛЬ --- */
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Ваш профиль</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {user.email || `ID: ${user.id}`}
                </p>
                <p className="text-xs text-gray-400 mt-1">Цифровой ID: {user.id}</p>
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
                className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-md"
              >
                💎 Пополнить баланс
              </a>
              <button
                onClick={handleLogout}
                className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Выйти
              </button>
            </div>
          </div>
        ) : (
          /* --- ФОРМА ВХОДА / РЕГИСТРАЦИИ --- */
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Войдите по E-mail или через VK, чтобы сохранять свои генерации и пополнять баланс.
            </p>

            {step === "email" ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Электронная почта
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@rambler.ru"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                >
                  {loading ? "Отправляем код..." : "Получить код входа на почту"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Введите 6-значный код из письма ({email})
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-3.5 text-center text-2xl font-bold tracking-widest text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                  >
                    {loading ? "Проверяем..." : "Войти в кабинет"}
                  </button>
                  <button
                    onClick={() => setStep("email")}
                    className="px-4 py-3.5 rounded-xl border border-gray-300 text-gray-500 text-xs font-semibold"
                  >
                    Назад
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}