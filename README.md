# 火影忍者辅助助手 (Naruto Helper)

一个面向《火影忍者手游》（Naruto Mobile）玩家的工具型 Web 应用，提供忍者强度排行、密卷/通灵搭配推荐、武斗赛 BP 模拟与联机房间、娱乐模式等功能。

## 在线访问

🔗 [https://jiuyue12138OVO.github.io/naruto-helper/](https://jiuyue12138OVO.github.io/naruto-helper/)

## 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 8
- **样式方案**：Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/)
- **路由**：react-router-dom (HashRouter)
- **动画**：framer-motion
- **数据持久化**：localStorage（自定义 DataContext）+ Supabase Realtime（联机房间）
- **部署**：GitHub Pages (gh-pages 分支)

## 主要功能

### 1. 首页
壁纸轮播、功能卡片入口、版本号显示。

### 2. 忍者强度排行
- 按梯度分组展示，支持梯度、评级、定位标签筛选（包含/排除）
- 动态趋势标记（升降箭头），盲选位标注
- 详情弹窗查看基础信息及定位标签

### 3. 密卷 & 通灵兽
- 密卷大全：支持搜索，详情弹窗查看适配忍者
- 忍者密卷推荐：按忍者查密卷 / 按密卷查忍者
- 通灵兽大全：图片墙、搜索、详情弹窗

### 4. 武斗赛 (BP 模拟 & 联机)
- **克制关系**：查看忍者克制/被克制关系、盲选位标识、3D 克制关系图入口
- **模拟 BP**：完整的本地 Ban/Pick/密卷/通灵流程，支持身份选择、多小局换边、历史记录
- **武斗房间**：基于 Supabase 实时数据库的联机 BP，支持断线重连、60s 倒计时、观众席（最多 5 人，可看当前阵容和过往小局记录）

### 5. 娱乐模式
随机忍者、随机阵容抽取，支持梯度/评级/定位标签过滤，可排除忍者/密卷，设置持久化。

### 6. 本地数据管理（默认隐藏）
后台管理全部数据：忍者（含盲选位设置）、密卷、通灵兽、武斗赛克制关系（含分数滑块），支持数据导出/导入。

## 项目结构

```
.
├── public/                     # 静态公共资源（favicon、404页面等）
├── shared/
│   └── static/images/          # 静态图片（未在当前版本中使用）
├── src/
│   ├── app.tsx                 # 路由配置 (HashRouter)
│   ├── index.tsx               # 应用入口
│   ├── version.ts              # 数据版本号
│   ├── supabase.ts             # Supabase 客户端配置
│   ├── components/             # 通用组件 (Header, Layout, ImageUpload 等)
│   │   └── ui/                 # shadcn/ui 组件
│   ├── contexts/
│   │   └── DataContext.tsx     # 全局数据状态 (按需加载、localStorage 持久化)
│   ├── data/                   # 静态数据定义 (忍者、密卷、通灵、BP等)
│   ├── hooks/                  # 自定义 Hooks
│   ├── lib/                    # 工具函数
│   └── pages/                  # 所有页面
│       ├── HomePage/           # 首页
│       ├── TierListPage/       # 忍者强度排行
│       ├── ScrollPage/         # 密卷 & 忍者密卷推荐 (合二为一)
│       ├── SummonPage/         # 通灵兽大全
│       ├── BattleBPPage/       # 武斗赛 (克制关系、模拟BP、联机房间)
│       ├── EntertainmentPage/  # 娱乐模式
│       ├── DataManagementPage/ # 数据管理
│       ├── CounterGraph3DPage/ # 3D 克制关系图
│       ├── NinjaScrollPage/    # 忍者密卷推荐 (兼容页面)
│       ├── ScrollListPage/     # 密卷大全 (兼容页面)
│       ├── ExamplePage/        # 示例页面
│       └── NotFoundPage/       # 404 页面
├── scripts/                    # 构建/开发脚本
├── .github/workflows/          # GitHub Actions 部署配置
├── index.html                  # HTML 入口 (含版本检测、Umami 统计)
└── vite.config.ts              # Vite 配置 (包含路径别名)
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (默认 http://localhost:5173)
npm run dev

# 构建生产版本
npm run build
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。  
路由使用 **HashRouter** 避免刷新 404 问题。  
部署分支：`gh-pages`。

## 数据更新与版本管理

应用的数据源分为两部分：
1. **静态数据**：`src/data/*.ts` 中的 TypeScript 文件，作为初始默认值。
2. **用户自定义数据**：存储在浏览器 localStorage 中，通过 `DataContext` 管理。

当静态数据有更新时，需要修改：
- `src/version.ts` 中的 `DATA_VERSION`

版本变化后，浏览器会自动清除旧的 localStorage 缓存并加载最新数据。

---

**免责声明**：本项目为个人学习/辅助工具，忍者强度排行及推荐基于个人理解，仅供参考。素材版权归原作者/官方所有。