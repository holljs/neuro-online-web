import React, { useState } from "react";

type Module = {
  id: string;
  title: string;
  subtitle: string;
  isFree: boolean;
  color: string;
  desc: string;
};

const modules: Module[] = [
  { id: "words", title: "Слоги", subtitle: "Составь слово", isFree: true, color: "bg-amber-50 text-amber-900 border-amber-200", desc: "Сборка слов из частей и букв" },
  { id: "memorika", title: "Меморика", subtitle: "Супер-память", isFree: true, color: "bg-blue-50 text-blue-900 border-blue-200", desc: "Дворец Памяти и заучивание стихов" },
  { id: "brain", title: "Нейрогимнастика", subtitle: "Когнитивные навыки", isFree: true, color: "bg-purple-50 text-purple-900 border-purple-200", desc: "Задания для обоих полушарий мозга" },
  { id: "soroban", title: "Соробан", subtitle: "Ментальная арифметика", isFree: false, color: "bg-emerald-50 text-emerald-900 border-emerald-200", desc: "Быстрый счёт на счётах" },
  { id: "chinese", title: "Китайский язык", subtitle: "Пошаговое обучение", isFree: false, color: "bg-rose-50 text-rose-900 border-rose-200", desc: "Иероглифы, ключи и фразы" },
];

export default function GeniyPage() {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [hasSub, setHasSub] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);

  const handleOpenModule = (mod: Module) => {
    if (mod.isFree || hasSub) {
      setActiveModule(mod);
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
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
          5–9 лет
        </span>
      </div>

      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Нейро-Гений
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Интерактивный комплекс развития интеллекта, скорочтения и памяти.
        </p>
      </div>

      {/* Сетка модулей */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((mod) => {
          const isOpen = mod.isFree || hasSub;
          return (
            <div
              key={mod.id}
              onClick={() => handleOpenModule(mod)}
              className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between h-44 relative overflow-hidden shadow-sm hover:shadow-md ${mod.color}`}
            >
              {!isOpen && (
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-amber-700 shadow-sm border border-amber-200">
                  🔒 VIP
                </div>
              )}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  {mod.subtitle}
                </span>
                <h3 className="font-bold text-xl">{mod.title}</h3>
                <p className="text-xs opacity-80 mt-2 leading-relaxed">{mod.desc}</p>
              </div>
              <span className="text-xs font-bold underline mt-3">
                {isOpen ? "Запустить тренажёр →" : "Открыть доступ →"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Модальное окно подписки */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">🔒 Доступ закрыт</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Откройте Ментальную арифметику Соробан, Китайский язык и все продвинутые модули по подписке за <b>250 ₽/мес</b>.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  alert("Переход к оформлению подписки ЮKassa (250 ₽/мес)");
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                Оформить подписку за 250 ₽/мес
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

      {/* Экран активного тренажёра */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">
                Тренажёр: {activeModule.title}
              </h3>
              <button
                onClick={() => setActiveModule(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ✕ Закрыть
              </button>
            </div>
            
            <div className="flex-1 bg-purple-50/40 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🧩</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                Модуль «{activeModule.title}»
              </h4>
              <p className="text-sm text-gray-600 max-w-md">
                Интерактивная панель тренажёра готова к работе.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}