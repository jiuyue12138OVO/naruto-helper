# 火影忍者手游辅助工具 - 需求拆解文档

## 产品概述

- **产品类型**: 游戏辅助工具网页应用
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 火影忍者手游玩家（从新手到高分段决斗场玩家）
- **核心价值**: 提供忍者强度排行、密卷推荐搭配、密卷大全查询等一站式辅助信息，帮助玩家优化阵容与密卷配置
- **界面语言**: 中文
- **主题偏好**: 深色（火影忍者主题，橙色/红色/黑色为主色调）
- **导航模式**: 路径导航
- **导航布局**: Topbar（消费者前台工具应用，面向玩家）

---

## 页面结构总览

> **说明**：此表为页面生成的唯一数据源，包含所有页面（一级+二级）

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 首页 | `HomePage.tsx` | `/` | 一级 | 导航 |
| 忍者强度排行 | `TierListPage.tsx` | `/tier-list` | 一级 | 导航 |
| 忍者密卷推荐 | `NinjaScrollPage.tsx` | `/ninja-scroll` | 一级 | 导航 |
| 密卷大全 | `ScrollListPage.tsx` | `/scroll-list` | 一级 | 导航 |

> **页面类型说明**：
> - **一级页面**：出现在导航中，用户可直接访问
> - **二级页面**：不在导航中，从一级页面跳转进入（当前无二级页面）

---

## 页面布局建议

- **首页**: 单栏布局，视觉重心在功能入口卡片网格；结果承载区为卡片列表，初始态即展示所有功能入口卡片。
- **忍者强度排行**: 上下分区布局（筛选栏 + 卡片列表），视觉重心在忍者卡片列表；结果承载区为卡片网格，初始态展示全部忍者（按T级分组），支持筛选后动态更新。
- **忍者密卷推荐**: 上下分区布局（搜索栏 + 推荐列表），视觉重心在推荐列表；结果承载区为推荐卡片列表，初始态展示全部推荐搭配。
- **密卷大全**: 上下分区布局（搜索栏 + 密卷卡片网格），视觉重心在密卷卡片；结果承载区为卡片网格，初始态展示全部密卷。

---

## 插件规划

> 本需求不涉及 AI/飞书插件能力，省略此章节。

---

## 导航配置

- **导航布局**: Topbar（顶部固定）
- **导航项**（仅一级页面）:
  | 导航文字 | 路由 | 图标(可选) |
  |---------|------|-----------|
  | 首页 | `/` | 木叶标志 |
  | 忍者强度排行 | `/tier-list` | 苦无 |
  | 忍者密卷推荐 | `/ninja-scroll` | 卷轴 |
  | 密卷大全 | `/scroll-list` | 写轮眼 |

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 忍者强度数据 | demo-mock | `src/data/ninjas.ts` 导出 `INinja[]` 常量 | ✅ 本身就是 mock |
| 密卷数据 | demo-mock | `src/data/scrolls.ts` 导出 `IScroll[]` 常量 | ✅ 本身就是 mock |
| 忍者密卷推荐搭配数据 | demo-mock | `src/data/recommendations.ts` 导出 `IRecommendation[]` 常量 | ✅ 本身就是 mock |
| 搜索功能 | demo-mock | 前端本地过滤 `ninjas` / `scrolls` 数组，按名称匹配 | ✅ 本身就是 mock |

> 用户明确要求"数据使用本地 mock 数据实现，方便后续扩展为真实数据"，所有数据均为 `demo-mock` 类型。

---

## 功能列表

- **页面**: 首页
  - **页面目标**: 展示应用品牌形象，提供各功能模块的快速入口
  - **功能点**:
    - **应用 Logo 与标题展示**: 顶部展示火影忍者主题的应用 Logo 和标题，营造忍者战斗氛围
    - **功能入口卡片**: 以卡片网格形式展示三大功能入口（忍者强度排行、忍者密卷推荐、密卷大全），每张卡片含图标、标题和简短描述
    - **预留扩展位**: 卡片网格末尾预留"更多功能"占位卡片，视觉上暗示后续可扩展新模块

