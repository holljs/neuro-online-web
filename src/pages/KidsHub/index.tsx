import React from "react";

type ServiceCard = {
  id: string;
  title: string;
  age: string;
  badge: string;
  description: string;
  link: string;
};

const kidsServices: ServiceCard[] = [
  {
    id: "malysh",
    title: "Нейро-Малыш",
    age: "3–6 лет",
    badge: "Раннее развитие",
    description: "Логопедический тренажёр, запуск речи, цвета, формы, звуки животных и интерактивные сказки.",
    link: "/kids/malysh",
  },
  {
    id: "geniy",
    title: "Нейро-Гений",
    age: "5–9 лет",
    description: "Ментальная арифметика Соробан, пошаговый китайский язык, скорочтение, меморика и нейрогимнастика.",
    link: "/kids/geniy",
  },
  {
    id: "repetitor",
    title: "Нейро-Репетитор",
    age: "8–11 классы",
    badge: "Экзамены и ВПР",
    description: "Подготовка к ОГЭ, ЕГЭ, ВПР и Олимпиадам. Интерактивные тесты с автоматическим ИИ-разбором ошибок.",
    link: "/kids/repetitor",
  },
];

export default function KidsHub() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 bg-white min-h-screen">
      
      {/* Шапка страницы */}
      <div className="border-b border-gray-100 pb-6">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Образовательный хаб
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
          Нейро-Мастер Дети
        </h1>
        <p className="text-base text-gray-600 mt-2 max-w-2xl">
          Единая платформа интерактивного обучения и подготовки к школьным экзаменам. Выберите нужный сервис:
        </p>
      </div>

      {/* Сетка их 3 одинаковых аккуратных карточек */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kidsServices.map((service) => (
          <div
            key={service.id}
            className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {service.title}
                </h3>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 whitespace-nowrap">
                  {service.age}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <a
                href={service.link}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Перейти к сервису</span>
                <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}