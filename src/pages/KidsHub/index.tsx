import React, { useState } from "react";

// Типизация для сервисов
type ChildService = {
  id: string;
  title: string;
  age: string;
  description: string;
  features: string[];
  buttonText: string;
  priceType: "forever" | "subscription" | "credits";
  price: number;
};

// Данные сервисов (расставлены по возрасту: от меньшего к большему)
const servicesData: ChildService[] = [
  {
    id: "malysh",
    title: "Нейро-Малыш",
    age: "3–6 лет",
    description: "Логопедический тренажёр и игровой мир раннего развития.",
    features: [
      "Развитие речи и запуск разговора",
      "Изучение цветов, форм и животных",
      "Интерактивные сказки и раскраски",
      "Безопасно, без рекламы"
    ],
    buttonText: "Открыть доступ навсегда",
    priceType: "forever",
    price: 180,
  },
  {
    id: "geniy",
    title: "Нейро-Гений",
    age: "5–9 лет",
    description: "Комплекс тренировки интеллекта и когнитивных навыков.",
    features: [
      "Ментальная арифметика (Соробан)",
      "Скорочтение и тренировка памяти",
      "Пошаговый китайский язык",
      "Нейрогимнастика для мозга"
    ],
    buttonText: "Оформить подписку",
    priceType: "subscription",
    price: 250,
  },
];

// Список предметов для Репетитора
const subjects = [
  "Математика", "Русский язык", "Физика", "Химия", "Информатика",
  "Биология", "География", "Обществознание", "История", "Английский язык"
];

export default function KidsHub() {
  const [selectedExam, setSelectedExam] = useState<"oge" | "ege" | "olymp">("oge");

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-10 bg-white min-h-screen">
      
      {/* 1. ЗАГОЛОВОК СТРАНИЦЫ (Чисто и просто) */}
      <div className="border-b border-slate-100 pb-6">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Образовательный хаб
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-1">
          Нейро-Мастер Дети
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-3xl">
          Развивающие ИИ-сервисы и умная подготовка к экзаменам для разных возрастных групп. Выберите подходящее направление.
        </p>
      </div>

      {/* 2. БЛОК 1 и 2: МАЛЫШ И ГЕНИЙ (В стиле карточек Художника) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesData.map((service) => (
          <div key={service.id} className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between transition hover:shadow-md space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 whitespace-nowrap">
                  {service.age}
                </span>
              </div>

              <ul className="space-y-2 pt-2 text-sm text-slate-700 list-disc list-inside">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-auto">
              <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2">
                {service.buttonText}
                <span className="font-normal opacity-80">
                  ({service.price} ₽{service.priceType === "subscription" ? "/мес" : service.priceType === "forever" ? " навсегда" : ""})
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. БЛОК 3: НЕЙРО-РЕПЕТИТОР (Самый старший, белый стиль) */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Шапка Репетитора */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-950">
              Нейро-Репетитор
            </h2>
            <p className="text-sm text-slate-600">
              Персональный ИИ-инструктор для сдачи ОГЭ, ЕГЭ и Олимпиад (8–11 классы).
            </p>
          </div>

          {/* Табы переключения (Сенинькие, чистенькие) */}
          <div className="flex p-1 bg-slate-50 rounded-xl w-full md:w-auto border border-slate-100">
            {(["oge", "ege", "olymp"] as const).map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className={`flex-1 md:flex-none px-5 py-2.5 text-xs font-bold rounded-lg transition ${
                  selectedExam === exam
                    ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {exam === "oge" ? "ОГЭ (9 класс)" : exam === "ege" ? "ЕГЭ (11 класс)" : "Олимпиады ВсОШ"}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка предметов (Белые карточки на белом фоне) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {subjects.map((subject) => (
            <a
              key={subject}
              href={`/repetitor?exam=${selectedExam}&subject=${subject}`}
              className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition group flex flex-col justify-between h-32 shadow-sm hover:shadow"
            >
              <span className="font-bold text-base text-slate-900 group-hover:text-blue-700">
                {subject}
              </span>
              <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition">
                Начать тренировку →
              </span>
            </a>
          ))}
        </div>
        
        <div className="text-center pt-4">
            <p className="text-xs text-slate-400">* Тестирование и разбор заданий оплачиваются кредитами.</p>
        </div>
      </div>

    </div>
  );
}