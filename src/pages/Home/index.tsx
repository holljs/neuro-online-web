import { Navigate } from "react-router";

export default function Home() {
  // Прямой редирект на Нейро-Бро без отображения ярких карточек
  return <Navigate to="/neuro-bro" replace />;
}