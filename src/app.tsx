import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage/HomePage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

// 懒加载 DataLayout（内部包含 DataProvider，所有数据文件在此加载）
const DataLayout = lazy(() => import("@/components/DataLayout"));

// 懒加载所有数据相关页面
const TierListPage = lazy(() => import("@/pages/TierListPage/TierListPage"));
const ScrollPage = lazy(() => import("@/pages/ScrollPage/ScrollPage"));
const SummonPage = lazy(() => import("@/pages/SummonPage/SummonPage"));
const BattleBPPage = lazy(() => import("@/pages/BattleBPPage/BattleBPPage"));
const CounterGraph3DPage = lazy(() => import("@/pages/CounterGraph3DPage/CounterGraph3DPage"));
const DataManagementPage = lazy(() => import("@/pages/DataManagementPage/DataManagementPage"));
const EntertainmentPage = lazy(() => import("@/pages/EntertainmentPage/EntertainmentPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 首页：不依赖任何数据，直接渲染 */}
        <Route index element={<HomePage />} />

        {/* 数据路由：包裹在 DataLayout 中，且全部懒加载 */}
        <Route element={<Suspense fallback={null}><DataLayout /></Suspense>}>
          <Route path="tier-list" element={<Suspense fallback={null}><TierListPage /></Suspense>} />
          <Route path="scrolls" element={<Suspense fallback={null}><ScrollPage /></Suspense>} />
          <Route path="summons" element={<Suspense fallback={null}><SummonPage /></Suspense>} />
          <Route path="battle-bp" element={<Suspense fallback={null}><BattleBPPage /></Suspense>} />
          <Route path="counter-graph-3d" element={<Suspense fallback={null}><CounterGraph3DPage /></Suspense>} />
          <Route path="entertainment" element={<Suspense fallback={null}><EntertainmentPage /></Suspense>} />
          <Route path="644064643989" element={<Suspense fallback={null}><DataManagementPage /></Suspense>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}