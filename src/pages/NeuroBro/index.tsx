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
  
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Список моделей с описанием возможностей и стоимостью
  const models = [
    { 
      id: "gpt4o_mini", 
      name: "Быстрая", 
      cost: "3 ⚡", 
      hint: "Только текст. Не видит фото!" 
    },
    { 
      id: "gemini_flash", 
      name: "Думающая", 
      cost: "10 ⚡", 
      hint: "Распознаёт фото и файлы, решает задачи" 
    },
    { 
      id: "gemini_31_pro", 
      name: "Про-кодер", 
      cost: "50 ⚡", 
      hint: "Супер-ИИ: напишет код по скрину сайта или макету" 
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("user_id", USER_ID.toString());
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          "X-Bot-Token": BOT_TOKEN,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setAttachedUrl(res.data.url);
      } else {
        alert(res.data.error || "Ошибка загрузки фото");
      }
    } catch (e) {
      alert("Не удалось загрузить изображение.");
    } finally {
      setIsUploading(false);
    }
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
    if (!inputPrompt.trim() && !attachedUrl) return;

    const userText = inputPrompt;
    setInputPrompt("");
    
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    const attachments = attachedUrl ? [attachedUrl] : [];
    setAttachedUrl(null);

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
      {/* Окно чата */}
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

      {/* Панель управления и ввода внизу */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 space-y-3 shadow-sm">
        
        {/* Выбор режима (красивые кнопки с описанием и контрастным балансом) */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                title={m.hint}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  selectedModel === m.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                <span>{m.name}</span>
                <span className={`text-[11px] font-extrabold ${
                  selectedModel === m.id ? "text-yellow-300" : "text-amber-500"
                }`}>
                  {m.cost}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
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
              title="Стереть историю диалога и начать с чистого листа"
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition flex items-center gap-1.5"
            >
              <span>🧹</span>
              <span>Очистить память</span>
            </button>
          </div>
        </div>

        {/* Текстовая подсказка о возможностях выбранной модели */}
        <div className="text-[11px] text-gray-400 font-medium px-1 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          {models.find((m) => m.id === selectedModel)?.hint}
        </div>

        {/* Прикреплённое фото */}
        {attachedUrl && (
          <div className="flex items-center gap-2 p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Фото прикреплено
            </span>
            <button
              onClick={() => setAttachedUrl(null)}
              className="text-gray-400 hover:text-red-500 text-xs font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Поле ввода + Векторная SVG-скрепка */}
        <div className="flex items-center gap-3 pt-1">
          <label 
            className="cursor-pointer p-2 rounded-xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Прикрепить изображение"
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
            placeholder={isUploading ? "Загружаем изображение..." : "Задайте вопрос..."}
            disabled={isUploading}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
          />

          <button
            onClick={handleSendMessage}
            disabled={isLoading || isUploading || (!inputPrompt.trim() && !attachedUrl)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}