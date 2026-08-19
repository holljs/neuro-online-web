import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// 🔥 Сервисы
import Home from "./pages/Home"; // Главная (2 аккуратные карточки Бро и Художник)
import NeuroBro from "./pages/NeuroBro";
import NeuroArtist from "./pages/NeuroArtist";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import Kids from "./pages/Kids"; // Детский центр
import AutoPosting from "./pages/AutoPosting";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Основная сетка сайта */}
          <Route element={<AppLayout />}>
            {/* 🎯 ГЛАВНАЯ СТРАНИЦА (neuro-master.online/) */}
            <Route index element={<Home />} />
            
            {/* 🛠 СЕРВИСЫ */}
            <Route path="/neuro-bro" element={<NeuroBro />} />
            <Route path="/neuro-artist" element={<NeuroArtist />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/auto-posting" element={<AutoPosting />} />
            
            {/* 👤 ПРОФИЛЬ И НАСТРОЙКИ */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Вспомогательные страницы */}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          <Route path="/signin" element={<UserProfiles />} />
          <Route path="/signup" element={<UserProfiles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}