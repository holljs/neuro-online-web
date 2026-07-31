import React, { useEffect } from "react";

interface VkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VkAuthModal({ isOpen, onClose }: VkAuthModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Инициализация VK ID SDK
    if (window.VKIDSDK) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: 54451681, // Твой App ID
        redirectUrl: "https://neuro-master.online/profile",
        responseMode: VKID.Config.ResponseMode.Callback,
        source: VKID.Config.Source.FirstParty,
      });

      const oneTap = new VKID.OneTap();

      oneTap
        .render({
          container: document.getElementById("vkOneTapContainer"),
          showIconButton: true,
          skin: VKID.OneTap.Skin.Primary,
        })
        .on(VKID.OneTap.Event.LOGIN_SUCCESS, (payload: any) => {
          const userId = payload.user_id || payload.userId;
          if (userId) {
            localStorage.setItem("user_id", String(userId));
            window.location.href = `/profile?user_id=${userId}`;
          }
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Авторизация
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Войдите через ВКонтакте в 1 клик, чтобы получить доступ к своему балансу и историям генераций.
        </p>

        {/* Контейнер для кнопки One Tap */}
        <div id="vkOneTapContainer" className="w-full flex justify-center min-h-[44px]"></div>
      </div>
    </div>
  );
}