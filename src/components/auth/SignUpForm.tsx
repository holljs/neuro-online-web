import React from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";

export default function SignUpForm() {
  const handleVkAuth = () => {
    // Единый вход/регистрация через VK ID
    const CLIENT_ID = "52853245"; // ID вашего приложения VK
    const REDIRECT_URI = encodeURIComponent(window.location.origin + "/profile");
    
    window.location.href = `https://oauth.vk.com/authorize?client_id=${CLIENT_ID}&display=page&redirect_uri=${REDIRECT_URI}&response_type=code&v=5.131`;
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          На главную
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-10">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Регистрация в Нейро-Онлайн
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Быстрое создание аккаунта в 1 клик через ВКонтакте
            </p>
          </div>

          {/* Кнопка регистрации через VK ID */}
          <button
            onClick={handleVkAuth}
            type="button"
            className="w-full py-3.5 px-4 bg-[#0077FF] hover:bg-[#0066CC] text-white font-semibold rounded-2xl transition flex items-center justify-center gap-3 shadow-md hover:shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.17 14.28h-1.37c-.52 0-.68-.41-1.62-1.35-.82-.8-.18-1.18 0-1.54 0 0 1.25-1.76 1.38-2.39.09-.32 0-.56-.45-.56h-1.37c-.38 0-.55.2-.69.58 0 0-.7 1.91-1.69 3.15-.32.4-.46.53-.63.53-.09 0-.21-.13-.21-.49v-3.83c0-.42-.12-.61-.47-.61h-2.15c-.26 0-.42.19-.42.38 0 .4.6.49.66 1.61v2.43c0 .53-.1.63-.31.63-.56 0-1.92-2.07-2.73-4.44-.15-.43-.3-.6-.68-.6H3.34c-.43 0-.52.2-.52.42 0 .39.5 2.34 2.33 4.9 1.22 1.76 2.94 2.71 4.51 2.71.94 0 1.06-.21 1.06-.58v-1.23c0-.42.18-.51.48-.51.22 0 .61.11 1.5 0.98 1.02 1.02 1.19 1.43 1.76 1.43h1.37c.43 0 .65-.21.52-.63-.13-.42-.62-1.03-1.26-1.74z" />
            </svg>
            <span>Зарегистрироваться через VK ID</span>
          </button>

          <p className="text-xs text-gray-400 leading-relaxed">
            Создавая аккаунт, вы принимаете Условия использования и Политику конфиденциальности.
          </p>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{" "}
              <Link
                to="/signin"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}