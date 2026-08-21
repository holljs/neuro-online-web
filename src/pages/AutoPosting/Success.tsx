import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Success = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Подключаем вашу группу...");
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("access_token");
    const userId = params.get("user_id");

    if (!token) {
      setError("Не удалось получить доступ. Попробуйте ещё раз.");
      return;
    }

    setStatus("Сохраняем подключение...");
    fetch("/api/autoposter/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, user_id: userId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          navigate(`/autoposter/setup?client_id=${data.client_id}`);
        } else {
          setError(data.error || "Ошибка подключения");
        }
      })
      .catch(() => setError("Ошибка соединения с сервером"));
  }, [navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900 text-center">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Ошибка</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <a href="/auto-posting" className="text-brand-600 hover:underline">← Вернуться</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
        <svg className="w-8 h-8 text-brand-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">Отлично, доступ получен!</h2>
      <p className="text-gray-600 dark:text-gray-400">{status}</p>
    </div>
  );
};

export default Success;
