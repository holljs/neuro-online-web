import React, { useState, useEffect } from "react";

const API_BASE = "/api";

export default function UserProfiles() {
  const [user, setUser] = useState<{ id: number; balance: number; energy: number } | null>(null);
  const [inputUserId, setInputUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Вкладки ЛК: Аккаунт, Прайс, Справка
  const [activeMenu, setActiveMenu] = useState<"account" | "price" | "help">("account");

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) {
      fetchUserData(parseInt(savedUserId));
    }
  }, []);

  const fetchUserData = async (userId: number) => {
    setLoading(true);
    setError("");
    try {
      const resArtist = await fetch(`${API_BASE}/user/${userId}`);
      const dataArtist = await resArtist.json();

      let energyVal = 0;
      try {
        const resBro = await fetch(`${API_BASE}/bro/user/${userId}`);
        const dataBro = await resBro.json();
        if (dataBro.success) energyVal = dataBro.energy || 0;
      } catch (e) {
        console.error("Ошибка загрузки энергии:", e);
      }

      if (dataArtist.success) {
        setUser({
          id: userId,
          balance: dataArtist.balance || 0,
          energy: energyVal,
        });
        localStorage.setItem("user_id", userId.toString());
      } else {
        setError("Не удалось загрузить данные аккаунта.");
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка соединения с сервером.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputUserId.replace(/\D/g, "");
    if (cleanId) {
      fetchUserData(parseInt(cleanId));
    } else {
      setError("Введите корректный цифровой VK ID");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUser(null);
    setInputUserId("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        {/* Шапка ЛК */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Личный кабинет
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Управление балансом, тарифы и справка
            </p>
          </div>

          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold transition"
          >
            ← На главную
          </a>
        </div>

        {/* Меню-переключатель */}
        <div className="flex gap-2 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveMenu("account")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "account"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Аккаунт и Баланс
          </button>

          <button
            onClick={() => setActiveMenu("price")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "price"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Прайс
          </button>

          <button
            onClick={() => setActiveMenu("help")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeMenu === "help"
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Справка и модели
          </button>
        </div>

        {/* 1. ВКЛАДКА: АККАУНТ И БАЛАНС */}
        {activeMenu === "account" && (
          <div className="pt-6 space-y-6">
            {user ? (
              <>
                <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Идентификатор аккаунта
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white text-base">
                    ID: {user.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Нейро-Художник */}
                  <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                          Нейро-Художник
                        </h2>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                          Арт / Видео / Музыка
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Генерация артов, фотореализма, анимаций и музыки
                      </p>

                      <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {user.balance}{" "}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          кредитов
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`/pay.html?app=artist&user_id=${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition shadow-sm block"
                      >
                        Пополнить кредиты
                      </a>

                      <a
                        href="/neuro-artist"
                        className="w-full py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-xs text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition block"
                      >
                        Перейти к Художнику →
                      </a>
                    </div>
                  </div>

                  {/* Нейро-Бро */}
                  <div className="p-5 rounded-2xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-950/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                          Нейро-Бро
                        </h2>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded">
                          Чат / ИИ / Код
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Интеллектуальный помощник, анализ файлов и программирование
                      </p>

                      <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {user.energy}{" "}
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          энергии
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`/pay.html?app=bro&user_id=${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition shadow-sm block"
                      >
                        Пополнить энергию
                      </a>

                      <a
                        href="/neuro-bro"
                        className="w-full py-2 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-semibold text-xs text-center hover:bg-purple-50 dark:hover:bg-purple-900/20 transition block"
                      >
                        Перейти к Нейро-Бро →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 text-xs">
                  <a
                    href="https://vk.me/club191367447"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition font-medium"
                  >
                    Служба поддержки
                  </a>

                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 font-medium transition"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4 py-4 max-w-sm mx-auto text-center">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Введите ваш VK ID для авторизации:
                </p>
                <input
                  type="text"
                  placeholder="Например: 233876992"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white text-center text-base font-mono focus:outline-none focus:border-blue-500"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm"
                >
                  {loading ? "Загрузка..." : "Войти в кабинет"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 2. ВКЛАДКА: ПОЛНЫЙ ПРАЙС */}
        {activeMenu === "price" && (
          <div className="pt-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Прайс-лист и тарифы списания
            </h2>

            {/* Раздел Нейро-Художник */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Нейро-Художник (Кредиты)
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="p-3">Режим генерации</th>
                      <th className="p-3">Описание</th>
                      <th className="p-3 text-right">Стоимость</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300">
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Люкс-Фото</td>
                      <td className="p-3">Премиум-генерация и редактирование по фото (Seedream 5.0 Pro)</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">4 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Реал-Фото</td>
                      <td className="p-3">Точное сохранение лица, мимики и внешности человека</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">3 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Пиар-Фото</td>
                      <td className="p-3">Постеры, баннеры, русский текст на фото и смешивание до 10 картинок</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">4 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Бизнес / Маркетплейс</td>
                      <td className="p-3">Предметная съёмка, карточки товаров и реклама (на базе Пиар-Фото)</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">4 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Ультра-Реал</td>
                      <td className="p-3">Максимальный фотореализм, студийный свет и объединение до 14 лиц</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">5 кредитов</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Реставратор</td>
                      <td className="p-3">Улучшение качества, удаление царапин и раскрашивание старых фото</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">3 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Живое Фото</td>
                      <td className="p-3">Анимация статичного снимка (ветер, вода, улыбка, движение камеры)</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">3 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Видео-Клип</td>
                      <td className="p-3">Видео 3–5 секунд полностью по вашему текстовому описанию</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">5 кредитов</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">ИИ-Режиссер (5 сек)</td>
                      <td className="p-3">Видео от ByteDance со встроенным звуком и точным липсинком</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">30 кредитов</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">ИИ-Режиссер (10 сек)</td>
                      <td className="p-3">Удлиненные ИИ-клипы премиум-качества для панорам и монтажа</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">50 кредитов</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Нейро-Музыка</td>
                      <td className="p-3">Создание музыкального трека с вокалом по вашему тексту</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">2 кредита</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Озвучка текста</td>
                      <td className="p-3">Превращает любой текст в красивую аудиозапись голосом диктора</td>
                      <td className="p-3 font-bold text-right text-blue-600 dark:text-blue-400">1 кредит</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Раздел Нейро-Бро */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Нейро-Бро (Энергия)
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="p-3">Режим ИИ</th>
                      <th className="p-3">Назначение</th>
                      <th className="p-3 text-right">Стоимость</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300">
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Быстрая</td>
                      <td className="p-3">Мгновенные ответы, диалоги, быстрый копирайтинг</td>
                      <td className="p-3 font-bold text-right text-purple-600 dark:text-purple-400">3 энергии</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Думающая</td>
                      <td className="p-3">Анализ фотографий, документов, развернутые тексты</td>
                      <td className="p-3 font-bold text-right text-purple-600 dark:text-purple-400">15 энергии</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">Про-Кодер</td>
                      <td className="p-3">Сложная аналитика, написание кода, архитектура ПО</td>
                      <td className="p-3 font-bold text-right text-purple-600 dark:text-purple-400">50 энергии</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ВКЛАДКА: СПРАВКА И ОПИСАНИЕ МОДЕЛЕЙ */}
        {activeMenu === "help" && (
          <div className="pt-6 space-y-6 text-xs text-gray-600 dark:text-gray-300">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Справка и руководство по моделям
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  Какую модель Художника выбрать?
                </h3>
                <p>• <strong>Люкс-Фото (4 кр.):</strong> Премиум-модель Seedream 5.0 Pro — идеальна для артов, концептов, аватарок и редактирования по фото.</p>
                <p>• <strong>Реал-Фото (3 кр.):</strong> Самый реалистичный режим для портретов — максимально сохраняет лицо и внешность человека.</p>
                <p>• <strong>Пиар-Фото (4 кр.):</strong> Для рекламы и бизнеса — пишет русский текст на фото без ошибок и смешивает товары с разных фото.</p>
                <p>• <strong>Ультра-Реал (5 кр.):</strong> Используйте для портретов, людей и реальных объектов, когда важна естественность кожи и освещения.</p>
                <p>• <strong>Бизнес (4 кр.):</strong> Оптимизировано под изолированные объекты на чистом фоне для WB, Ozon и сайтов.</p>
                <p>• <strong>Реставратор (3 кр.):</strong> Мгновенное улучшение качества и раскрашивание старых фото.</p>
                <p>• <strong>ИИ-Режиссер (30/50 кр.):</strong> Превращает любые сгенерированные арты в плавные 5 или 10 секундные видеоролики со звуком.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  Как работать с Нейро-Бро?
                </h3>
                <p>• <strong>Быстрая:</strong> Подходит для простого общения, вопросов и генерации коротких текстов.</p>
                <p>• <strong>Думающая:</strong> Анализирует прикрепленные изображения, фото и сложные документы.</p>
                <p>• <strong>Про-Кодер:</strong> Включает глубокий логический анализ, видит контекст кода и помогает находить ошибки.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Вопросы по оплате и балансу
              </h3>
              <p>Балансы <strong>Кредитов (Художник)</strong> и <strong>Энергии (Бро)</strong> разделены. При пополнении убедитесь, что выбрали нужный сервис. Покупка зачисляется мгновенно.</p>
              <p>
                Если у вас возник вопрос по начислению или технической ошибке, напишите в{" "}
                <a
                  href="https://vk.me/club191367447"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-bold underline"
                >
                  поддержку ВКонтакте
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}