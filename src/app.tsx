import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DataProvider } from "@/contexts/DataContext";
import HomePage from "@/pages/HomePage/HomePage";
import TierListPage from "@/pages/TierListPage/TierListPage";
import NinjaScrollPage from "@/pages/NinjaScrollPage/NinjaScrollPage";
import ScrollListPage from "@/pages/ScrollListPage/ScrollListPage";
import DataManagementPage from "@/pages/DataManagementPage/DataManagementPage";
import BattleBPPage from "@/pages/BattleBPPage/BattleBPPage";
import SummonPage from "@/pages/SummonPage/SummonPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tier-list" element={<TierListPage />} />
          <Route path="scroll-list" element={<ScrollListPage />} />
          <Route path="summons" element={<SummonPage />} />
          <Route path="ninja-scroll" element={<NinjaScrollPage />} />
          <Route path="battle-bp" element={<BattleBPPage />} />
          {/* 🔒 后台管理入口改为密码路径 */}
          <Route path="644064643989" element={<DataManagementPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DataProvider>
  );
}