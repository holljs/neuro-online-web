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

// Импорты ваших основных разделов:
import Home from "./pages/Home"; // Страница, которую вы создали в src/pages/Home/index.tsx
import NeuroBro from "./pages/NeuroBro";
import NeuroArtist from "./pages/NeuroArtist";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import Kids from "./pages/Kids"; // Новая страница Детского центра (src/pages/Kids/index.tsx)

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Разделы внутри основного интерфейса (с боковой панелью и шапкой) */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/neuro-bro" element={<NeuroBro />} />
            <Route path="/neuro-artist" element={<NeuroArtist />} />
            
            {/* 🧒 Новый чистый раздел Детского центра (без iframe) */}
            <Route path="/kids" element={<Kids />} />
            
            <Route path="/history" element={<HistoryPage />} />

            {/* Профиль и Настройки */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Элементы формы и UI */}
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

          {/* Авторизация */}
          <Route path="/signin" element={<UserProfiles />} />
          <Route path="/signup" element={<UserProfiles />} />

          {/* Страница 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}