import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import bridge from "@vkontakte/vk-bridge";

const API_BASE = "/api/bro";
const BOT_TOKEN = "SuperSecret_987654321_Token";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
};

export default function NeuroBro() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt4o_mini");
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [userId, setUserId] = useState<number>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get("user_id") || urlParams.get("vk_user_id");
    const storedId = localStorage.getItem("user_id");

    if (storedId && storedId !== "null" && storedId !== "undefined") {
      return parseInt(storedId);
    }
    if (idFromUrl && idFromUrl !== "null" && idFromUrl !== "undefined") {
      localStorage.setItem("user_id", idFromUrl);
      localStorage.setItem("vk_user_id", idFromUrl);
      return parseInt(idFromUrl);
    }
    return 233876992;
  });

  useEffect(() => {
    bridge.send("VKWebAppInit").catch((err) => {
      console.log("Запуск вне VK Mini App:", err);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get("user_id") || urlParams.get("vk_user_id");
    const storedId = localStorage.getItem("user_id");

    if (storedId && storedId !== "null" && storedId !== "undefined") {
      setUserId(parseInt(storedId));
    } else if (idFromUrl && idFromUrl !== "null" && idFromUrl !== "undefined") {
      const parsed = parseInt(idFromUrl);
      localStorage.setItem("user_id", String(parsed));
      setUserId(parsed);
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: "gpt4o_mini", name: "Быстрая", cost: "3 ⚡", hint: "Только текст. Не видит фото (3⚡)" },
    { id: "gemini_flash", name: "Думающая", cost: "10 ⚡", hint: "Распознаёт фото и файлы (10⚡)" },
    { id: "gemini_31_pro", name: "Про-кодер", cost: "50 ⚡", hint: "Супер-ИИ: верстает и пишет код (50⚡)" },
  ];

  const personas = [
    { id: "default", name: "Универсальный" },
    { id: "coder", name: "Разработчик" },
    { id: "copywriter", name: "Копирайтер" },
    { id: "tutor", name: "Репетитор" },
    { id: "psychologist", name: "Психолог" },
    { id: "hr", name: "HR-Эксперт" },
    { id: "language_coach", name: "Английский" },
    { id: "health", name: "ЗОЖ-Наставник" },
    { id: "strategist", name: "Бизнес-Стратег" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/history?user_id=${userId}`, {
          headers: { "X-Bot-Token": BOT_TOKEN },
        });
        if (res.data.success && res.data.history) {
          setMessages(res.data.history);
        }
      } catch (e) {
        console.error("Ошибка загрузки истории:", e);
      }
    };
    fetchHistory();
  }, [userId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAttachedPreview(reader.result);
      }
    };
    reader.onerror = () => {
      alert("Не удалось прочитать файл изображения.");
    };
  };

  const executeClearHistory = async () => {
    if (!userId) return;
    setIsClearing(true);
    try {
      await axios.post(
        `${API_BASE}/chat/clear`,
        { user_id: userId, prompt: "clear" },
        { headers: { "X-Bot-Token": BOT_TOKEN } }
      );
      setMessages([]);
      setShowConfirmModal(false);
    } catch (e) {
      console.error("Ошибка очистки чата:", e);
      setMessages([]);
      setShowConfirmModal(false);
    } finally {
      setIsClearing(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputPrompt.trim() && !attachedPreview) || !userId) return;

    const userText = inputPrompt;
    setInputPrompt("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText, imageUrl: attachedPreview || undefined },
    ]);

    setIsLoading(true);
    const attachments: string[] = attachedPreview ? [attachedPreview] : [];
    setAttachedPreview(null);

    try {
      const res = await axios.post(
        `${API_BASE}/chat`,
        {
          user_id: userId,
          prompt: userText,
          model_type: selectedModel,
          persona: selectedPersona,
          attachments: attachments,
        },
        { headers: { "X-Bot-Token": BOT_TOKEN } }
      );

      if (res.data.success && res.data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
      } else {
        alert(res.data.error || "Ошибка получения ответа");
      }
    } catch (e: any) {
      const errDetail = e.response?.data?.detail;
      if (Array.isArray(errDetail)) {
        alert("Ошибка формата данных: " + JSON.stringify(errDetail));
      } else {
        alert(errDetail || "Ошибка связи с сервером");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)] gap-2 sm:gap-3 relative">
      {/* 📱 Компактная верхняя панель (Адаптирована под мобилки) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 dark:border-gray-800 dark:bg-gray-900 flex flex-col gap-2 shadow-sm">
        
        {/* Ряд 1: Кнопки моделей с горизонтальным скроллом */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex-1 sm:flex-none text-center ${
                  selectedModel === m.id
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ряд 2: Выбор Роли + Кнопка Очистки */}
        <div className="flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800/60 pt-1.5">
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-gray-900">
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowConfirmModal(true)}
            title="Очистить память диалога"
            className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition shrink-0 cursor-pointer"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Чат */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-gray-900 overflow-y-auto space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-xs sm:text-sm">
            <p className="font-bold text-gray-700 dark:text-gray-200 text-sm sm:text-base mb-1">
              Нейро-Бро готов к работе
            </p>
            <p className="text-[11px] sm:text-xs max-w-sm text-gray-500">
              Задайте любой вопрос или загрузите изображение для анализа.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.role === "user" && msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Прикрепленное фото"
                    className="max-w-full h-auto rounded-lg mb-2 border border-white/20 shadow-sm"
                  />
                )}
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl rounded-bl-none p-3 sm:p-4 text-xs sm:text-sm animate-pulse">
              Нейро-Бро печатает...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ввода */}
      <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 space-y-1.5 shadow-sm">
        {attachedPreview && (
          <div className="flex items-center gap-2 p-1 px-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl w-fit ml-1 border border-blue-200 dark:border-blue-800">
            <img
              src={attachedPreview}
              alt="Превью"
              className="w-7 h-7 object-cover rounded-lg"
            />
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Фото готово
            </span>
            <button
              onClick={() => setAttachedPreview(null)}
              className="text-gray-400 hover:text-red-500 text-xs font-bold ml-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1 px-2.5 border border-gray-100 dark:border-gray-800">
          <label
            className="cursor-pointer p-1.5 rounded-full text-gray-400 hover:text-blue-600 transition hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
            title="Прикрепить фото"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <svg
              className="w-5 h-5 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </label>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Спроси меня о чем угодно..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none px-1"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputPrompt.trim() && !attachedPreview)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition disabled:opacity-40 shadow-md shrink-0 cursor-pointer"
            title="Отправить"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium px-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0"></span>
          <span className="truncate">{models.find((m) => m.id === selectedModel)?.hint}</span>
        </div>
      </div>

      {/* Модалка очистки */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-xs sm:max-w-sm w-full p-5 space-y-3 shadow-2xl border border-gray-100 dark:border-gray-800 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto">
              <svg
                className="w-5 h-5 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Очистить диалог?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Это удалит историю и сбросит контекст памяти.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={executeClearHistory}
                disabled={isClearing}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold text-xs hover:bg-red-600 transition shadow-sm cursor-pointer"
              >
                {isClearing ? "Очистка..." : "Очистить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}