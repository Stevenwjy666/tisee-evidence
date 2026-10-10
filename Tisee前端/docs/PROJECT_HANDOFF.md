# 西藏旅游网站项目交接说明

更新时间：2026年10月10日

## 开发目录与浏览器约定

- 日常开发、代码修改和启动目录统一为 `<你的项目目录>`。
- `<原作者备份目录>` 不作为日常开发或启动目录。
- 查看页面、预览新增界面以及编辑后的交互和布局检查，统一使用用户电脑上的 Microsoft Edge。
- 不使用 Codex 右侧内置浏览器打开或预览本项目。
- 先进入上述 C 盘目录执行 `npm run dev`，再在 Microsoft Edge 打开终端显示的本地地址（通常为 `http://localhost:3000`）。

## 项目

项目路径：

```text
<你的项目目录>
```

技术栈：Next.js 16 App Router、React 19、TypeScript strict、Tailwind CSS v4。

这是原创的西藏旅游 marketplace 前端原型，视觉和内容参考 Airbnb 的信息组织方式，但不是 Airbnb 官方网站。不得复制 Airbnb 的 Logo、品牌文案、专有图片或受保护内容。

当前没有真实登录、支付、数据库、地图、消息或后端 API，页面数据使用本地 React/TypeScript mock。

## 当前路由

- `/`：首页，包含搜索、分类、房源、路线、体验和周边。
- `/homes`：房源列表。
- `/routes`：路线列表。
- `/experiences`：在地体验列表。
- `/services`：西藏主题周边商品列表。
- `/rooms/[id]`：详情页，根据 id 区分房源和路线。
- `/hosts/[id]`：游客可见的房主公开主页。
- `/guides/[id]`：游客可见的向导公开主页。
- `/profile`：游客个人中心。
- `/referrals`：邀请房东或向导赚取奖励页面。

## 岩画图标与动画（2026-10-10）

五个分类入口使用组员 Tisee- 仓库的岩画图标。新增 PetroglyphTab 组件、CSS 动画与本地 WebP 帧图；移动端搜索下方提供同样的分类入口。素材与检查方式见 `docs/PETROGLYPH_ICONS.md`。

## 已完成

### 详情页分流

文件：`src/app/rooms/[id]/page.tsx`

- `stay-*` 显示房源详情：
  - 房间信息、设施、入住说明、房源位置和预订卡片。
  - 展示房主信息。
  - 房主入口跳转 `/hosts/yangjin`。
- `route-*` 显示路线详情：
  - 路线天数、行程安排、适合人群、路线包含内容和出发位置。
  - 展示“由央金带队”。
  - 向导入口跳转 `/guides/yangjin`。
- 体验和周边目前仍复用通用详情结构，尚未单独建模。

### 向导公开主页

文件：`src/app/guides/[id]/page.tsx`

当前示例：`/guides/yangjin`

包含头像卡、评分、评价数量、带队年限、身份信号、关于向导、带队方式、代表路线和游客评价。

### 房主公开主页

文件：`src/app/hosts/[id]/page.tsx`

当前示例：`/hosts/yangjin`

包含房主头像卡、评分、评价数量、接待年限、身份信号、关于房主、接待方式、房源列表和住客评价。

只做游客公开页面，不做房主后台、订单、日历、收益或消息。

### 邀请奖励页面

文件：`src/app/referrals/page.tsx`

入口：首页和分类页右上角菜单中的“邀请房东或向导”。

包含邀请房东、邀请向导、现金奖励示例、三步邀请流程、“生成邀请链接”按钮占位和原型说明。

当前不连接真实邀请链接、资格审核、支付或提现。

### 路由过渡修复

- 向导和房主入口使用 `Link` 并设置 `prefetch={false}`，避免开发模式下动态路由卡在 `Rendering...`。
- `src/app/layout.tsx` 的 `<html>` 已添加 `data-scroll-behavior="smooth"`。

## 主要文件

- `src/components/airbnb-clone-page.tsx`：首页、分类页、搜索和右上角菜单。
- `src/app/rooms/[id]/page.tsx`：房源/路线详情分流。
- `src/app/hosts/[id]/page.tsx`：房主公开主页。
- `src/app/guides/[id]/page.tsx`：向导公开主页。
- `src/app/referrals/page.tsx`：邀请奖励页面。
- `src/app/profile/page.tsx`：游客个人中心。
- `src/app/globals.css`：全局、详情页、房主页、向导页和邀请页样式。

