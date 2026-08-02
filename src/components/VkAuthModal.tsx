import React from "react";

interface VkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VkAuthModal({ isOpen, onClose }: VkAuthModalProps) {
  if (!isOpen) return null;

  const handleVkLogin = () => {
    // 1. ID твоего приложения VK
    const clientId = "54603838"; 
    
    // 2. Куда ВК должен вернуть пользователя (строго HTTPS!)
    const redirectUri = encodeURIComponent("https://neuro-master.online/");

    // 3. Формируем прямую ссылку OAuth VK
    const authUrl = `https://oauth.vk.com/authorize?client_id=${clientId}&display=page&redirect_uri=${redirectUri}&response_type=code&v=5.131`;

    // Перенаправляем на авторизацию VK
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Авторизация ВКонтакте
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Войдите через VK ID для сохранения баланса кредитов и истории генераций.
        </p>

        <button
          type="button"
          onClick={handleVkLogin}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          <span>Вход через VK ID</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}