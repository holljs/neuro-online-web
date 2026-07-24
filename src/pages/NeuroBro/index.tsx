import React, { useState } from "react";

export default function NeuroBro() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Привет! Я Нейро-Бро. Чем могу помочь тебе сегодня?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Временная заглушка ответа ИИ
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "ai", text: `Ответ на: "${input}" (подключение API сделаем на следующем шаге!)` }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-default overflow-hidden">
      {/* Шапка чата */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
        <div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Нейро-Бро</h2>
          <p className="text-xs text-gray-500">Универсальный ИИ-ассистент</p>
        </div>
      </div>

      {/* Окно сообщений */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Напишите сообщение..."
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}