import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = "http://83.217.202.227:8002/api/bro";
const USER_ID = 233876992;
const BOT_TOKEN = "SuperSecret_987654321_Token"; // Укажи свой BOT_SECRET_TOKEN

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function NeuroBro() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedModel, setSelectedModel] = useState("gpt4o_mini");
  const [selectedPersona, setSelectedPersona] = useState("default");
  
  // Храним превью и Base64 прикреплённой картинки
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { 
      id: "gpt4o_mini", 
      name: "Быстрая", 
      cost: "3 энергии",
      hint: "Только текст. Не видит фото (3 энергии / запрос)" 
    },
    { 
      id: "gemini_flash", 
      name: "Думающая", 
      cost: "10 энергии",
      hint: "Распознаёт фото и файлы, решает задачи (10 энергии / запрос)" 
    },
    { 
      id: "gemini_31_pro", 
      name: "Про-кодер", 
      cost: "50 энергии",
      hint: "Супер-ИИ: верстает по скрину и пишет код (50 энергии / запрос)" 
    },
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
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/history?user_id=${USER_ID}`, {
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
  }, []);

  // Конвертация файла в Base64 прямо в браузере
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAttachedPreview(reader.result as string);
    };
    reader.onerror = () => {
      alert("Не удалось прочитать файл изображения.");
    };
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Очистить историю диалога и сбросить память нейросети?")) return;

    try {
      await axios.post(
        `${API_BASE}/chat/clear`,
        { user_id: USER_ID },
        { headers: { "X-Bot-Token": BOT_TOKEN } }
      );
      setMessages([]);
    } catch (e) {
      alert("Ошибка очистки чата.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputPrompt.trim() && !attachedPreview) return;

    const userText = inputPrompt;
    setInputPrompt("");
    
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    const attachments = attachedPreview ? [attachedPreview] : [];
    setAttachedPreview(null);

    try {
      const res = await axios.post(
        `${API_BASE}/chat`,
        {
          user_id: USER_ID,
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
      const errDetail = e.response?.data?.detail || "Ошибка связи с сервером";
      alert(errDetail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-3">
      {/* Верхняя панель */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/70 dark:bg-gray-800 p-1 rounded-xl">
          {models.map((m) => (
            <div key={m.id} className="relative group">
              <button
                onClick={() => setSelectedModel(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedModel === m.id
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {m.name}
              </button>

              <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-30 w-56 p-2.5 bg-gray-900 text-white text-[11px] rounded-xl shadow-xl border border-gray-700 pointer-events-none">
                <div className="font-bold text-blue-400 mb-0.5">{m.name} ({m.cost})</div>
                <div className="text-gray-300 leading-snug">{m.hint}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-gray-900">
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearHistory}
            title="Очистить память диалога"
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Чат */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm">
            <p className="font-bold text-gray-700 dark:text-gray-200 text-base mb-1">
              Нейро-Бро готов к работе
            </p>
            <p className="text-xs max-w-sm text-gray-500">
              Задайте любой вопрос или загрузите изображение для анализа.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl rounded-bl-none p-4 text-sm animate-pulse">
              Нейро-Бро печатает...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ввода */}
      <div className="rounded-2xl border border-gray-200 bg-white p-2.5 dark:border-gray-800 dark:bg-gray-900 space-y-2 shadow-sm">
        
        {/* Превью прикреплённой картинки */}
        {attachedPreview && (
          <div className="flex items-center gap-2 p-1.5 px-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl w-fit ml-2 border border-blue-200 dark:border-blue-800">
            <img src={attachedPreview} alt="Превью" className="w-9 h-9 object-cover rounded-lg" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Фото готово к отправке
            </span>
            <button
              onClick={() => setAttachedPreview(null)}
              className="text-gray-400 hover:text-red-500 text-xs font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Инпут + Скрепка + Самолетик */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1.5 px-3 border border-gray-100 dark:border-gray-800">
          <label 
            className="cursor-pointer p-1.5 rounded-full text-gray-400 hover:text-blue-600 transition hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Прикрепить фото"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </label>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Спроси меня о чем угодно..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none px-2"
          />

          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputPrompt.trim() && !attachedPreview)}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition disabled:opacity-40 shadow-md shrink-0"
            title="Отправить"
          >
            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        <div className="text-[11px] text-gray-400 font-medium px-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          <span>{models.find((m) => m.id === selectedModel)?.hint}</span>
        </div>
      </div>
    </div>
  );
}