import React, { useState, useEffect } from "react";
import axios from "axios";
import bridge from "@vkontakte/vk-bridge";

const loaderStyles = `
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.01); } }
.animate-shimmer { background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%); background-size: 200% 100%; animation: shimmer 2s infinite linear; }
.dark .animate-shimmer { background: linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%); background-size: 200% 100%; }
.animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
.spin-mini { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const API_BASE = "/api";
const BOT_TOKEN = "SuperSecret_987654321_Token";

type CategoryType = "photo" | "video" | "audio" | "business";
type HistoryItem = {
    id: string;
    modeName: string;
    prompt: string;
    date: string;
    images: string[];
    resultUrl?: string;
};

export default function NeuroArtist() {
    const [activeCategory, setActiveCategory] = useState<CategoryType>("photo");
    const [activeMode, setActiveMode] = useState<string>("t2i");
    const [prompt, setPrompt] = useState("");
    const [stylePrompt, setStylePrompt] = useState("Романтичный Поп");
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [currentResultUrl, setCurrentResultUrl] = useState<string | null>(null);
    const [modalMedia, setModalMedia] = useState<string | null>(null);
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);

    // 🔥 НОВОЕ: БОНУС ЗА ПОДПИСКУ
    const [bonusClaimed, setBonusClaimed] = useState<boolean>(() => {
        const savedId = localStorage.getItem("user_id");
        if (savedId) return localStorage.getItem(`bonus_claimed_${savedId}`) === 'true';
        return false;
    });
    const [isBonusLoading, setIsBonusLoading] = useState(false);

    useEffect(() => {
        bridge.send("VKWebAppInit").catch((err) => {
            console.log("Запуск вне VK Mini App:", err);
        });
    }, []);

    const getUserId = (): number | null => {
        const savedId = localStorage.getItem("user_id");
        const urlParams = new URLSearchParams(window.location.search);
        const idFromUrl = urlParams.get("user_id") || urlParams.get("vk_user_id");
        if (savedId && savedId !== "null" && savedId !== "undefined" && savedId.trim() !== "") {
            return parseInt(savedId, 10);
        } else if (idFromUrl && idFromUrl !== "null" && idFromUrl !== "undefined" && idFromUrl.trim() !== "") {
            localStorage.setItem("user_id", idFromUrl);
            localStorage.setItem("vk_user_id", idFromUrl);
            return parseInt(idFromUrl, 10);
        }
        return null;
    };

    const userId = getUserId();

        useEffect(() => {
        if (userId) {
            if (localStorage.getItem(`bonus_claimed_${userId}`) === 'true') {
                setBonusClaimed(true);
                return;
            }
            // Спрашиваем сервер: если бонус уже получен через бота — прячем кнопку
            axios.get(`${API_BASE}/bonus_status/${userId}`)
                .then((res) => { if (res.data.claimed) setBonusClaimed(true); })
                .catch(() => {});
        }
    }, [userId]);

    const [history, setHistory] = useState<HistoryItem[]>(() => {
        try {
            const saved = localStorage.getItem("neuro_artist_history");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const loadLatestServerHistory = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_BASE}/history/${userId}?limit=1&_t=${Date.now()}`);
            if (res.data.success && res.data.items && res.data.items.length > 0) {
                const lastItem = res.data.items[0];
                const serverHistoryItem: HistoryItem = {
                    id: String(lastItem.id),
                    modeName: lastItem.model || "Генерация",
                    prompt: lastItem.prompt || "Без текста",
                    date: lastItem.created_at ? new Date(lastItem.created_at).toLocaleDateString("ru-RU") : "Недавно",
                    images: [],
                    resultUrl: lastItem.result_url,
                };
                setHistory((prev) => {
                    if (prev.length > 0 && prev[0].id === serverHistoryItem.id) return prev;
                    return [serverHistoryItem, ...prev];
                });
            }
        } catch (e) {
            console.error("Ошибка синхронизации последней генерации:", e);
        }
    };

    useEffect(() => {
        if (userId) loadLatestServerHistory();
    }, [userId]);

    useEffect(() => {
        try {
            localStorage.setItem("neuro_artist_history", JSON.stringify(history));
        } catch (e) {
            console.error("Ошибка сохранения истории:", e);
        }
    }, [history]);

    // 🔥 ОБНОВЛЕНО: НАЗВАНИЯ И ЦЕНЫ
    const modesByCategory = {
        photo: [
            { id: "t2i", name: "Люкс-Фото", cost: "4 кр.", desc: "Премиум генерация шедевров и графики с нуля или по фото" },
            { id: "vip_mix", name: "Реал-Фото", cost: "3 кр.", desc: "Точное сохранение лиц и внешности" },
            { id: "seadream_mix", name: "Пиар-Фото", cost: "4 кр.", desc: "Постеры, баннеры и рекламный дизайн" }, 
            { id: "ultra_photo", name: "Ультра-Реал", cost: "5 кр.", desc: "Премиум-реализм и русский текст" },
            { id: "gfpgan", name: "Реставратор", cost: "3 кр.", desc: "Повышение четкости и удаление шума" },
        ],
        video: [
            { id: "i2v", name: "Живое Фото", cost: "3 кр.", desc: "Анимация и оживление портрета" },
            { id: "bytedance_5", name: "ИИ-Режиссер (5 сек)", cost: "30 кр.", desc: "Видеоролик с нативным звуком" },
            { id: "bytedance_10", name: "ИИ-Режиссер (10 сек)", cost: "50 кр.", desc: "Длинный клип с эффектами" },
        ],
        audio: [
            { id: "music", name: "Нейро-Музыка", cost: "2 кр.", desc: "Создание песни с вокалом по тексту" },
            { id: "tts", name: "Озвучка текста", cost: "1 кр.", desc: "Превращение текста в красивую речь" },
        ],
        business: [
            { id: "wb_card", name: "Карточка WB / Ozon", cost: "4 кр.", desc: "Продающий баннер товара" },
            { id: "fashion", name: "Одежда на модели", cost: "4 кр.", desc: "Примерка на человека" },
            { id: "food", name: "Фуд-съемка", cost: "4 кр.", desc: "Мишлен-подача и коллажи" },
            { id: "furniture", name: "Интерьер и мебель", cost: "4 кр.", desc: "3D-визуализация комнат" },
        ],
    };

    const currentModes = modesByCategory[activeCategory];
    const [rawFiles, setRawFiles] = useState<File[]>([]);

    useEffect(() => {
        return () => {
            selectedImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [selectedImages]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setRawFiles((prev) => [...prev, ...filesArray]);
            const newImages = filesArray.map((file) => URL.createObjectURL(file));
            setSelectedImages((prev) => [...prev, ...newImages]);
        }
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(selectedImages[index]);
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setRawFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const isVideoUrl = (url: string) => url.includes(".mp4") || url.includes("video") || url.includes(".mov");
    const isAudioUrl = (url: string) => url.includes(".mp3") || url.includes(".wav") || url.includes("audio");

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
    };

    // 🔥 НОВОЕ: ФУНКЦИЯ ПОЛУЧЕНИЯ БОНУСА
    const handleClaimBonus = async () => {
        if (!userId) {
            alert("🔒 Пожалуйста, авторизуйтесь через ВКонтакте!");
            return;
        }
        
        try {
            setIsBonusLoading(true);
            const GROUP_ID = 191367447;
            
                        try {
                // ⏱ Таймаут 2.5 сек: вне ВК bridge может висеть вечно — не даём кнопке зависнуть
                const bridgeResponse: any = await Promise.race([
                    bridge.send("VKWebAppAllowMessagesFromGroup", { group_id: GROUP_ID }),
                    new Promise((resolve) => setTimeout(() => resolve({ result: true }), 2500)),
                ]);
                if (bridgeResponse && bridgeResponse.result === false) {
                    alert("Вы отменили разрешение. Чтобы получить бонус, нужно разрешить сообщения от сообщества.");
                    setIsBonusLoading(false);
                    return;
                }
            } catch (bridgeErr) {
                console.log("VK Bridge недоступен или уже разрешено", bridgeErr);
            }
            
            const response = await axios.post(
                `${API_BASE}/bonus`,
                { user_id: userId },
                { headers: { "X-Bot-Token": BOT_TOKEN } }
            );
            
            if (response.data.success) {
                alert("🎉 Вам начислено 3 кредита! Теперь вы будете получать наши новости и акции в личные сообщения.");
                setBonusClaimed(true);
                if (userId) localStorage.setItem(`bonus_claimed_${userId}`, 'true');
            }
        } catch (e: any) {
            if (e.response?.status === 400) {
                alert("Вы уже получали этот бонус ранее!");
                setBonusClaimed(true);
                if (userId) localStorage.setItem(`bonus_claimed_${userId}`, 'true');
            } else {
                alert("Ошибка: " + (e.response?.data?.detail || "Не удалось получить бонус"));
            }
        } finally {
            setIsBonusLoading(false);
        }
    };

    const uploadImagesToServer = async (files: File[]): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append("user_id", String(userId));
            formData.append("file", file);
            try {
                const res = await axios.post(`${API_BASE}/upload`, formData, {
                    headers: { "X-Bot-Token": BOT_TOKEN, "Content-Type": "multipart/form-data" },
                });
                if (res.data.success && res.data.url) {
                    uploadedUrls.push(res.data.url);
                }
            } catch (e) {
                console.error("Ошибка загрузки файла:", file.name, e);
            }
        }
        return uploadedUrls;
    };

    const checkStatus = async (
        taskId: string,
        modeObjName: string,
        imageUrls: string[],
        currentPrompt: string,
        attemptCount = 0
    ) => {
        if (!userId) return;
        if (attemptCount > 100) {
            alert("⏳ Генерация занимает больше времени, чем обычно. Пожалуйста, проверьте результат чуть позже в разделе «История».");
            setIsGenerating(false);
            return;
        }
        try {
            const res = await axios.get(`${API_BASE}/task_status/${taskId}?user_id=${userId}`, {
                headers: { "X-Bot-Token": BOT_TOKEN },
            });
            if (res.data.status === "ready" && res.data.result_url) {
                const finalUrl = res.data.result_url;
                setCurrentResultUrl(finalUrl);
                setIsGenerating(false);
                setPrompt("");
                selectedImages.forEach((url) => URL.revokeObjectURL(url));
                setSelectedImages([]);
                setRawFiles([]);
                const newItem: HistoryItem = {
                    id: taskId,
                    modeName: modeObjName,
                    prompt: currentPrompt || "Генерация медиа",
                    date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
                    images: imageUrls.length > 0 ? imageUrls : selectedImages,
                    resultUrl: finalUrl,
                };
                setHistory((prev) => [newItem, ...prev]);
                setTimeout(loadLatestServerHistory, 1000);
            } else if (res.data.success === false) {
                alert("Ошибка генерации: " + (res.data.error || "Неизвестная ошибка"));
                setIsGenerating(false);
            } else {
                setTimeout(() => checkStatus(taskId, modeObjName, imageUrls, currentPrompt, attemptCount + 1), 3000);
            }
        } catch (e) {
            console.error("Ошибка проверки статуса:", e);
            setTimeout(() => checkStatus(taskId, modeObjName, imageUrls, currentPrompt, attemptCount + 1), 4000);
        }
    };

    const handleGenerate = async () => {
        if (!userId) {
            alert("🔒 Пожалуйста, авторизуйтесь через ВКонтакте, чтобы использовать генерации!");
            return;
        }
        if (!prompt.trim() && activeMode !== "gfpgan" && activeMode !== "t2i" && selectedImages.length === 0) return;
        
        setIsGenerating(true);
        setCurrentResultUrl(null);
        const currentModeObj = currentModes.find((m) => m.id === activeMode);
        const modeName = currentModeObj?.name || "Генерация";
        const promptBackup = prompt;
        try {
            const serverImageUrls = await uploadImagesToServer(rawFiles);
            const payload: any = {
                user_id: userId,
                model: activeMode,
                prompt: prompt || "",
                image_urls: serverImageUrls,
            };
            if (activeMode === "music") {
                payload.lyrics = prompt;
                payload.style_prompt = stylePrompt;
            }
            const response = await axios.post(`${API_BASE}/generate`, payload, {
                headers: { "X-Bot-Token": BOT_TOKEN },
            });
            if (response.data.success && response.data.task_id) {
                checkStatus(response.data.task_id, modeName, serverImageUrls, promptBackup, 0);
            } else {
                alert("Не удалось создать задачу на сервере");
                setIsGenerating(false);
            }
        } catch (e: any) {
            console.error("Ошибка генерации:", e);
            alert(e.response?.data?.detail || "Ошибка подключения к бэкенду или недостаточно кредитов.");
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <style>{loaderStyles}</style>
            {modalMedia && (
                <div className="fixed inset-0 z-[999999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer" onClick={() => setModalMedia(null)}>
                    <div className="relative max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl flex items-center justify-center">
                        {isVideoUrl(modalMedia) ? (
                            <video src={modalMedia} controls autoPlay className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" />
                        ) : (
                            <img src={modalMedia} alt="Во весь экран" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
                        )}
                        <button onClick={() => setModalMedia(null)} className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-base transition shadow-lg border border-white/20">✕</button>
                    </div>
                </div>
            )}
            <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Студия генерации</h2>
                    <p className="text-sm text-gray-500 mb-6">Выберите категорию, режим и настройте параметры запроса.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
                        {[{ id: "photo", label: "Фото и Арт" }, { id: "video", label: "Видео" }, { id: "audio", label: "Музыка и Звук" }, { id: "business", label: "Для Бизнеса" }].map((cat) => (
                            <button key={cat.id} onClick={() => { setActiveCategory(cat.id as CategoryType); setActiveMode(modesByCategory[cat.id as CategoryType][0].id); }} className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition ${activeCategory === cat.id ? "bg-blue-600 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"} cursor-pointer`}>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                        {currentModes.map((mode) => (
                            <button key={mode.id} onClick={() => setActiveMode(mode.id)} className={`p-4 rounded-xl border text-left transition ${activeMode === mode.id ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800 hover:border-gray-300"} cursor-pointer`}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{mode.name}</span>
                                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{mode.cost}</span>
                                </div>
                                <p className="text-xs text-gray-500">{mode.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4 shadow-sm">
                    {["vip_mix", "seadream_mix", "ultra_photo", "gfpgan", "i2v", "wb_card", "fashion", "food", "furniture", "t2i"].includes(activeMode) && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Прикрепить изображения</label>
                            {selectedImages.length === 0 ? (
                                <label className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition bg-gray-50/50 dark:bg-gray-800/30 block">
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Нажмите, чтобы прикрепить файлы, или перетащите их сюда</p>
                                    <p className="text-xs text-gray-400 mt-1">Поддерживаются JPG, PNG, WEBP</p>
                                </label>
                            ) : (
                                <div className="flex flex-wrap gap-3 items-center">
                                    {selectedImages.map((src, index) => (
                                        <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group">
                                            <img src={src} alt="Загруженное" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition shadow-md cursor-pointer">✕</button>
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-400/60 dark:border-blue-500/40 hover:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 flex flex-col items-center justify-center cursor-pointer transition text-blue-600 dark:text-blue-400 hover:scale-105">
                                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        <span className="text-xl font-bold leading-none mb-0.5">+</span>
                                        <span className="text-[10px] font-semibold">Ещё</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                    {activeMode === "music" && (
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase">Стиль музыки (выберите или введите свой)</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <select onChange={(e) => setStylePrompt(e.target.value)} className="w-full sm:w-1/2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500">
                                    <option value="" className="dark:bg-gray-900">Готовые пресеты...</option>
                                    <option value="Романтичный Поп" className="dark:bg-gray-900">Романтичный Поп</option>
                                    <option value="Эпичный Рок" className="dark:bg-gray-900">Эпичный Рок</option>
                                    <option value="Хип-Хоп и Рэп" className="dark:bg-gray-900">Хип-Хоп / Рэп</option>
                                    <option value="Расслабляющий Джаз" className="dark:bg-gray-900">Расслабляющий Джаз</option>
                                    <option value="Synthwave 80s" className="dark:bg-gray-900">Synthwave 80s</option>
                                    <option value="Кинематографичный Оркестр" className="dark:bg-gray-900">Кинематографичный</option>
                                </select>
                                <input type="text" value={stylePrompt} onChange={(e) => setStylePrompt(e.target.value)} placeholder="Свой стиль (например: Lo-Fi, female vocal)" className="w-full sm:w-1/2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    )}
                    {activeMode !== "gfpgan" && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">{activeMode === "music" ? "Текст песни" : activeMode === "tts" ? "Текст для озвучки" : "Текстовое описание (Промпт)"}</label>
                            <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Подробно опишите, что должна создать нейросеть..." className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    )}
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 shadow-md cursor-pointer flex items-center justify-center gap-2.5">
                        {isGenerating ? (
                            <>
                                <svg className="spin-mini h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Магия в процессе...</span>
                            </>
                        ) : (
                            "Запустить генерацию"
                        )}
                    </button>
                </div>

                {(isGenerating || currentResultUrl) && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900 text-center shadow-sm relative overflow-hidden min-h-[300px] sm:min-h-[380px] flex flex-col items-center justify-center">
                        {isGenerating && (
                            <div className="absolute inset-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8 animate-pulse-slow">
                                <div className="w-full max-w-sm h-48 sm:h-64 rounded-2xl animate-shimmer mb-4 sm:mb-6 border border-gray-100 dark:border-gray-800 flex items-center justify-center px-4">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 spin-mini" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1 sm:mb-2">Нейросеть творит магию</h3>
                                <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm leading-normal">Это может занять от пары секунд до 3 минут. Пожалуйста, не закрывайте страницу.</p>
                            </div>
                        )}
                        {currentResultUrl && (
                            <>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 relative z-0">Результат готов</h3>
                                <div className="relative z-0 w-full">
                                    {isVideoUrl(currentResultUrl) ? (
                                        <video src={currentResultUrl} controls autoPlay loop className="mx-auto rounded-xl max-h-[500px] w-full object-contain shadow-lg" />
                                    ) : isAudioUrl(currentResultUrl) ? (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <audio src={currentResultUrl} controls className="w-full mx-auto" />
                                        </div>
                                    ) : (
                                        <img src={currentResultUrl} alt="Результат" onClick={() => setModalMedia(currentResultUrl)} className="mx-auto rounded-xl max-h-[500px] object-contain cursor-pointer hover:opacity-95 transition shadow-lg border border-gray-100 dark:border-gray-800" />
                                    )}
                                </div>
                                <div className="mt-5 relative z-0">
                                    <a href={currentResultUrl} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm cursor-pointer">
                                        <span>Скачать файл</span>
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* 🔥 НОВОЕ: БЛОК БОНУСА ЗА ПОДПИСКУ */}
                {userId && !bonusClaimed && (
                    <div className="rounded-2xl border border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎁</span>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Бонус за подписку</h3>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            Разрешите рассылку от нашего сообщества — и получите <b className="text-green-600 dark:text-green-400">+3 кредита</b> на счёт бесплатно!
                        </p>
                        <button 
                            onClick={handleClaimBonus}
                            disabled={isBonusLoading}
                            className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {isBonusLoading ? "Получаем..." : "Получить +3 кредита 🎉"}
                        </button>
                    </div>
                )}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Последний результат</h3>
                        <a href="/history" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition cursor-pointer">
                            <span>Вся история</span><span>→</span>
                        </a>
                    </div>
                    {history.length === 0 ? (
                        <div className="py-8 text-center text-gray-400 text-xs">
                            <p className="mb-1 text-sm font-semibold text-gray-500">История пуста</p>
                            <p>Создайте вашу первую картинку, видео или трек!</p>
                        </div>
                    ) : (
                        (() => {
                            const item = history[0];
                            const isLongPrompt = item.prompt && item.prompt.length > 100;
                            return (
                                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-3 relative">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{item.modeName}</span>
                                        <span className="text-gray-400 text-[10px]">{item.date}</span>
                                    </div>
                                    <div className="space-y-1.5 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200/80 dark:border-gray-800">
                                        <p className={`text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium ${!isPromptExpanded ? "line-clamp-3" : ""}`}>
                                            "{item.prompt}"
                                        </p>
                                        <div className="flex items-center justify-between pt-1 text-[11px]">
                                            {isLongPrompt && (
                                                <button onClick={() => setIsPromptExpanded(!isPromptExpanded)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-semibold flex items-center gap-1 cursor-pointer">
                                                    <span>{isPromptExpanded ? "Свернуть" : "Развернуть"}</span>
                                                    <span>{isPromptExpanded ? "↑" : "↓"}</span>
                                                </button>
                                            )}
                                            <button onClick={() => handleCopyText(item.prompt)} className="ml-auto font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                                {copiedPrompt ? "✓ Скопировано" : "📋 Скопировать"}
                                            </button>
                                        </div>
                                    </div>
                                    {item.resultUrl && (
                                        <div className="pt-2 space-y-3">
                                            {isVideoUrl(item.resultUrl) ? (
                                                <video src={item.resultUrl} controls className="w-full h-56 object-cover rounded-xl shadow-sm" />
                                            ) : isAudioUrl(item.resultUrl) ? (
                                                <audio src={item.resultUrl} controls className="w-full" />
                                            ) : (
                                                <img src={item.resultUrl} alt="Результат" onClick={() => setModalMedia(item.resultUrl!)} className="w-full h-56 object-cover rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:opacity-95 transition" />
                                            )}
                                            <div className="pt-1">
                                                <a href={item.resultUrl} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                    <span>Скачать результат</span>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()
                    )}
                </div>
            </div>
        </div>
    );
}