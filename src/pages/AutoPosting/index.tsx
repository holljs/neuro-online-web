import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const OAUTH_URL = "https://oauth.vk.com/authorize?client_id=2685278&scope=friends,messages,wall,groups,photos,offline&redirect_uri=https://oauth.vk.com/blank.html&response_type=token&v=5.199";

const AutoPosting = () => {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [myStatus, setMyStatus] = useState<any>(null);

  const getUserId = () => localStorage.getItem("vk_user_id") || localStorage.getItem("user_id");

  useEffect(() => {
    document.title = "Нейро-редактор в ВК — Нейро-Мастер";
    const uid = getUserId();
    if (!uid) { setChecking(false); return; }
    fetch(`/api/autoposter/my?user_id=${uid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setMyStatus(data);
      })
      .finally(() => setChecking(false));
  }, []);

  const extractToken = (input: string): string | null => {
    const m = input.match(/access_token=([^&\s]+)/);
    if (m) return m[1];
    const t = input.trim();
    if (t.length > 80 && !t.includes(" ")) return t;
    return null;
  };

  const handleConnect = async () => {
    const token = extractToken(tokenInput);
    if (!token) { setError("Не нашли токен. Вставьте адресную строку целиком."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/autoposter/connect", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user_id: getUserId() }),
      });
      const data = await res.json();
      if (data.ok) navigate(`/autoposter/setup?client_id=${data.client_id}`);
      else setError(data.error || "Ошибка подключения");
    } catch { setError("Ошибка соединения с сервером"); }
    finally { setLoading(false); }
  };

  // Авто-отправка при вставке токена
  useEffect(() => {
    if (!tokenInput) return;
    const t = extractToken(tokenInput);
    if (t && t.length > 80) {
      const timer = setTimeout(() => handleConnect(), 300);
      return () => clearTimeout(timer);
    }
  }, [tokenInput]);

  if (checking) {
    return <div className="max-w-2xl mx-auto mt-20 text-center text-gray-500">Проверяем ваш профиль...</div>;
  }

  // 🎯 Если уже подключён — сразу в визард (с возможностью добавить группу)
  if (myStatus?.has_token) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Вы уже подключены!</h1>
              <p className="opacity-90 mt-1">Здравствуйте, {myStatus.me?.first_name}</p>
            </div>
          </div>
          <p className="opacity-95">Токен активен. Вы админ в {myStatus.groups?.length || 0} группах — группу для постинга можно сменить в настройках.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{myStatus.posts_today || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Постов сегодня</div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{myStatus.posts_used || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Всего опубликовано</div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{Math.max(0, (myStatus.posts_per_month || 0) - (myStatus.posts_used || 0))}</div>
            <div className="text-xs text-gray-500 mt-1">Осталось</div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
            <div className="text-2xl font-bold text-brand-600">{myStatus.posts_per_month || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Лимит / мес</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <b>📌 Группа для постинга:</b> {myStatus.groups?.find((g: any) => g.id === myStatus.current_group)?.name || "не выбрана"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <b>🔄 Доноры:</b> {myStatus.settings?.donors?.length ? myStatus.settings.donors.join(", ") : "не подключены"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <b>👥 Вы админ в группах:</b> {myStatus.groups?.map((g: any) => g.name).join(", ")}
          </p>
        </div>

        <button onClick={async () => {
          const res = await fetch("/api/autoposter/pay", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: myStatus.client_id, tariff: myStatus.tariff || "start" }),
          });
          const data = await res.json();
          if (data.ok) window.location.href = data.url;
        }} className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg">
          💳 Пополнить лимит постов
        </button>

        <button onClick={() => navigate(`/autoposter/setup?client_id=${myStatus.client_id}`)}
          className="w-full bg-brand-500 text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-600 transition-colors shadow-lg">
          ⚙️ Настроить нейро-редактор →
        </button>

        <details className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
            Подключить новый аккаунт ВК
          </summary>
          <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-gray-700 dark:text-gray-300">
            ⚠️ <b>Внимание:</b> при повторной авторизации старый токен перестанет работать. Используйте это только если хотите подключить нейро-редактор с другого аккаунта ВК. Для добавления ещё одной группы в текущий аккаунт — просто нажмите «Настроить нейро-редактор» выше (все ваши группы уже там).
          </div>
          <button onClick={() => {
            const a = document.createElement("a"); a.href = OAUTH_URL; a.target = "_blank";
            a.rel = "noreferrer noopener"; document.body.appendChild(a); a.click(); a.remove();
          }} className="mt-4 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Открыть окно ВК для нового аккаунта
          </button>
        </details>
      </div>
    );
  }

  // 🎯 Первый раз — лендинг с OAuth
  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="5" y="9" width="14" height="10" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M12 9V5" />
              <circle cx="12" cy="4" r="1.5" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M9.5 13v2M14.5 13v2" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Нейро-редактор в ВК</h1>
        </div>
        <p className="text-lg opacity-95 mb-6 leading-relaxed">
          ИИ сам создаёт уникальные картинки и публикует их в вашу группу по расписанию.
          <br />Вы спите — контент идёт!
        </p>
        <button onClick={() => {
            const a = document.createElement("a"); a.href = OAUTH_URL; a.target = "_blank";
            a.rel = "noreferrer noopener"; document.body.appendChild(a); a.click(); a.remove();
          }}
          className="bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg">
          Подключить группу →
        </button>

        <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur p-6 text-left max-w-xl">
          <p className="text-sm mb-3 opacity-95">
            <b>Шаг 1.</b> Нажмите «Подключить группу» выше — откроется окно ВК. Нажмите «Разрешить».
            <br /><b>Шаг 2.</b> Откроется белая страница с красным предупреждением — <b>это НОРМАЛЬНО!</b> Нажмите <b>Ctrl+A</b> и <b>Ctrl+C</b>. Вернитесь сюда и нажмите <b>Ctrl+V</b> в поле ниже — подключение произойдёт автоматически.
          </p>
          <div className="mb-2 flex items-center gap-2 text-xs opacity-90">
            <kbd className="bg-white/20 px-2 py-0.5 rounded">Ctrl+A</kbd>
            <span>затем</span>
            <kbd className="bg-white/20 px-2 py-0.5 rounded">Ctrl+C</kbd>
            <span>на белой странице →</span>
            <kbd className="bg-white/20 px-2 py-0.5 rounded">Ctrl+V</kbd>
            <span>сюда ↓</span>
          </div>
          <input type="text" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Вставьте адресную строку белой страницы (Ctrl+V)"
            className="w-full rounded-xl border-0 bg-white/95 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white" />
          {error && <p className="mt-2 text-sm text-yellow-200">{error}</p>}
          <p className="mt-3 text-xs opacity-75">
            ВК предупредит «не копируйте токен» — это предупреждение для чужих сайтов. Вы отдаёте токен СВОЕМУ сервису Нейро-Мастер: он будет постить только в ВАШУ группу. Отменить доступ можно в любой момент в настройках ВК.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Подключите группу</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Разрешите доступ в окне ВК и вставьте адресную строку. Никаких паролей!</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2" /><circle cx="12" cy="12" r="5" strokeWidth="2" /><circle cx="12" cy="12" r="1.5" strokeWidth="2" fill="currentColor" stroke="none" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Выберите темы</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Укажите группы-доноры, свои темы или доверьте ИИ придумывать темы самому</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ИИ генерирует и постит</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Каждый день в указанное время появляется новый пост с уникальной картинкой</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Тарифы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Старт", price: "900₽", posts: "30 постов в месяц", extra: ["Уникальные картинки ИИ", "Расписание по вашему выбору", "Группы-доноры для тем"] },
            { name: "Бизнес", price: "1 500₽", posts: "60 постов в месяц", extra: ["Уникальные картинки ИИ", "Тексты к постам (ИИ)", "Приоритетная поддержка"], featured: true },
            { name: "Премиум", price: "2 500₽", posts: "90 постов в месяц", extra: ["Уникальные картинки ИИ", "Тексты + темы от ИИ", "Персональный менеджер"] },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl border-2 p-6 transition-all duration-200 ${plan.featured ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-lg" : "border-gray-200 dark:border-gray-700 hover:border-brand-500"}`}>
              {plan.featured && <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase mb-2">Популярный</div>}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-4">{plan.price}<span className="text-sm text-gray-500 font-normal">/мес</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm text-gray-700 dark:text-gray-300"><span className="text-green-500 mr-2">✓</span> {plan.posts}</li>
                {plan.extra.map((f) => (<li key={f} className="flex items-start text-sm text-gray-700 dark:text-gray-300"><span className="text-green-500 mr-2">✓</span> {f}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Частые вопросы</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-2">Как подключается группа?</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Вы разрешаете доступ в окне ВК и вставляете адресную строку в поле. Мы не видим ваш пароль — только токен для публикации постов.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <h4 className="text-base font-bold text-brand-600 dark:text-brand-400 mb-2">Можно ли приостановить?</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">Да, в любой момент в личном кабинете. Неиспользованные посты переносятся на следующий месяц.</p>
        </div>
      </div>
    </div>
  );
};

export default AutoPosting;