- **页面**: 忍者强度排行
  - **页面目标**: 按 T 级分类展示所有忍者的强度排行，支持按评级筛选和名称搜索
  - **功能点**:
    - **T 级筛选**: 顶部提供 T0/T1/T2/T3/全部 的筛选标签，点击后过滤对应评级的忍者卡片列表
    - **忍者卡片网格**: 按 T 级分组展示忍者卡片，每张卡片显示忍者名称、评级 Badge（T0/T1/T2/T3）、核心优势简述、操作难度标识
    - **搜索忍者**: 顶部搜索框支持输入忍者名称进行模糊匹配，实时过滤卡片列表
    - **火影装饰元素**: 页面背景或卡片边缘融入苦无、写轮眼等火影元素装饰，强化主题氛围

- **页面**: 忍者密卷推荐
  - **页面目标**: 展示各忍者推荐携带的密卷搭配，支持搜索忍者名称快速定位
  - **功能点**:
    - **推荐列表**: 以列表或卡片形式展示每条推荐搭配，包含忍者名称、推荐密卷名称、推荐理由、适配度评分（如星级或分数）
    - **搜索忍者**: 顶部搜索框支持输入忍者名称进行模糊匹配，实时过滤推荐列表
    - **密卷详情联动**: 点击推荐卡片中的密卷名称可跳转至密卷大全页并定位到对应密卷（可选实现，或至少展示密卷关键信息）

- **页面**: 密卷大全
  - **页面目标**: 展示所有密卷的详细信息，支持按强度评级筛选和名称搜索
  - **功能点**:
    - **密卷卡片网格**: 以卡片形式展示所有密卷，每张卡片显示密卷名称、效果描述、冷却时间、适用场景、强度评级 Badge（T0/T1/T2）
    - **强度筛选**: 顶部提供 T0/T1/T2/全部 的筛选标签，点击后过滤对应评级的密卷卡片列表
    - **搜索密卷**: 顶部搜索框支持输入密卷名称进行模糊匹配，实时过滤卡片列表
    - **火影装饰元素**: 卡片设计中融入卷轴、忍术特效等火影元素，增强视觉沉浸感

---

## 数据共享配置

> 当前页面间无跨页面共享数据需求（各页面独立使用各自的 mock 数据源），省略此章节。后续若需全局状态（如用户收藏、浏览历史），可扩展 `__global_naruto_*` 键名。

---

## 全局搜索功能（跨页面）

用户要求"支持搜索功能，可以搜索忍者名称或密卷名称"。当前规划为各页面独立的本地搜索（忍者排行页搜忍者、密卷大全页搜密卷）。若后续需要全局统一搜索（在首页或导航栏统一搜索），可扩展为：

- 在 Topbar 添加全局搜索框
- 输入关键词后同时搜索忍者名称和密卷名称
- 搜索结果以下拉面板展示，点击跳转至对应页面

当前版本按页面内独立搜索实现，保持简洁。

-------

<scene_type>prototype-app</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Free Direction —— 无参考材料，从火影忍者 IP 语义与工具型产品需求自主建立视觉系统
- **核心情绪 / 应用类型**: 火影忍者手游战术辅助工具，深色战斗氛围 + 数据可读性，服务于决斗场玩家快速查阅强度排行与密卷搭配
- **独特记忆点**: 将忍具材质（苦无金属反光、卷轴纸纹、写轮眼暗红）转化为 UI 组件语言——卡片如忍具袋、评级如任务等级、密卷如封印卷轴

## 2. Art Direction

- **方向名**: 暗部战术面板
- **Design Style**: Dark Futuristic + Japanese Craft —— 深色战术仪表盘融合火影忍具材质，既满足数据工具的信息密度，又承载 IP 特有的手工质感
- **DNA 参数**: 圆角 subtle（卡片 rounded-lg，按钮 rounded-md）/ 阴影 layered（卡片 shadow-lg 模拟卷轴叠放）/ 间距 standard（gap-4 p-6 保持数据呼吸）/ 字体方向 无衬线正文 + 日式笔触标题 / 装饰手法 苦无图标、写轮眼纹样、封印卷轴边框
- **应用类型**: Tool —— 信息密集型工具，卡片网格布局，支持筛选、搜索、分类浏览

