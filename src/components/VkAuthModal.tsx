import React, { useEffect, useRef } from "react";

interface VkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userId: string, accessToken?: string) => void;
}

export default function VkAuthModal({ isOpen, onClose, onSuccess }: VkAuthModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Очищаем контейнер перед монтированием кнопки
    containerRef.current.innerHTML = "";

    // 1. Динамически загружаем VK ID SDK 3.0
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js";
    script.async = true;

    script.onload = () => {
      if ("VKIDSDK" in window) {
        const VKID = (window as any).VKIDSDK;

        // Инициализация приложения
        VKID.Config.init({
          app: 54703877,
          redirectUrl: "https://neuro-master.online/",
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: "",
        });

        const oneTap = new VKID.OneTap();

        // Рендерим фирменную кнопку VK ID в контейнер
        if (containerRef.current) {
          oneTap
            .render({
              container: containerRef.current,
              showAlternativeLogin: true,
            })
            .on(VKID.WidgetEvents.ERROR, (error: any) => {
              console.error("VK ID Auth Error:", error);
            })
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
              const code = payload.code;
              const deviceId = payload.device_id;

              // Обмен кода на данные пользователя
              VKID.Auth.exchangeCode(code, deviceId)
                .then((data: any) => {
                  console.log("Успешный вход VK ID:", data);
                  
                  // Получаем user_id из полученных данных
                  const userId = data?.user_id || data?.user?.id || payload?.user_id;

                  if (userId) {
                    localStorage.setItem("user_id", String(userId));
                    localStorage.setItem("vk_user_id", String(userId));

                    if (onSuccess) {
                      onSuccess(String(userId), data?.access_token);
                    }
                    
                    window.location.reload();
                  }
                })
                .catch((err: any) => {
                  console.error("Ошибка обмена кода VK ID:", err);
                });
            });
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      // Подчищаем скрипт при закрытии окна
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Авторизация ВКонтакте
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Войдите через VK ID для сохранения баланса кредитов и истории генераций.
        </p>

        {/* Контейнер, куда VK ID SDK автоматически вставит кнопку */}
        <div ref={containerRef} className="flex justify-center my-4 min-h-[44px]"></div>

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