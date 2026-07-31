import React, { useState } from "react";

type Room = {
  id: string;
  title: string;
  isFree: boolean;
  color: string;
  desc: string;
};

const rooms: Room[] = [
  { id: "animals", title: "Животные", isFree: true, color: "bg-amber-100 text-amber-900 border-amber-200", desc: "Учим животный мир и их голоса" },
  { id: "colors", title: "Цвета", isFree: true, color: "bg-blue-100 text-blue-900 border-blue-200", desc: "Запоминаем яркие цвета" },
  { id: "big_small", title: "Большой - Маленький", isFree: false, color: "bg-purple-100 text-purple-900 border-purple-200", desc: "Сортировка по размерам" },
  { id: "shapes", title: "Фигуры", isFree: false, color: "bg-emerald-100 text-emerald-900 border-emerald-200", desc: "Геометрические формы" },
  { id: "draw", title: "Раскраски", isFree: false, color: "bg-pink-100 text-pink-900 border-pink-200", desc: "Интерактивный мольберт" },
  { id: "feeding", title: "Кто что ест?", isFree: false, color: "bg-orange-100 text-orange-900 border-orange-200", desc: "Кормим зверят" },
  { id: "wants", title: "Желания", isFree: false, color: "bg-rose-100 text-rose-900 border-rose-200", desc: "Понимаем эмоции" },
  { id: "letters", title: "Буквы", isFree: false, color: "bg-sky-100 text-sky-900 border-sky-200", desc: "Первый алфавит" },
  { id: "numbers", title: "Цифры", isFree: false, color: "bg-indigo-100 text-indigo-900 border-indigo-200", desc: "Счёт и цифры" },
  { id: "actions", title: "Утя действует", isFree: false, color: "bg-teal-100 text-teal-900 border-teal-200", desc: "Глаголы и действия" },
  { id: "story", title: "Сказки", isFree: false, color: "bg-yellow-100 text-yellow-900 border-yellow-200", desc: "Интерактивный сказочный мир" },
  { id: "wind", title: "Ветерок", isFree: false, color: "bg-cyan-100 text-cyan-900 border-cyan-200", desc: "Дыхательный тренажер" },
  { id: "music", title: "Пианино", isFree: false, color: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200", desc: "Волшебные звуки и ноты" },
];

export default function MalyshPage() {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [hasVip, setHasVip] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);

  const handleOpenRoom = (room: Room) => {
    if (room.isFree || hasVip) {
      setActiveRoom(room);
    } else {
      setShowPayModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 bg-white min-h-screen">
      {/* Навигация назад */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <a
          href="/kids"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition"
        >
          <span>← Назад в детский хаб</span>
        </a>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
          3–6 лет
        </span>
      </div>

      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Нейро-Малыш
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Логопедический тренажёр и сказочные интерактивы с Утей.
        </p>
      </div>

      {/* Баннер акции за подписку на рассылку */}
      {!hasVip && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg">
              🎁 Хотите открыть все комнаты на 24 часа бесплатно?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100">
              Разрешите рассылку ВК и получите мгновенный VIP-доступ ко всем играм!
            </p>
          </div>
          <button
            onClick={() => {
              window.open("https://vk.com/neiro_malish", "_blank");
              setHasVip(true);
            }}
            className="px-5 py-2.5 bg-white text-orange-600 font-bold text-xs sm:text-sm rounded-xl hover:bg-amber-50 transition shadow-sm whitespace-nowrap cursor-pointer"
          >
            Получить VIP на 24 часа
          </button>
        </div>
      )}

      {/* Сетка комнат */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const isOpen = room.isFree || hasVip;
          return (
            <div
              key={room.id}
              onClick={() => handleOpenRoom(room)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden shadow-sm hover:shadow-md ${room.color}`}
            >
              {!isOpen && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-md text-[10px] font-bold text-gray-700 shadow-sm border border-gray-200">
                  🔒 Замочек
                </div>
              )}
              <div>
                <h3 className="font-bold text-base sm:text-lg">{room.title}</h3>
                <p className="text-xs opacity-80 mt-1 leading-snug">{room.desc}</p>
              </div>
              <span className="text-xs font-bold underline mt-2">
                {isOpen ? "Играть →" : "Открыть →"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Модалка закрытой комнаты */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">👑 Открой все игры!</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Получите вечный доступ ко всем комнатам, играм, раскраскам и сказкам всего за <b>180 ₽</b>. Без подписок и автосписаний!
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  alert("Переход к оплате ЮKassa (180 ₽)");
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                Купить вечный доступ за 180 ₽
              </button>
              <button
                onClick={() => setShowPayModal(false)}
                className="w-full py-2.5 text-gray-500 hover:text-gray-800 text-xs font-semibold cursor-pointer"
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Окно выбранной игры с подключённым iframe */}
      {activeRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Шапка окна */}
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base sm:text-lg">
                  Нейро-Малыш: {activeRoom.title}
                </span>
              </div>
              <button
                onClick={() => setActiveRoom(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ✕ Закрыть
              </button>
            </div>
            
            {/* Полноэкранный iframe с GitHub Pages */}
            <iframe
              src={`https://holljs.github.io/neuro-malysh-app/index.html?v=3&room=${activeRoom.id}&vip=${hasVip ? 1 : 0}`}
              className="w-full flex-1 border-0"
              title={activeRoom.title}
              allow="autoplay; microphone"
            />
          </div>
        </div>
      )}
    </div>
  );
}