## 3. Color System

**色彩关系**: 暗部夜幕基底 + 封印朱红主色 + 查克拉橙金点缀 + 卷轴纸白卡片
**配色设计理由**: primary 用朱红（封印术/写轮眼联想）承担 CTA 与评级标记，bg 用深炭黑营造忍具袋/暗部作战室氛围，card 用深灰蓝模拟卷轴展开后的纸面，accent 用暗金作为 hover 与选中态呼应查克拉光芒
**主色推导**: 火影忍者视觉锚点为写轮眼红、查克拉蓝、木叶橙；本工具以数据查阅为主，选择朱红（封印术/重要度）作 primary 建立视觉层级，查克拉金作 accent 提供轻量反馈，避免大面积蓝色冲淡 IP 识别
**使用比例**: 60% 中性（深炭黑 bg + 深灰蓝 card）/ 30% 辅助（暗金 accent + 卷轴白 text）/ 10% 朱红 primary

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(220 15% 6%) | 暗部作战室深黑底，模拟忍具袋内衬 |
| card | `--card` | `bg-card` | hsl(218 12% 14%) | 卷轴展开纸面，略亮于 bg 形成层级 |
| text | `--foreground` | `text-foreground` | hsl(40 20% 90%) | 暖白正文，模拟卷轴墨迹在纸面的可读性 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(220 8% 52%) | 辅助说明、CD 时间、操作难度副文本 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(0 72% 48%) | 封印朱红，用于 T 级标记、CTA、激活态 |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(40 20% 95%) | primary 上的暖白文字 |
| accent | `--accent` | `bg-accent` | hsl(36 60% 22%) | 查克拉暗金，hover/focus 浅底、选中态、Skeleton |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(36 70% 78%) | accent 上的淡金文字和图标 |
| border | `--border` | `border-border` | hsl(220 10% 22%) | 卡片与输入框边界，弱于 card 面 |

**语义色提示**:
- **T0 级（版本天花板）**: bg hsl(0 72% 18%) / border hsl(0 65% 42%) / text hsl(0 70% 75%)，与 primary 同色相、低明度，表达最高威胁等级
- **T1 级（强势）**: bg hsl(36 55% 16%) / border hsl(36 50% 38%) / text hsl(36 65% 72%)，与 accent 同色相，表达强势但非顶级
- **T2 级（中规中矩）**: bg hsl(220 8% 18%) / border hsl(220 6% 36%) / text hsl(220 5% 62%)，中性灰蓝，表达普通强度
- **T3 级**: bg hsl(220 5% 14%) / border hsl(220 4% 28%) / text hsl(220 4% 48%)，更低对比，表达弱势
- 所有语义色饱和度与 primary 对齐在 ±15% 内，不刺眼不跳脱

## 4. 字体与节奏

- **font-display**: Noto Serif SC —— 标题使用衬线体模拟卷轴/忍术卷轴标题的日式笔触感，仅在 H1/H2 使用
- **font-body**: Noto Sans SC —— 正文清晰可读，适配数据密集型工具的中文排版需求
- **字号**: H1 text-4xl ~ text-5xl；H2 text-2xl ~ text-3xl；body text-base；muted text-sm；T 级标签 text-xs font-bold
- **圆角**: subtle —— 卡片 rounded-lg（8px）模拟卷轴边缘微卷，按钮 rounded-md（6px）保持工具感，不采用 pill 或 sharp

## 5. 全局布局契约

