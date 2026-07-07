import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DataProvider } from "@/contexts/DataContext";
import HomePage from "@/pages/HomePage/HomePage";
import TierListPage from "@/pages/TierListPage/TierListPage";
import NinjaScrollPage from "@/pages/NinjaScrollPage/NinjaScrollPage";
import ScrollListPage from "@/pages/ScrollListPage/ScrollListPage";
import DataManagementPage from "@/pages/DataManagementPage/DataManagementPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tier-list" element={<TierListPage />} />
          <Route path="ninja-scroll" element={<NinjaScrollPage />} />
          <Route path="scroll-list" element={<ScrollListPage />} />
          <Route path="data-management" element={<DataManagementPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DataProvider>
  );
}
