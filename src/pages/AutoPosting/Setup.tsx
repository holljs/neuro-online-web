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
  const [refMode, setRefMode] = useState<string>("product");
  const [references, setReferences] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/autoposter/client/${clientId}`)
      .then((r) => r.json())
      .then((data) => { 
        console.log("📥 API response:", data);
        if (data.ok) {
          console.log("✅ Client loaded:", data.client?.id, "groups:", data.client?.groups?.length);
          setClient(data.client);
          const cfg = data.client?.source_config;
          if (cfg) {
            const parsed = typeof cfg === "string" ? JSON.parse(cfg) : cfg;
            setReferences(parsed.references || []);
            if (parsed.reference_mode) setRefMode(parsed.reference_mode); else if (parsed.reference_type) setRefMode(parsed.reference_type);
          }
        } else {
          console.error("❌ API error:", data.error);
        }
      })
      .catch((err) => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, [clientId]);

  // 🎨 ГАЛЕРЕЯ ГОТОВЫХ СТИЛЕЙ
  const stylePresets = [
    {
      name: "Пиццерия",
      emoji: "🍕",
      type: "food" as const,
      refs: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
        "https://images.unsplash.com/photo-1513104890138-7c749659a76d?w=800"
      ]
    },
    {
      name: "Кофейня",
      emoji: "☕",
      type: "food" as const,
      refs: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "https://images.unsplash.com/photo-1511925385224-e3a924337419?w=800",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
      ]
    },
    {
      name: "Магазин одежды",
      emoji: "👗",
      type: "product" as const,
      refs: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800"
      ]
    },
    {
      name: "Салон красоты",
      emoji: "💅",
      type: "service" as const,
      refs: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        "https://images.unsplash.com/photo-1595476193005-62a62c7091e0?w=800"
      ]
    },
    {
      name: "Фитнес-клуб",
      emoji: "💪",
      type: "service" as const,
      refs: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800"
      ]
    }
  ];

  const applyStylePreset = async (preset: typeof stylePresets[0]) => {
    if (!canChangeRefs) {
      alert(`Менять стили можно раз в 7 дней. Осталось ${daysUntilChange} дн.`);
      return;
    }
    if (!confirm(`Применить стиль "${preset.name}"? Будут загружены ${preset.refs.length} референса.`)) return;
    
    setUploading(true);
    setRefMode(preset.type);
    try {
      // Удаляем старые референсы если есть
      for (let i = references.length - 1; i >= 0; i--) {
        await fetch("/api/autoposter/remove_reference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client_id: clientId, index: i }),
        });
      }
      // Загружаем новые
      let newRefs: any[] = [];
      for (const url of preset.refs) {
        const res = await fetch("/api/autoposter/add_reference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client_id: clientId, image_url: url, ref_type: preset.type }),
        });
        const data = await res.json();
        if (data.ok) newRefs = data.references;
      }
      setReferences(newRefs);
      if (client) setClient({ ...client, last_refs_update: new Date().toISOString() });
      alert(`✅ Стиль "${preset.name}" применён!`);
    } catch (e) {
      alert("Ошибка: " + e);
    } finally {
      setUploading(false);
    }
  };

  const uploadRef = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (!upData.ok) { alert(upData.error || "Ошибка загрузки"); return; }
      const res = await fetch("/api/autoposter/add_reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, image_url: upData.url, ref_type: refType }),
      });
      const data = await res.json();
      if (data.ok) {
        setReferences(data.references);
        // Обновим last_refs_update в client
        if (client) setClient({ ...client, last_refs_update: new Date().toISOString() });
      } else {
        alert(data.error || "Ошибка добавления референса");
      }
    } catch (e) {
      alert("Ошибка: " + e);
    } finally { setUploading(false); }
  };

  const removeRef = async (idx: number) => {
    if (!confirm("Удалить референс?")) return;
    const res = await fetch("/api/autoposter/remove_reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, index: idx }),
    });
    const data = await res.json();
    if (data.ok) setReferences(data.references);
    else alert(data.error);
  };

  const toggleRef = async (idx: number) => {
    const res = await fetch("/api/autoposter/toggle_reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, index: idx }),
    });
    const data = await res.json();
    if (data.ok) setReferences(data.references);
    else alert(data.error);
  };

  const setMode = async (mode: string) => {
    setRefMode(mode);
    try {
      await fetch("/api/autoposter/set_reference_mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, mode }),
      });
    } catch (e) { console.error(e); }
  };

  const canChangeRefs = (() => {
    if (tariff === "premium") return true;
    if (!client?.last_refs_update) return true;
    const last = new Date(client.last_refs_update);
    const diff = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 7;
  })();

  const daysUntilChange = (() => {
    if (tariff === "premium" || !client?.last_refs_update) return 0;
    const last = new Date(client.last_refs_update);
    const diff = 7 - (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(diff));
  })();

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

      {/* ШАГ 2.5: РЕФЕРЕНСЫ */}
      {client?.tariff !== "demo" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className={stepTitle}>
              <span className={stepNum}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              Визуальный стиль ваших постов
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-brand-600">{references.length}</span>
              <span className="mx-1">/</span>
              <span>{tariff === "premium" ? 10 : tariff === "business" ? 7 : 5}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Загрузите фото ваших товаров или интерьера. ИИ будет генерировать посты с вашими товарами в новых красивых сценах.
          </p>

          {/* Режим генерации — 4 понятные кнопки */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {[
              { id: "keep", label: "Как есть", hint: "Товар останется точно как на фото, ИИ только улучшит качество" },
              { id: "food", label: "Еда", hint: "Блюда в новых аппетитных сценах" },
              { id: "product", label: "Товары", hint: "Товары в новых студийных сценах" },
              { id: "service", label: "Услуги", hint: "Интерьер и атмосфера в новых сценах" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                title={t.hint}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  refMode === t.id
                    ? "bg-brand-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 -mt-2">
            {refMode === "keep"
              ? "Режим «Как есть»: карточки товаров останутся точь-в-точь как на ваших фото."
              : "Режим «Новые сцены»: ИИ будет показывать ваши товары в новых красивых обстановках."}
          </div>

          {/* 🎨 ГАЛЕРЕЯ ГОТОВЫХ СТИЛЕЙ */}
          {canChangeRefs && references.length === 0 && (
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <div className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Готовые стили — примените одним кликом
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {stylePresets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyStylePreset(preset)}
                    disabled={uploading}
                    className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 border border-gray-200 dark:border-gray-700 hover:border-brand-500 transition-all text-left disabled:opacity-50"
                  >
                    <div className="text-2xl mb-1">{preset.emoji}</div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{preset.refs.length} референса</div>
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">Или загрузите свои фото ниже</div>
            </div>
          )}

          {/* Список референсов */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {references.map((ref, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-brand-500 transition-all">
                <div className="aspect-square relative">
                  <img src={ref.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeRef(i)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg"
                    title="Удалить референс (можно в любой момент)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 min-h-[2.5rem] mb-2" title={ref.description}>
                    {ref.description || "Описание будет добавлено..."}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Использован: <b className="text-brand-600 dark:text-brand-400">{ref.used || 0}</b> раз</span>
                  </div>
                </div>
              </div>
            ))}
            {canChangeRefs && references.length < (tariff === "premium" ? 10 : tariff === "business" ? 7 : 5) && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && uploadRef(e.target.files[0])}
                />
                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-500">{uploading ? "Загрузка..." : "Добавить"}</span>
              </label>
            )}
          </div>

          {/* Информация и ограничения */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="mb-1"><b>«Как есть»</b> — карточки товаров точь-в-точь как на фото, ИИ только улучшит свет и качество.</div>
                <div className="mb-1"><b>«Еда / Товары / Услуги»</b> — ИИ покажет ваши товары в новых красивых сценах.</div>
                <div>Режим один для всех референсов — выбирается кнопками выше.</div>
              </div>
            </div>
            
            {/* Блокировка смены + прогресс использования */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className={`p-3 rounded-lg text-xs ${!canChangeRefs ? "bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300" : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"}`}>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {canChangeRefs ? "Можно добавлять стили" : "Добавление новых заблокировано"}
                </div>
                {!canChangeRefs ? (
                  <div>Новые можно добавить через <b>{daysUntilChange} дн.</b> Удалять — можно всегда.
                    {tariff !== "premium" && <span className="block mt-0.5 opacity-80">💎 Премиум — без ограничений</span>}
                  </div>
                ) : (
                  <div>Добавляйте новые референсы и готовые стили</div>
                )}
              </div>
              
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Использование референсов
                </div>
                <div>ИИ берёт референсы по очереди (у кого меньше использований). Когда все будут использованы — цикл начнётся заново.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ДЕМО: первый пост бесплатно */}      {/* ДЕМО: первый пост бесплатно */}
      {client?.tariff === 'demo' && (
        <div className="rounded-2xl border border-brand-500 bg-brand-50 dark:bg-brand-900/20 p-5 flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white text-base mb-1">Первый пост — бесплатно</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Заполните шаги 1–3 и нажмите кнопку — настройка сохранится, и ИИ сразу опубликует первый пост.
              Понравится результат? Оплатите тариф ниже, и Криэйтор продолжит работать каждый день.
            </div>
          </div>
        </div>
      )}

      {client?.tariff === 'demo' && (
        <button
          onClick={async () => {
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
              if (!data.ok) { alert(data.error || "Ошибка сохранения"); return; }
              const res2 = await fetch("/api/autoposter/publish_now", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_id: clientId }),
              });
              const data2 = await res2.json();
              alert(data2.ok ? "Настройка сохранена! " + data2.message : data2.error);
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {saving ? "Сохраняем и публикуем..." : "Сохранить и опубликовать первый пост"}
        </button>
      )}

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
