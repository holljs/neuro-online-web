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

  // 🔥 Баланс энергии
  const [energy, setEnergy] = useState<number>(0);
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Ref для блока чата (прокрутка строго внутри окна)
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const models = [
    {
      id: "gpt4o_mini",
      name: "Быстрая",
      cost: "3 ⚡",
      hint: "Только текст. Не видит фото (3⚡)",
    },
    {
      id: "gemini_flash",
      name: "Думающая",
      cost: "15 ⚡",
      hint: "Распознаёт фото и файлы (15⚡)",
    },
    {
      id: "gemini_31_pro",
      name: "Про-кодер",
      cost: "50 ⚡",
      hint: "Супер-ИИ: верстает и пишет код (50⚡)",
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

  // Точечная прокрутка внутри блока чата
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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

    // 🔥 Загружаем баланс энергии
    const fetchEnergy = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/${userId}`, {
          headers: { "X-Bot-Token": BOT_TOKEN },
        });
        if (res.data.success) {
          setEnergy(res.data.energy || 0);
          setBonusClaimed(res.data.bonus_claimed || false);
        }
      } catch (e) {
        console.error("Ошибка загрузки энергии:", e);
      }
    };

    fetchHistory();
    fetchEnergy();
  }, [userId]);

  // Голосовой ввод
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // Копирование текста
  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

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
  };

  const executeClearHistory = async () => {
    if (!userId) return;
    setIsClearing(true);
    try {
      await axios.post(
        `${API_BASE}/chat/clear`,
        { user_id: userId, prompt: "clear" },
        { headers: { "X-Bot-Token": BOT_TOKEN } },
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
      {
        role: "user",
        content: userText,
        imageUrl: attachedPreview || undefined,
      },
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
        { headers: { "X-Bot-Token": BOT_TOKEN } },
      );

      if (res.data.success && res.data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.response },
        ]);
        // 🔥 Уменьшаем баланс на стоимость модели
        const costMap: Record<string, number> = {
          gpt4o_mini: 3,
          gemini_flash: 15,
          gemini_31_pro: 50,
        };
        setEnergy((prev) => Math.max(0, prev - (costMap[selectedModel] || 0)));
      } else {
        alert(res.data.error || "Ошибка получения ответа");
      }
    } catch (e: any) {
      const errDetail = e.response?.data?.detail;
      alert(errDetail || "Ошибка связи с сервером");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-150px)] sm:h-[calc(100dvh-120px)] gap-1.5 sm:gap-3 relative">
      {/* Верхняя панель — компактная на мобильном */}
      <div className="rounded-2xl border border-gray-200 bg-white p-1.5 sm:p-3 dark:border-gray-800 dark:bg-gray-900 flex flex-col gap-1.5 sm:gap-2 shadow-sm">
        {/* Ряд 1: модели + энергия в одном ряду */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-xl flex-1 min-w-0">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`flex-1 min-w-0 px-1 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer text-center ${
                  selectedModel === m.id
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5 shrink-0 bg-blue-50 dark:bg-blue-950/30 px-1.5 sm:px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900/40">
            <span className="text-[10px]">⚡</span>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">{energy}</span>
          </div>
        </div>

        {/* Подсказка модели — только на ПК, на телефоне экономим место */}
        <p className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 leading-snug px-1">
          {models.find((m) => m.id === selectedModel)?.hint}
        </p>

        {/* Ряд 2: персона + корзина */}
        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800/60 pt-1.5">
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-gray-900">
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowConfirmModal(true)}
            title="Очистить диалог"
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

      {/* Окно сообщений с локальным ref-скроллом */}
      <div
        ref={chatContainerRef}
        className="flex-1 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-gray-900 overflow-y-auto space-y-3 sm:space-y-4"
      >
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
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="relative group max-w-[88%] sm:max-w-[80%]">
                <div
                  className={`rounded-2xl p-3 sm:p-4 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed pr-8 ${
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

                <button
                  onClick={() => handleCopyText(msg.content, idx)}
                  className={`absolute top-2 right-2 p-1 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer ${
                    msg.role === "user"
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                  title="Копировать"
                >
                  {copiedIdx === idx ? (
                    <svg
                      className="w-3.5 h-3.5 stroke-emerald-400 fill-none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 stroke-current fill-none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
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
      </div>

      {/* Панель ввода */}
      <div className="rounded-2xl border border-gray-200 bg-white p-1.5 sm:p-2 dark:border-gray-800 dark:bg-gray-900 space-y-1.5 shadow-sm">
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
            className="cursor-pointer p-1.5 rounded-full text-gray-400 hover:text-blue-600 transition shrink-0"
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

          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-1.5 rounded-full transition shrink-0 cursor-pointer ${
              isListening
                ? "text-red-500 animate-pulse bg-red-100 dark:bg-red-900/30"
                : "text-gray-400 hover:text-blue-600"
            }`}
            title="Голосовой ввод"
          >
            <svg
              className="w-5 h-5 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              isListening ? "Говорите..." : "Спроси меня о чем угодно..."
            }
            className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none px-1"
          />

          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputPrompt.trim() && !attachedPreview)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition disabled:opacity-40 shadow-md shrink-0 cursor-pointer"
            title="Отправить"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Модальное окно подтверждения очистки */}
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
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs"
              >
                Отмена
              </button>
              <button
                onClick={executeClearHistory}
                disabled={isClearing}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold text-xs"
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