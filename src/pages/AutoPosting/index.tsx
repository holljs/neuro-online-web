import { useEffect } from "react";

const AutoPosting = () => {
  useEffect(() => {
    document.title = "Нейро-Криэйтор — Нейро-Мастер";
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Нейро-Криэйтор</h1>
        <p className="text-lg opacity-95 mb-6 leading-relaxed">
          ИИ составляет контент-план, генерирует картинки и готовит посты
          для ВК, Телеграм и любой другой соцсети.
          <br />
          Вы спите — контент идёт!
        </p>
        <a
          href="/cabinet.html"
          className="inline-block bg-white text-violet-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Открыть Криэйтор →
        </a>
        <p className="text-xs opacity-80 mt-4">
          Без паролей и рискованных схем: автопостинг в Телеграм, а для ВК —
          готовые посты с публикацией в один клик.
        </p>
      </div>

      {/* Как это работает */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Создайте проект</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Группа ВК, канал в Телеграм или блог где угодно — опишите, о чём он.
            Планировщик соберёт контент-план на месяц.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:green-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Темы и стиль</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Группы-доноры, свои темы или идеи от ИИ. Референсы задают единый
            стиль картинок под вашу площадку.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Посты готовы сами</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Тексты и картинки появляются по расписанию. В Телеграм публикуются
            сами, для ВК — готовый пост с кнопкой «Опубликовать».
          </p>
        </div>
      </div>

      {/* Тариф */}
      <div className="rounded-2xl border border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-950/20 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">30 постов — 990₽</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              30 постов + 6 генераций картинок в запасе. Тексты — без лимита. Получается 27.5₽ за пост с учётом запасных генераций.
              <br />
              Первый пост — бесплатно, ещё +2 поста за подписку на рассылку ВК.
            </p>
          </div>
          <a
            href="/cabinet.html"
            className="shrink-0 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition shadow-sm"
          >
            Попробовать бесплатно →
          </a>
        </div>
      </div>
    </div>
  );
};

export default AutoPosting;