- **Reference Layout Use**: 按需求结构推导，无参考材料支配布局
- **Page / Section Order**: 首页导航 → 忍者强度排行 → 忍者密卷推荐 → 密卷大全，与需求文档功能模块 1:1 对齐
- **Standard Content Zone**: `max-w-7xl mx-auto`，适配忍者卡片网格（桌面 4 列 → 平板 2 列 → 手机 1 列）和密卷列表
- **Shell / Frame Alignment**: 顶部导航栏全宽固定，内容区独立滚动，内容容器与导航同宽（max-w-7xl）
- **Padding & Rhythm**: `px-4 md:px-6 lg:px-8 py-8 md:py-12`，卡片间距 gap-4 md:gap-6
- **Full-bleed Zones**: 顶部导航栏背景全宽，首页 Hero 区（logo + 搜索栏）可全宽深色背景，内部文字和搜索框仍受 Standard Content Zone 约束
- **Local Narrowing**: 忍者详情弹层/密卷详情面板内部文字行宽收窄至 max-w-2xl，保持阅读舒适度
- **Overflow Strategy**: 密卷大全的表格（名称/效果/CD/场景/评级）使用 `overflow-x-auto`，不为表格放大全局 max-w
- **Flexibility Boundary**: 允许移动端卡片列数、内边距和字号微调；不允许切换 max-w、圆角系统、主色或阴影语言

## 6. 视觉与动效

- **装饰**: 苦无图标（列表项前缀）、写轮眼纹样（T0 级卡片背景水印）、封印卷轴边框（密卷卡片左侧装饰线）
- **阴影/边界**: 中 —— 卡片 shadow-lg 模拟卷轴叠放层次，hover 时 shadow-xl + translateY(-2px) 模拟抽取卷轴
- **动效**: 精致 —— 卡片 hover 上浮 + 阴影加深（transition-all duration-200）；T 级筛选标签切换有淡入过渡；搜索框 focus 时边框亮起 primary 色光晕（ring-2 ring-primary/30）；页面切换使用淡入（fadeIn 0.2s）

## 7. 组件原则

- 按钮、表单、菜单、卡片必须有 Default / Hover / Active / Focus / Disabled 状态
- Primary 按钮（朱红 bg-primary text-primary-foreground）承担主 CTA：搜索确认、筛选应用、功能入口
- Secondary/Outline 按钮用 border-border + transparent bg，hover 时 bg-accent
- T 级筛选标签：选中态 bg-primary text-primary-foreground，未选中 bg-card text-textMuted border-border，hover 时 bg-accent
- 忍者卡片：Default bg-card border-border，Hover shadow-xl translateY(-2px) border-primary/30
- 加载骨架屏使用 accent 色 pulse，空状态用 muted 文字 + 苦无图标占位

## 8. Image Direction

- **Image Role**: 首页 Hero 区背景图（logo 后方氛围层）、功能入口卡片装饰图标（苦无、手里剑、卷轴等忍具图标）
- **Image Art Direction**: 深色背景上低透明度的木叶标志或写轮眼纹样作为 Hero 区水印，光线从左上角打下的暗部作战室氛围，材质为粗糙布料/忍具金属反光，情绪为紧张备战感而非热血战斗
- **Image Prompt Keywords**: dark shinobi tactical room atmosphere, faint Konoha leaf symbol watermark, low opacity Sharingan pattern, kunai metal reflection, scroll paper texture, dim amber lantern light, moody shadow, ninja tool storage aesthetic
- **Image Avoidance**: 避免明亮战斗场景、角色立绘堆叠、高饱和橙色火焰、通用游戏 UI 素材感、廉价粒子特效

## 9. Anti-patterns

- **Split personality**: 首页 Hero 用深黑、排行页突然切浅灰背景；全站统一 bg hsl(220 15% 6%) 和 card hsl(218 12% 14%)
- **Phantom tokens**: 编造 `--accent-hover` 等不存在的 CSS 变量；hover 状态用 accent 色 + 透明度叠加
- **Default SaaS drift**: 回到默认蓝按钮、通用紫渐变卡片；用朱红 primary + 暗金 accent 保持 IP 识别
- **Invisible interaction**: hover 做了上浮动画，focus-visible 丢了 ring；每个可交互元素都要有 ring-2 ring-primary/50 的键盘可见状态
- **Mono-hue tyranny**: 朱红铺满按钮、标签、图标、边框、链接；T 级标签用语义色分级，图标用 textMuted，边框用 border
- **Status color drift**: T0 红过于刺眼（高饱和 #ff0000）而 primary 是暗朱红；T0 语义色饱和度与 primary 对齐在 ±15% 内
- **Anime clutter**: 卡片内塞满角色立绘、手里剑图标、烟雾特效；装饰克制在边框水印和列表前缀图标，信息层级优先