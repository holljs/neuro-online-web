import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "/api";

type UserData = {
  balance: number;
  hasKidsPremium: boolean;
  hasGeniySub: boolean;
};

export default function KidsHub() {
  const [userData, setUserData] = useState<UserData>({
    balance: 0,
    hasKidsPremium: false,
    hasGeniySub: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<"oge" | "ege" | "olymp">("oge");

  // Определение user_id
  const getUserId = (): number => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get("user_id") || urlParams.get("vk_user_id");
    if (idFromUrl) return parseInt(idFromUrl);
    return parseInt(localStorage.getItem("user_id") || "233876992");
  };

  const userId = getUserId();

  // Загрузка статуса подписок и баланса
  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/${userId}`);
      if (res.data.success) {
        setUserData({
          balance: res.data.balance || 0,
          hasKidsPremium: !!res.data.has_premium,
          hasGeniySub: false, // Флаг из бэкенда при наличии
        });
      }
    } catch (e) {
      console.error("Ошибка загрузки данных пользователя:", e);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  // Быстрая оплата через ЮKassa
  const handlePayment = async (amount: number, description: string, currencyType: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/yookassa/create-payment`, {
        user_id: userId,
        amount: amount,
        description: description,
        platform: "website",
        currency_type: currencyType,
      });

      if (res.data.success && res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert("Ошибка создания счета");
      }
    } catch (e) {
      alert("Не удалось перейти к оплате");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* 1. ГЛАВНЫЙ БАННЕР И СТАТУС БАЛАНСА */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/30 rounded-full text-xs font-bold text-blue-300 uppercase tracking-wider">
            Детский образовательный хаб
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Нейро-Мастер Дети
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Интерактивное развитие, тренировка интеллекта и умная подготовка к экзаменам ОГЭ и ЕГЭ с помощью искусственного интеллекта.
          </p>
        </div>

        {/* Панель баланса родителя */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-400 block">Баланс кредитов</span>
              <span className="text-xl font-extrabold text-blue-400">{userData.balance} кр.</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Нейро-Малыш</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${userData.hasKidsPremium ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400"}`}>
                {userData.hasKidsPremium ? "Доступ открыт" : "Не куплен"}
              </span>
            </div>
          </div>

          <a
            href="/pay.html"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg"
          >
            Пополнить баланс
          </a>
        </div>
      </div>

      {/* 2. СЕКЦИЯ №1: НЕЙРО-РЕПЕТИТОР (ОГЭ / ЕГЭ / ВПР) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Нейро-Репетитор
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Персональный ИИ-инструктор для сдачи ОГЭ, ЕГЭ и Олимпиад
            </p>
          </div>

          {/* Переключатель классов/экзаменов */}
          <div className="flex p-1 bg-slate-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setSelectedExam("oge")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition ${selectedExam === "oge" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              ОГЭ (9 класс)
            </button>
            <button
              onClick={() => setSelectedExam("ege")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition ${selectedExam === "ege" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              ЕГЭ (11 класс)
            </button>
            <button
              onClick={() => setSelectedExam("olymp")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition ${selectedExam === "olymp" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              Олимпиады
            </button>
          </div>
        </div>

        {/* Карточки предметов */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: "Математика", code: "math" },
            { name: "Русский язык", code: "rus" },
            { name: "Физика", code: "phys" },
            { name: "Химия", code: "chem" },
            { name: "Информатика", code: "inf" },
            { name: "Биология", code: "bio" },
            { name: "География", code: "geo" },
            { name: "Обществознание", code: "soc" },
            { name: "История", code: "hist" },
            { name: "Английский язык", code: "eng" },
          ].map((sub) => (
            <a
              key={sub.code}
              href={`/repetitor?exam=${selectedExam}&subject=${sub.code}`}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between h-28"
            >
              <span className="font-bold text-sm text-slate-200 group-hover:text-blue-400">
                {sub.name}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-400">
                Пройти тест (2 кр.) →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 3. СЕКЦИЯ №2 И №3: НЕЙРО-ГЕНИЙ И НЕЙРО-МАЛЫШ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Нейро-Гений */}
        <div className="rounded-3xl border border-purple-900/40 bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950/30 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">
                Нейро-Гений
              </h3>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[11px] font-bold text-purple-300">
                5–9 лет
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Интерактивный комплекс развития интеллекта: ментальная арифметика Соробан, скорочтение, память и пошаговый китайский язык.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ Счёты Соробан и прямой счёт</li>
              <li className="flex items-center gap-2">✓ Изучение китайских иероглифов</li>
              <li className="flex items-center gap-2">✓ Дворец Памяти и Нейрогимнастика</li>
            </ul>
          </div>

          <button
            onClick={() => handlePayment(250, "Подписка Нейро-Гений (1 мес)", "geniy_sub")}
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl transition shadow-lg cursor-pointer"
          >
            {loading ? "Загрузка..." : "Оформить подписку (250 ₽/мес)"}
          </button>
        </div>

        {/* Нейро-Малыш */}
        <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">
                Нейро-Малыш
              </h3>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-[11px] font-bold text-amber-300">
                3–6 лет
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Логопедический тренажёр и сказочный мир Ути. Развитие речи, цветов, форм, логики и внимания без рекламы и списаний.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ Логопедические игры и раскраски</li>
              <li className="flex items-center gap-2">✓ Пошаговые интерактивные сказки</li>
              <li className="flex items-center gap-2">✓ Разовый платёж без автосписаний</li>
            </ul>
          </div>

          <button
            onClick={() => handlePayment(180, "Доступ Нейро-Малыш НАВСЕГДА", "kids_forever")}
            disabled={loading || userData.hasKidsPremium}
            className={`w-full py-3.5 font-bold text-xs rounded-2xl transition shadow-lg cursor-pointer ${
              userData.hasKidsPremium
                ? "bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 cursor-default"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            {userData.hasKidsPremium ? "Уже куплено (Доступ открыт)" : "Купить навсегда (180 ₽)"}
          </button>
        </div>

      </div>

    </div>
  );
}