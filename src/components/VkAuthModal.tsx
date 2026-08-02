import React from "react";

interface VkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VkAuthModal({ isOpen, onClose }: VkAuthModalProps) {
  if (!isOpen) return null;

  const handleVkAuth = () => {
    // ID приложения VK (для веб-авторизации используем ID твоего основного сервиса)
    const clientId = "54477651"; // Идентификатор твоего приложения VK
    const redirectUri = encodeURIComponent("https://neuro-master.online/");

    // Прямой редирект на VK ID OAuth
    window.location.href = `https://oauth.vk.com/authorize?client_id=${clientId}&display=page&redirect_uri=${redirectUri}&response_type=code&v=5.131`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          VK
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Вход через ВКонтакте
        </h3>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Авторизуйтесь через VK ID для безопасного доступа к своему балансу и истории генераций.
        </p>

        <button
          type="button"
          onClick={handleVkAuth}
          className="w-full py-3 px-4 bg-[#0077FF] hover:bg-[#0066CC] text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          Войти через VK ID
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-1 text-xs text-gray-400 hover:text-gray-600 transition"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}