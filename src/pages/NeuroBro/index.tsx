import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = "http://83.217.202.227:8002/api/bro";
const USER_ID = 233876992;
const BOT_TOKEN = "SuperSecret_987654321_Token"; // Укажи свой токен

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

  const models = [
    { id: "gpt4o_mini", name: "Быстрая", cost: "3 ⚡" },
    { id: "gemini_flash", name: "Думающая", cost: "10 ⚡" },
    { id: "gemini_31_pro", name: "Про-кодер", cost: "50 ⚡" },
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
      {/* Окно сообщений диалога */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm">
            <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Нейро-Бро готов к работе
            </p>
            <p className="text-xs max-w-sm">
              Напишите вопрос внизу. Вы можете менять модель и роль ассистента прямо в процессе общения!
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

      {/* Нижняя интерактивная панель ввода (Совмещенная с выбором моделей) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 space-y-3 shadow-sm">
        
        {/* Панель переключателей моделей и ролей ВНИЗУ */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
          {/* Переключатель моделей */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedModel === m.id
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] opacity-60">({m.cost})</span>
              </button>
            ))}
          </div>

          {/* Выбор роли + Новый чат */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-gray-900">
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleClearHistory}
              title="Начать новый диалог без памяти прошлых токенов"
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
            >
              + Новый чат
            </button>
          </div>
        </div>

        {/* Прикреплённое фото */}
        {attachedUrl && (
          <div className="flex items-center gap-2 p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Изображение прикреплено
            </span>
            <button
              onClick={() => setAttachedUrl(null)}
              className="text-gray-400 hover:text-red-500 text-xs font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Поле ввода сообщения */}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer p-2 rounded-xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="text-lg">📎</span>
          </label>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={isUploading ? "Загружаем фото..." : "Напишите сообщение..."}
            disabled={isUploading}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
          />

          <button
            onClick={handleSendMessage}
            disabled={isLoading || isUploading || (!inputPrompt.trim() && !attachedUrl)}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}