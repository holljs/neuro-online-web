import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const Setup = () => {
  const [searchParams] = useSearchParams();
  const [clientIdState, setClientIdState] = useState<string | null>(
    searchParams.get("client_id")
  );
  const clientId = clientIdState;

  // Если client_id нет в URL — получаем свой через VK API
  useEffect(() => {
    if (clientIdState) return;
    
    // Пробуем получить user_id из URL или localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get("vk_user_id") || urlParams.get("user_id");
    if (!userId) {
      userId = localStorage.getItem("vk_user_id") || localStorage.getItem("user_id");
    }
    if (!userId) return;

    fetch(`/api/autoposter/my?user_id=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        console.log("📥 /my response:", data);
        if (data.client_id) {
          console.log("✅ Auto client_id from /my:", data.client_id);
          setClientIdState(String(data.client_id));
        } else {
          console.error("❌ Нет подключённого Криэйтора для user_id:", userId);
        }
      })
      .catch((err) => console.error("❌ /my error:", err));
  }, [clientIdState]);

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [sourceType, setSourceType] = useState<"donor" | "themes" | "ai">("donor");
  const [donors, setDonors] = useState("");
  const [themes, setThemes] = useState("");
  const [description, setDescription] = useState("");
  const [signature, setSignature] = useState("");
  const [postsPerDay, setPostsPerDay] = useState(1);
  const [mirror, setMirror] = useState(false);

  const times = Array.from({ length: postsPerDay }, (_, i) => {
    const h = postsPerDay === 1 ? 10 : Math.round(8 + (i * 14) / (postsPerDay - 1));
    return `${String(h).padStart(2, "0")}:00`;
  });
  const schedule = JSON.stringify({ per_day: postsPerDay, times, mirror });
  const [tariff, setTariff] = useState("start");

  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/autoposter/client/${clientId}`)
      .then((r) => r.json())
      .then((data) => { 
        console.log("📥 API response:", data);
        if (data.ok) {
          console.log("✅ Client loaded:", data.client?.id, "groups:", data.client?.groups?.length);
          setClient(data.client);
        } else {
          console.error("❌ API error:", data.error);
        }
      })
      .catch((err) => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, [clientId]);

  const validate = (): string | null => {
    if (!selectedGroup) return "Выберите группу (шаг 1)";
    if (sourceType === "donor" && !donors.trim()) return "Укажите хотя бы одну группу-донор (шаг 2)";
    if (sourceType === "themes" && !themes.trim()) return "Напишите хотя бы одну тему (шаг 2)";
    if (sourceType === "ai" && !description.trim()) return "Опишите, о чём ваша группа (шаг 2)";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { alert(err); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/autoposter/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          group_id: selectedGroup,
          source_type: sourceType,
          donors, themes, description, signature,
          schedule, tariff,
        }),
      });
      const data = await res.json();
      if (data.ok) setSuccess(true);
      else alert(data.error || "Ошибка сохранения");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="max-w-2xl mx-auto mt-20 text-center text-gray-500">Загружаем ваши группы...</div>;

  const sched = (() => { try { return JSON.parse(schedule); } catch { return { per_day: 1, times: ["10:00"] }; } })();
  const planInfo = { start: { name: "Старт", price: 900 }, business: { name: "Бизнес", price: 1500 }, premium: { name: "Премиум", price: 2500 } }[tariff as "start"] || { name: "Старт", price: 900 };

  const handlePay = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/autoposter/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, tariff }),
      });
      const data = await res.json();
      if (data.ok && data.url) window.location.href = data.url;
      else alert(data.error || "Не удалось создать платёж");
    } finally { setSaving(false); }
  };

  if (success) return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900 text-center">
      <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-bold mb-2">Настройка сохранена!</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1 text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <p><b>Тариф:</b> {planInfo.name} — {planInfo.price}₽/мес</p>
        <p><b>Постов в день:</b> {sched.per_day}</p>
        <p><b>Время выхода:</b> {sched.times.join(", ")}</p>
        {sched.mirror && <p><b>Зеркальный режим:</b> включён</p>}
      </div>
      <button onClick={handlePay} disabled={saving}
        className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors mb-3">
        {saving ? "Создаём платёж..." : `Оплатить ${planInfo.price}₽ →`}
      </button>
      <p className="text-xs text-gray-400">Оплата через ЮKassa: карты, СБП, SberPay. Постинг начнётся сразу после оплаты.</p>
    </div>
  );

  const stepTitle = "text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3";
  const stepNum = "w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold shrink-0";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Настройка Нейро-Криэйтор</h1>

      {/* ШАГ 1: ГРУППА */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className={stepTitle}><span className={stepNum}>1</span> Куда постим?</h2>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {client?.groups.map((group: any) => (
            <label key={group.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedGroup === group.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
              <input type="radio" name="group" checked={selectedGroup === group.id} onChange={() => setSelectedGroup(group.id)} className="w-5 h-5 text-brand-600" />
              <span className="font-medium text-gray-900 dark:text-white">{group.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 🎁 БАННЕР: ПЕРВЫЙ ПОСТ БЕСПЛАТНО */}
      {client?.tariff === 'demo' && (
        <div className="rounded-2xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 flex items-start gap-3 mb-4">
          <span className="text-3xl">🎁</span>
          <div>
            <div className="font-bold text-green-800 dark:text-green-300 text-base mb-1">
              Первый пост — БЕСПЛАТНО!
            </div>
            <div className="text-sm text-green-700 dark:text-green-400">
              Настройте источник и расписание — через 15 минут ИИ опубликует первый пост в вашей группе.
              Понравится? Оплатите и Криэйтор продолжит работать каждый день 🚀
            </div>
          </div>
        </div>
      )}

      {/* ⚡ КНОПКА: ОПУБЛИКОВАТЬ СЕЙЧАС */}
      {client?.tariff === 'demo' && (
        <div className="mb-4">
          <button
            onClick={async () => {
              const res = await fetch("/api/autoposter/publish_now", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_id: clientId })
              });
              const data = await res.json();
              alert(data.ok ? data.message : data.error);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-base hover:opacity-90 transition-all"
          >
            ⚡ Опубликовать первый пост СЕЙЧАС
          </button>
        </div>
      )}

      {/* ШАГ 2: КОНТЕНТ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className={stepTitle}><span className={stepNum}>2</span> Откуда берём идеи постов?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "donor" ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-200 dark:border-gray-700"}`}>
            <input type="radio" className="sr-only" checked={sourceType === "donor"} onChange={() => setSourceType("donor")} />
            <svg className="w-6 h-6 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <div className="font-bold text-gray-900 dark:text-white text-sm">Группы-доноры</div>
            <div className="text-xs text-gray-500 mt-1">Берём посты из чужих групп. DeepSeek делает рерайт — пост становится уникальным, без ссылок и рекламы донора. Ниже можно включить <b>зеркало</b> (постим сразу как у донора) или постить по расписанию.</div>
          </label>
          <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "themes" ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-200 dark:border-gray-700"}`}>
            <input type="radio" className="sr-only" checked={sourceType === "themes"} onChange={() => setSourceType("themes")} />
            <svg className="w-6 h-6 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 17.036H3v-3.572L16.732 3.732z" /></svg>
            <div className="font-bold text-gray-900 dark:text-white text-sm">Мои темы</div>
            <div className="text-xs text-gray-500 mt-1">Вы пишете список тем на неделю — DeepSeek сам напишет и сгенерирует посты. Темы можно менять в любой момент.</div>
          </label>
          <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${sourceType === "ai" ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-200 dark:border-gray-700"}`}>
            <input type="radio" className="sr-only" checked={sourceType === "ai"} onChange={() => setSourceType("ai")} />
            <svg className="w-6 h-6 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            <div className="font-bold text-gray-900 dark:text-white text-sm">Придумай за меня</div>
            <div className="text-xs text-gray-500 mt-1">Опишите о чём ваша группа — DeepSeek сам подберёт интересные темы и будет писать посты.</div>
          </label>
        </div>

        {sourceType === "donor" && (
          <textarea value={donors} onChange={(e) => setDonors(e.target.value)} rows={3}
            placeholder={"Ссылки на группы-доноры, каждая с новой строки:\nhttps://vk.com/example_group1\nhttps://vk.com/example_group2"}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
        )}
        {sourceType === "themes" && (
          <textarea value={themes} onChange={(e) => setThemes(e.target.value)} rows={3}
            placeholder={"Темы постов, каждая с новой строки:\nУтренний маникюр со скидкой\nИдеи дизайна на осень\nКак ухаживать за ногтями зимой"}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
        )}
        {sourceType === "ai" && (
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            placeholder="Опишите вашу группу: тематика, город, аудитория. Например: салон красоты в Коломне, маникюр и брови, аудитория — женщины 20-45 лет"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
        )}
        <p className="mt-2 text-xs text-gray-400">Из донорских постов автоматически удаляются ссылки, названия чужих групп и реклама — в вашу группу попадает только чистая идея.</p>
      </div>

      {/* ШАГ 3: ПОДПИСЬ И РАСПИСАНИЕ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className={stepTitle}><span className={stepNum}>3</span> Подпись и расписание</h2>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ваша подпись (добавляется к каждому посту, необязательно)</label>
        <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)}
          placeholder="Например: Салон «Лилия» | Коломна | Запись в ЛС"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4" />
        {!mirror && (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сколько постов в день?</label>
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setPostsPerDay(Math.max(1, postsPerDay - 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200">−</button>
              <span className="text-2xl font-bold text-gray-900 dark:text-white w-24 text-center">{postsPerDay} в день</span>
              <button onClick={() => setPostsPerDay(Math.min(10, postsPerDay + 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200">+</button>
            </div>
          </>
        )}

        {sourceType === "donor" && (
          <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer mb-4">
            <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} className="w-5 h-5 text-brand-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              <b>🪞 Зеркальный режим:</b> пост выходит у вас сразу, как только появится у донора. Только новые посты — старые и закреплённые не берутся. Реклама донора фильтруется. Если донор не постит — и у вас нет поста.
            </span>
          </label>
        )}

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Время публикаций (система распределит автоматически):</label>
        <p className="text-xs text-gray-500 mb-3">💡 Если к указанному времени свежих постов нет — пост будет пропущен. Повторов не будет.</p>
        <div className="flex gap-2 flex-wrap">
          {times.map((t) => (
            <span key={t} className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white">{t}</span>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Время распределяется равномерно в течение дня и сохраняется. Изменить можно в любой момент в личном кабинете.</p>
      </div>

      {/* ШАГ 4: ТАРИФ */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className={stepTitle}><span className={stepNum}>4</span> Тариф</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "start", name: "Старт", price: "900₽", posts: 30 },
            { id: "business", name: "Бизнес", price: "1 500₽", posts: 60, featured: true },
            { id: "premium", name: "Премиум", price: "2 500₽", posts: 90 },
          ].map((t) => (
            <label key={t.id} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${tariff === t.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-gray-200 dark:border-gray-700"} ${t.featured ? "shadow-lg" : ""}`}>
              <input type="radio" className="sr-only" checked={tariff === t.id} onChange={() => setTariff(t.id)} />
              {t.featured && <div className="text-xs font-bold text-brand-600 uppercase mb-1">Популярный</div>}
              <div className="font-bold text-gray-900 dark:text-white">{t.name}</div>
              <div className="text-2xl font-bold text-brand-600 my-1">{t.price}</div>
              <div className="text-sm text-gray-500">{t.posts} постов/мес</div>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full bg-brand-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-600 disabled:bg-gray-300 transition-colors">
        {saving ? "Сохраняем..." : "Завершить настройку →"}
      </button>
    </div>
  );
};

export default Setup;
