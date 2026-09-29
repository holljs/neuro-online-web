import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import VkAuthModal from "../../../components/VkAuthModal";

const APP_URL = "/kids/genius-app-preview/";

export default function Genius() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user_id");
    if (u) setUserId(u);
    else setShowAuth(true);
  }, []);

  const onAuth = (uid: string) => {
    setUserId(uid);
    localStorage.setItem("user_id", uid);
    setShowAuth(false);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-xl text-center space-y-4">
          <div className="text-5xl">🧠</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Нейро-Гений</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Войдите через ВКонтакте, чтобы играть</p>
          <button onClick={() => setShowAuth(true)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">Войти через ВКонтакте</button>
        </div>
        <VkAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={onAuth} />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800" style={{ minHeight: "calc(100vh - 64px)" }}>
      <VkAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={onAuth} />
      <header className="max-w-5xl w-full mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/kids")} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-amber-600">‹ К детскому центру</button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Нейро-Гений</h1>
        <span className="text-xs text-gray-500">ID: {userId}</span>
      </header>
      <div className="max-w-5xl w-full mx-auto px-4 pb-6 flex-1">
        <iframe
          src={`${APP_URL}?web_user_id=${encodeURIComponent(userId)}&web_mode=1`}
          title="Нейро-Гений"
          className="w-full border-0 rounded-2xl bg-white shadow-sm"
          style={{ height: "calc(100vh - 160px)", minHeight: "520px" }}
          allow="microphone; autoplay; fullscreen; camera"
        />
      </div>
    </div>
  );
}
