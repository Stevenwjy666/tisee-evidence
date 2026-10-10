# Tisee 西藏旅游网站

这是一个本地运行的西藏旅行 marketplace 前端原型，品牌名为 **Tisee**。项目用 Airbnb 类旅行平台的信息层级作为产品参考，但内容、品牌、文案和业务方向都是原创，不冒充 Airbnb，也不复用 Airbnb 的商标、Logo、专有图片或受保护文案。

当前项目仍是前端原型：没有真实后端、登录、数据库、支付、地图或消息系统。页面数据主要来自 React/TypeScript mock，后续会逐步接入真实 API。

## 团队开发约定

在自己克隆的项目目录开发和启动。使用 Node.js >=24；npm ci 安装锁定依赖，npm run dev 启动。页面验证使用 Microsoft Edge。原作者的 C/D 盘路径不约束组员。

## 当前状态

- 框架：Next.js 16 App Router
- UI：React 19 + TypeScript strict + Tailwind CSS v4
- 数据：本地 mock
- 重点页面：首页、房源列表、路线列表、体验列表、周边列表、房源/路线详情、房主主页、向导主页、司机详情、个人中心、邀请奖励页
- 最新后端交接文档：`docs/BACKEND_HANDOFF_V2.md`

## 组员快速开始

使用 Node.js 24 或以上。在你自己的项目目录运行 `npm ci`，然后运行 `npm run dev`，用浏览器打开终端显示的地址。下面的 C 盘路径是原作者本机约定，不要求组员使用同一路径。

后端组员优先阅读 [后端快速交接](docs/BACKEND_QUICKSTART.md)，再看 [详细接口与模型建议](docs/BACKEND_HANDOFF_V2.md)。当前无需环境变量；前端没有实现 `/api/*`，文档中的接口是待开发合同。

## 本地运行

首次拿到精简后的项目时，需要先安装依赖：

```powershell
npm ci
```

启动开发环境：

```powershell
npm run dev
```

常用检查：

```powershell
npm run lint
npm run typecheck
npm run build
npm run check
```

## 项目结构

```text
src/
  app/                         页面路由
    page.tsx                   首页
    homes/page.tsx             房源列表
    routes/page.tsx            路线列表
    experiences/page.tsx       在地体验列表
    services/page.tsx          周边列表
    rooms/[id]/page.tsx        房源/路线详情
    hosts/[id]/page.tsx        房主公开主页
    guides/[id]/page.tsx       向导公开主页
    drivers/[id]/page.tsx       司机相册、车辆、路线报价与联系方式
    profile/page.tsx           游客个人中心
    referrals/page.tsx         邀请奖励页
    globals.css                全局样式
  components/
    airbnb-clone-page.tsx      首页和分类页主组件
  lib/
    utils.ts
docs/
  README.md                    文档导航
  PROJECT_HANDOFF.md           前端项目交接
  BACKEND_HANDOFF_V2.md        后端开发交接，优先看这份
public/
```

## 重要文档

- `docs/README.md`：文档导航，先从这里看。
- `docs/PROJECT_HANDOFF.md`：前端项目当前完成情况和后续方向。
- `docs/BACKEND_HANDOFF_V2.md`：给后端开发用的新版交接文档，包含数据模型、API 合同、seed 清单和验收标准。

## 当前路由

- `/`：首页混合推荐
- `/homes`：房源列表
- `/routes`：路线列表
- `/experiences`：在地体验列表
- `/services`：西藏周边列表
- `/rooms/[id]`：详情页，`stay-*` 显示房源，`route-*` 显示路线
- `/hosts/[id]`：房主公开主页
- `/guides/[id]`：向导公开主页
- `/drivers/[id]`：司机详情，支持 8 位示例司机；未知 id 返回 404
- `/profile`：游客个人中心
- `/referrals`：邀请房东或向导奖励页

## 后续优先级

1. 接入后端第一阶段 API，替换首页、列表、详情、房主/向导公开页 mock。
2. 为 `experience-*` 和 `service-*` 建立独立详情模板。
3. 将 `yangjin` 单一 mock 扩展为多房主、多向导数据。
4. 替换 Unsplash 远程占位图为项目自有稳定资源。
5. 后续再做订单、支付、评价、邀请奖励和房主/向导后台。
