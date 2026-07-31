import React, { useState } from "react";

type ExamType = "oge" | "ege" | "vpr" | "olymp";

type Subject = {
  id: string;
  name: string;
  code: string;
};

const subjects: Subject[] = [
  { id: "math", name: "Математика", code: "MATH" },
  { id: "rus", name: "Русский язык", code: "RUS" },
  { id: "phys", name: "Физика", code: "PHYS" },
  { id: "chem", name: "Химия", code: "CHEM" },
  { id: "inf", name: "Информатика", code: "INFO" },
  { id: "bio", name: "Биология", code: "BIO" },
  { id: "geo", name: "География", code: "GEO" },
  { id: "soc", name: "Обществознание", code: "SOC" },
  { id: "hist", name: "История", code: "HIST" },
  { id: "eng", name: "Английский язык", code: "ENG" },
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
              <span className="text-xs font-extrabold tracking-wider text-blue-600/70 group-hover:text-blue-700">
                {sub.code}
              </span>
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

      {/* Окно активного тестирования через iframe */}
      {activeSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Шапка модального окна */}
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Нейро-Репетитор: {activeSubject.name}
                </h3>
                <span className="text-xs text-gray-500">{examTitles[selectedExam]}</span>
              </div>
              <button
                onClick={() => setActiveSubject(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Закрыть
              </button>
            </div>
            
            {/* Полноэкранный iframe с GitHub Pages */}
            <iframe
              src={`https://holljs.github.io/neuro-repetitor-bot/index.html?v=2&exam=${selectedExam}&subject=${activeSubject.id}`}
              className="w-full flex-1 border-0"
              title={activeSubject.name}
              allow="autoplay; microphone"
            />
          </div>
        </div>
      )}
    </div>
  );
}