import React, { useState } from "react";

type ExamType = "oge" | "ege" | "vpr" | "olymp";

type Subject = {
  id: string;
  name: string;
  icon: string;
};

const subjects: Subject[] = [
  { id: "math", name: "Математика", icon: "📐" },
  { id: "rus", name: "Русский язык", icon: "📚" },
  { id: "phys", name: "Физика", icon: "⚡" },
  { id: "chem", name: "Химия", icon: "🧪" },
  { id: "inf", name: "Информатика", icon: "💻" },
  { id: "bio", name: "Биология", icon: "🧬" },
  { id: "geo", name: "География", icon: "🌍" },
  { id: "soc", name: "Обществознание", icon: "📊" },
  { id: "hist", name: "История", icon: "📜" },
  { id: "eng", name: "Английский язык", icon: "🇬🇧" },
];

export default function RepetitorPage() {
  const [selectedExam, setSelectedExam] = useState<ExamType>("oge");
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const examTitles: Record<ExamType, string> = {
    oge: "ОГЭ (9 класс)",
    ege: "ЕГЭ (11 класс)",
    vpr: "ВПР (4–8 классы)",
    olymp: "Олимпиады ВсОШ",
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
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
          8–11 классы
        </span>
      </div>

      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Нейро-Репетитор
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Персональный ИИ-инструктор: генерация тестов, проверка ответов и подробный разбор ошибок.
        </p>
      </div>

      {/* Табы выбора экзамена */}
      <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full max-w-xl border border-gray-200/60">
        {(["oge", "ege", "vpr", "olymp"] as ExamType[]).map((exam) => (
          <button
            key={exam}
            onClick={() => setSelectedExam(exam)}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
              selectedExam === exam
                ? "bg-white text-blue-600 shadow-sm border border-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {exam === "oge" ? "ОГЭ" : exam === "ege" ? "ЕГЭ" : exam === "vpr" ? "ВПР" : "Олимпиады"}
          </button>
        ))}
      </div>

      {/* Сетка предметов */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">
          Выберите предмет ({examTitles[selectedExam]}):
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setActiveSubject(sub)}
              className="p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-blue-300 hover:bg-blue-50/40 transition cursor-pointer flex flex-col justify-between h-32 shadow-sm hover:shadow group"
            >
              <div className="text-2xl">{sub.icon}</div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition">
                  {sub.name}
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">2 кр. / тест</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Окно тестирования */}
      {activeSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {activeSubject.name} — {examTitles[selectedExam]}
                </h3>
                <span className="text-xs text-gray-500">Запуск ИИ-тестирования</span>
              </div>
              <button
                onClick={() => setActiveSubject(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ✕ Закрыть
              </button>
            </div>
            
            <div className="flex-1 bg-blue-50/30 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-6xl mb-2">{activeSubject.icon}</div>
              <h4 className="text-2xl font-bold text-gray-900">
                Готовы начать вариант?
              </h4>
              <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                Вам будут предложены актуальные задания. После отправки ответов ИИ-арбитр на базе GPT-4.1 проверит результат и подробно разберет каждую ошибку.
              </p>
              <button
                onClick={() => {
                  alert(`Запуск варианта по предмету ${activeSubject.name} (${examTitles[selectedExam]})`);
                }}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
              >
                Начать вариант (Списать 2 кр.)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}