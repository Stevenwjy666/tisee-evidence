# Tisee 后端快速交接

更新时间：2026-10-10

## 当前可以运行什么

Node.js >=24，Next.js 16、React 19、TypeScript strict。运行 npm ci、npm run dev 即可浏览；npm run check 检查 lint、类型与生产构建。当前不需要环境变量。

这是可交互前端原型，尚无真实登录、API、数据库、订单、支付、消息和地图。收藏是页面本地状态；价格、评分和用户资料为 mock。不要将文档中的建议 API 当成已经实现的接口。

## 从哪些文件接数据

| 数据 | 前端入口 | 说明 |
| --- | --- | --- |
| 首页、分类与列表 | src/components/airbnb-clone-page.tsx | homeCards、routeCards、experienceCards、serviceCards、destinations 等 |
| 房源 / 路线详情 | src/app/rooms/[id]/page.tsx | stay-* 与 route-* 分流，体验与周边独立模板待开发 |
| 房主 / 向导 | src/app/hosts/[id]/page.tsx、src/app/guides/[id]/page.tsx | 当前主要为 yangjin 示例 |
| 推荐司机 | src/lib/drivers.ts | id、name、rating、photo 共 8 条；与路线页卡片、司机详情共享 |
| 司机详情 | src/app/drivers/[id]/page.tsx | 两组相册、常跑路线、整车价、包车日价、联系方式 |
| 游客与邀请 | src/app/profile/page.tsx、src/app/referrals/page.tsx | 原型资料及奖励说明 |

司机 id：zhaxi、nima、ciren、pubu、dawa、luosang、sangzhu、danzeng。不存在的司机返回 404。

## 建议接入顺序

1. 数据库 seed 与公共只读接口：首页、四类列表、房源 / 路线详情。
2. 房主、向导公开资料与司机列表 / 详情。
3. 用户资料、收藏和行程。
4. 登录鉴权、预订库存、支付、评价与邀请奖励。

前三类接口规范参见 BACKEND_HANDOFF_V2.md。金额用整数分，公开 id 和 slug 保持稳定。API 应提供可替换 mock 的 camelCase 字段。

## 新增司机接口建议（尚未实现）

GET /api/drivers：返回 id、displayName、rating、coverImage；路线页生成 /drivers/{id} 链接。

GET /api/drivers/:id：返回 driver、personalPhotos、vehiclePhotos、vehicle、routeOffers、dailyCharter、contact。两组照片每项为 url、alt、caption、sortOrder；vehicle 包括车型和可乘人数；routeOffers 包括 title、stops、durationDays、priceAmount、currency、priceUnit；dailyCharter 包括 priceAmount、currency、included、excluded；contact 包括 phone、wechatId、wechatQrUrl，未填写返回 null。统一使用详细文档的 data/meta/error 包装。

照片 URL 不存二进制；车辆图必须与司机实际车辆匹配。当前图库照片仅为设计占位，不代表真实司机或车辆，联系方式尚未提供。默认报价按整车展示，不是每人；日价与固定路线价不重复相加。

## 素材与功能边界

五个岩画图标与动画来自组员 Tisee- 仓库，已转换到 public/icons/petroglyph。public/images/rock-texture.jpg 是纯白占位图，后续替换同名素材。房源、头像、车辆等远程图目前使用 Unsplash；正式资料需替换为自有图源。

部分详情按钮、预订按钮、搜索表单和锚点仍是原型占位，后端组员不要据此假定存在完整业务逻辑。相册缩略图切换、司机卡片跳转与分类导航已实现。
