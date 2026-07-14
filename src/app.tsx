import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DataProvider } from "@/contexts/DataContext";
import HomePage from "@/pages/HomePage/HomePage";
import TierListPage from "@/pages/TierListPage/TierListPage";
import ScrollPage from "@/pages/ScrollPage/ScrollPage";
import DataManagementPage from "@/pages/DataManagementPage/DataManagementPage";
import BattleBPPage from "@/pages/BattleBPPage/BattleBPPage";
import SummonPage from "@/pages/SummonPage/SummonPage";
import CounterGraph3DPage from "@/pages/CounterGraph3DPage/CounterGraph3DPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tier-list" element={<TierListPage />} />
          <Route path="scrolls" element={<ScrollPage />} />
          <Route path="summons" element={<SummonPage />} />
          <Route path="battle-bp" element={<BattleBPPage />} />
          <Route path="644064643989" element={<DataManagementPage />} />
          <Route path="counter-graph-3d" element={<CounterGraph3DPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DataProvider>
  );
}