研究记录：

- `docs/research/airbnb-guide-profile-pattern-20260922.md`
- `docs/research/airbnb-host-profile-pattern-20260923.md`
- `docs/research/airbnb-referral-rewards-pattern-20260923.md`

## 验证

主要命令：

```powershell
npm run check
```

最近一次 `npm run check` 已通过，包含 lint、typecheck 和 build。

已验证：

- `/rooms/stay-0` 返回房源详情内容。
- `/rooms/route-0` 返回路线详情内容。
- `/hosts/yangjin` 返回房主公开主页。
- `/guides/yangjin` 返回向导公开主页。
- `/referrals` 返回邀请奖励页面。
- 桌面和 390px 移动视口无明显横向溢出。

## Edge 验证

必须使用真实 Microsoft Edge，不使用 Codex 内置浏览器。

遇到：

```text
could not determine the current browser URL on Windows with enough confidence to enforce policy
```

不要重复读取普通 Edge 窗口。启动独立 Edge 调试实例：

```powershell
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$profile = Join-Path $env:TEMP 'tibetbnb-edge-cdp-profile'
New-Item -ItemType Directory -Force -Path $profile | Out-Null
& $edge `
  '--remote-debugging-port=9222' `
  "--user-data-dir=$profile" `
  '--no-first-run' `
  '--no-default-browser-check' `
  'http://localhost:3000/'
```

先确认：

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:9222/json/version
Invoke-RestMethod http://127.0.0.1:9222/json/list
```

只有 `/json/list` 明确返回项目页面 URL 后，才进行 DOM、截图或交互验证。端口被占用时改用 `9223`，所有后续地址保持一致。

## 下一步

1. 在真实 Edge 中检查 `/referrals` 的菜单入口和页面布局。
2. 为体验和周边建立独立详情模板。
3. 将房主和向导 mock 数据从单一 `yangjin` 扩展为基于 id 的数据。
4. 继续替换远程 Unsplash 图片为项目自己的稳定资源。
5. 后续再做房主/向导自用后台。

## 导航背景占位（2026-10-10）

已接入 Tisee- 的头部与背景设计方向，样式在 src/components/stone-header.css。public/images/rock-texture.jpg 当前为纯白占位 JPG，后续用组员石纹图替换同名文件即可。当前使用 0.82 深色遮罩保障白底上的暖白文字可读；真实石纹图替换后可根据图片明暗调低遮罩（设计建议 0.45）。保留搜索、菜单和布局，仅改变导航视觉。

分类单击修复：图标设置 pointer-events: none，聚焦重播仅在 focus-visible 时触发，避免鼠标按下后图标重建中断 click。真实 Edge 已验证五个分类图标一次鼠标点击跳转，npm run check 通过。
路线页新增同级栏目：平台推荐司机。8 张示例司机卡片展示头像、姓名和评分，支持横向滚动；照片、姓名和评分均为原型占位。

## 司机详情（2026-10-10）

新增 /drivers/[id]，推荐司机卡片链接到各自资料页，支持 8 个稳定 id，未知 id 返回 404。上方司机与旅途、车辆各一张大图和四张可切换缩略图，下方展示常跑路线整车报价、按天包车和电话/微信信息。共享司机数据在 src/lib/drivers.ts；路线、车型、价格与图片为 mock，联系方式留空待提供。当前没有司机与羊的真实合照，照片槽位可替换。后端后续提供司机相册、车辆相册、路线报价、包车日价、电话及微信资料。

房源、路线与向导详情页已统一 Tisee 视觉：深棕导航、暖白页面、砂岩色头像和标签、浅米色预订与联系卡片。共用样式在 src/components/tisee-detail-theme.css，按 room-page / guide-page 限定作用范围。保留既有内容与功能。

房源和路线详情顶部移除搜索框、语言圆形按钮与菜单按钮，改为对应岩画图标与分类名称，点击返回房源或路线列表。
Edge 检查结束必须显式恢复真实窗口：Emulation.setDeviceMetricsOverride({width:0,height:0,deviceScaleFactor:0,mobile:false})，并将 pageScaleFactor 设为 1。仅 clearDeviceMetricsOverride 在本机曾遗留 1440px 渲染视口，实际窗口约1272px，导致页面整体右侧截断。真实窗口恢复后地图、内容和预订卡片边界正常。
