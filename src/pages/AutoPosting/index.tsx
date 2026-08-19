import { useEffect } from "react";

const AutoPosting = () => {
  useEffect(() => {
    document.title = "Автопостинг в ВК — Нейро-Мастер";
  }, []);

  const oauthUrl = "https://oauth.vk.com/authorize?client_id=2685278&scope=groups,wall,photos,offline&redirect_uri=https://neuro-master.online/autoposter/callback&response_type=code&v=5.199";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">🤖 Автопостинг в ВК</h1>
        <p className="text-lg opacity-95 mb-6 leading-relaxed">
          ИИ сам создаёт уникальные картинки и публикует их в вашу группу по расписанию.
          <br />
          Вы спите — контент идёт!
        </p>
        <a
          href={oauthUrl}
          className="inline-block bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Подключить группу →
        </a>
      </div>

      {/* Как это работает */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Подключите группу</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Нажмите кнопку и разрешите доступ к вашей группе ВК. Никаких паролей!
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Выберите темы</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Укажите группы-доноры, свои темы или доверьте ИИ придумывать темы самому
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ИИ генерирует и постит</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Каждый день в указанное время появляется новый пост с уникальной картинкой
          </p>
        </div>
      </div>

      {/* Тарифы */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Тарифы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Старт</h3>
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              900₽<span className="text-sm text-gray-500 font-normal">/мес</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> 30 постов в месяц
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Уникальные картинки ИИ
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Расписание по вашему выбору
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Группы-доноры для тем
              </li>
            </ul>
            <a
              href={oauthUrl}
              className="block w-full text-center bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
            >
              Выбрать
            </a>
          </div>

          <div className="rounded-xl border-2 border-brand-500 p-6 bg-brand-50 dark:bg-brand-900/20 shadow-lg scale-105">
            <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase mb-2">Популярный</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Бизнес</h3>
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              1 500₽<span className="text-sm text-gray-500 font-normal">/мес</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> 60 постов в месяц
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Уникальные картинки ИИ
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Тексты к постам (ИИ)
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Приоритетная поддержка
              </li>
            </ul>
            <a
              href={oauthUrl}
              className="block w-full text-center bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
            >
              Выбрать
            </a>
          </div>

          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-200">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Премиум</h3>
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              2 500₽<span className="text-sm text-gray-500 font-normal">/мес</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> 90 постов в месяц
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Уникальные картинки ИИ
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Тексты + темы от ИИ
              </li>
              <li className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Персональный менеджер
              </li>
            </ul>
            <a
              href={oauthUrl}
              className="block w-full text-center bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
            >
              Выбрать
            </a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Частые вопросы</h2>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-2">Как подключается группа?</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Вы нажимаете «Подключить группу» и разрешаете доступ в окне ВК. Мы не видим ваш пароль — только токен для публикации постов.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-2">Откуда берутся темы для постов?</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Три варианта: вы указываете группы-доноры (мы берём промпты оттуда), пишете свои темы вручную, или ИИ сам придумывает темы под вашу нишу.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-2">Можно ли приостановить автопостинг?</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Да, в любой момент в личном кабинете. Неиспользованные посты переносятся на следующий месяц.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-2">А если картинки будут плохие?</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Мы используем передовые модели ИИ (GPT-Image, Seedream). Если картинка не понравится — можете отменить пост до публикации.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Готовы автоматизировать контент?</h2>
        <p className="text-lg mb-6 opacity-95">Начните автопостинг за 900₽ в месяц</p>
        <a
          href={oauthUrl}
          className="inline-block bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Подключить группу →
        </a>
      </div>
    </div>
  );
};

export default AutoPosting;
