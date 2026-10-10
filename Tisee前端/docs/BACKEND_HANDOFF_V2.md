# 后端交接文档 V2

更新时间：2026-10-10

本文是在 `docs/BACKEND_HANDOFF.md` 旧版基础上，结合当前真实前端代码补充的后端开发版交接文档。旧版保留不动；本文件用于后端实际建模、写接口、录入 seed 数据和逐步替换前端 mock。

## 1. 项目定位

这是一个原创的西藏旅行 marketplace 前端原型，品牌名为 Tisee。页面信息层级参考 Airbnb 类旅行平台，但不能冒充 Airbnb，也不能复用 Airbnb 的商标、Logo、受保护文案或专有图片。

当前项目没有真实后端、登录、数据库、支付、消息、地图或对象存储。所有业务数据仍写在 React/TypeScript mock 中。后端目标是把这些 mock 逐步替换为数据库、API、鉴权、预订、支付、评价、收藏和邀请奖励系统。

项目路径：

```text
<你的项目目录>
```

技术栈：

- Next.js 16 App Router
- React 19
- TypeScript strict
- Tailwind CSS v4
- Node.js >= 24

常用命令：

```powershell
npm run dev
npm run lint
npm run typecheck
npm run build
npm run check
```

## 2. 当前前端路由与业务对象

| 前端路由 | 页面 | 当前实现 | 后端对象 |
| --- | --- | --- | --- |
| `/` | 首页混合推荐 | `AirbnbClonePage initialTab="all"` | 首页配置、分类、推荐商品、目的地灵感、当前用户收藏 |
| `/homes` | 房源列表 | `AirbnbClonePage initialTab="homes"` | 房源商品、筛选、收藏状态 |
| `/routes` | 路线列表 | `AirbnbClonePage initialTab="routes"` | 路线商品、筛选、收藏状态 |
| `/experiences` | 在地体验列表 | `AirbnbClonePage initialTab="experiences"` | 体验商品、筛选、收藏状态 |
| `/services` | 西藏周边列表 | `AirbnbClonePage initialTab="services"` | 周边商品或服务商品、筛选、收藏状态 |
| `/rooms/[id]` | 商品详情页 | 根据 id 前缀展示房源或路线详情 | 房源详情、路线详情；体验/周边详情模板待补 |
| `/hosts/[id]` | 房主公开主页 | 当前只有 `yangjin` mock | 房主资料、名下房源、住客评价 |
| `/guides/[id]` | 向导公开主页 | 当前只有 `yangjin` mock | 向导资料、名下路线、游客评价 |
| `/profile` | 游客个人中心 | 本地 tab 状态和 mock 数据 | 用户资料、行程、收藏、账户设置 |
| `/referrals` | 邀请奖励页 | 前端说明页，按钮占位 | 邀请规则、邀请码、奖励记录 |

关键前端规则：

- `stay-*` 是房源详情，房源关联房主。
- `route-*` 是路线详情，路线关联向导。
- `experience-*` 和 `service-*` 当前在列表中展示，卡片会链接到 `/rooms/experience-*` 或 `/rooms/service-*`，但详情页还没有独立模板，目前会落到非 route 的通用房源结构。
- 前端类型名是 `home | route | experience | service`。
- 后端如果想使用 `product` 表示周边商品，必须在 API 层明确映射：`service` 前端类型等于后端 `product` 存储类型。为了减少前后端歧义，建议后端第一阶段直接使用 `service`。
- 顶部客服入口文案是“客服中心”。
- 当前默认本地收藏 id：`route-0`、`stay-1`、`stay-3`。

## 3. 当前 mock 来源

| 文件 | 现有 mock 内容 |
| --- | --- |
| `src/components/airbnb-clone-page.tsx` | 首页、分类页、搜索栏、目的地、分类 tabs、横向卡片 sections、收藏初始状态、右上角菜单 |
| `src/app/rooms/[id]/page.tsx` | 房源详情、路线详情、路线每日安排、预订卡片、照片墙、房主/向导入口 |
| `src/app/hosts/[id]/page.tsx` | 房主公开资料、房主事实标签、名下房源、住客评价 |
| `src/app/guides/[id]/page.tsx` | 向导公开资料、向导事实标签、名下路线、游客评价 |
| `src/app/profile/page.tsx` | 游客资料中心、行程、收藏、账户设置 tab |
| `src/app/referrals/page.tsx` | 邀请房东/向导奖励规则、三步流程、生成邀请入口 |

## 4. 建议后端栈

优先选择稳定、方便前端逐页替换 mock 的方案：

- API：REST。
- 数据库：PostgreSQL。
- ORM：Prisma 或 Drizzle。
- 鉴权：JWT + refresh token，或 Auth.js/NextAuth。
- 文件：对象存储，只保存头像、房源图、路线图、商品图 URL 和 metadata。
- 缓存：Redis 后置，用于热门推荐、会话、验证码、限流。
- 搜索：第一阶段 PostgreSQL full-text + 索引；后续再接 Meilisearch/Elasticsearch。

第一阶段不建议马上接支付、真实短信、真实对象存储或复杂推荐服务。先让首页、列表、详情、房主/向导公开页能从数据库返回稳定数据。

## 5. 命名与 ID 约定

### 外部稳定 ID

前端 URL 不应暴露数据库自增 id。以下字段必须稳定且唯一：

- `listings.public_id`：例如 `stay-0`、`route-4`、`experience-0`、`service-0`。
- `host_profiles.slug`：例如 `yangjin`。
- `guide_profiles.slug`：例如 `yangjin`。
- `bookings.booking_no`：面向用户展示的订单号。
- `referral_invites.invite_code`：邀请链接中的 code。

### 商品类型

建议后端第一阶段使用：

```text
home | route | experience | service
```

如果数据库内部坚持使用 `product` 表示周边，则 API 返回给前端时必须转换为 `service`，因为当前前端路由和组件使用的是 `services` / `service-*`。

### 金额

金额不要用浮点数。建议：

- `price_amount` 用整数分，例如 `36800` 表示 ¥368.00。
- `price_currency` 用 ISO 货币码，例如 `CNY`、`USD`。
- API 可额外返回 `priceText` 兼容当前前端展示，例如 `¥368 CNY / 晚`，但数据库不要只存格式化文案。

## 6. 核心数据模型

下面是按当前项目真实页面整理的后端模型。字段类型是建议，可根据 ORM 调整。

### users

登录账号表。一个用户可以是游客、房主、向导或管理员。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `email` | varchar nullable unique | 邮箱登录 |
| `phone` | varchar nullable unique | 手机登录 |
| `password_hash` | varchar nullable | 第三方登录时可为空 |
| `display_name` | varchar not null | 展示名称 |
| `avatar_url` | text nullable | 头像 |
| `bio` | text nullable | 简介 |
| `locale` | varchar default `zh-CN` | 语言 |
| `currency` | varchar default `CNY` | 币种 |
| `status` | enum | `active | pending | disabled` |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

建议约束：

- `email` 和 `phone` 至少一个不为空。
- `email`、`phone` 分别建唯一索引，但要允许 null。

### user_roles

用户角色表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `user_id` | FK users.id | 用户 |
| `role` | enum | `traveler | host | guide | admin` |
| `created_at` | timestamp | 创建时间 |

建议约束：

- 唯一索引：`(user_id, role)`。

### host_profiles

房主公开资料，对应 `/hosts/[id]`。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `user_id` | FK users.id unique | 对应账号 |
| `slug` | varchar unique not null | URL 用，例如 `yangjin` |
| `display_name` | varchar not null | 例如 `央金` |
| `headline` | varchar | 例如 `拉萨本地房主` |
| `location` | varchar | 例如 `拉萨城关区` |
| `years_hosting` | int | 接待年限 |
| `response_time` | varchar | 例如 `通常 1 小时内回复` |
| `languages` | jsonb / text[] | 语言能力 |
| `verified_identity` | boolean | 身份是否核验 |
| `about` | text | 关于房主 |
| `hosting_style` | jsonb | 接待方式卡片数组 |
| `facts` | jsonb | 页面事实标签，例如身份核验、语言、常住地 |
| `rating_avg` | numeric(3,2) | 平均评分 |
| `review_count` | int | 评价数 |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

### guide_profiles

向导公开资料，对应 `/guides/[id]`。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `user_id` | FK users.id unique | 对应账号 |
| `slug` | varchar unique not null | URL 用，例如 `yangjin` |
| `display_name` | varchar not null | 例如 `央金` |
| `headline` | varchar | 例如 `拉萨在地旅行顾问` |
| `base_location` | varchar | 常驻地 |
| `years_guiding` | int | 带队年限 |
| `response_time` | varchar | 例如 `通常 1 小时内回复` |
| `languages` | jsonb / text[] | 语言能力 |
| `verified_identity` | boolean | 身份是否核验 |
| `about` | text | 关于向导 |
| `guiding_style` | jsonb | 带队方式卡片数组 |
| `facts` | jsonb | 页面事实标签 |
| `rating_avg` | numeric(3,2) | 平均评分 |
| `review_count` | int | 评价数 |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

### listings

统一商品主表。房源、路线、体验、周边都放这里。前端列表卡片主要来自此表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `public_id` | varchar unique not null | 前端 URL 用，例如 `stay-0` |
| `type` | enum | `home | route | experience | service` |
| `title` | varchar not null | 卡片和详情标题 |
| `subtitle` | varchar | 卡片副标题 |
| `location` | varchar | 地点 |
| `summary` | text | 详情摘要或 meta |
| `badge` | varchar | 卡片角标 |
| `price_amount` | int / decimal | 金额，建议整数分 |
| `price_currency` | varchar | `CNY` |
| `price_unit` | enum | `night | person | group | item | set` |
| `rating_avg` | numeric(3,2) | 平均评分 |
| `review_count` | int | 评价数 |
| `owner_user_id` | FK users.id nullable | 所有者 |
| `host_profile_id` | FK host_profiles.id nullable | 房源房主 |
| `guide_profile_id` | FK guide_profiles.id nullable | 路线/体验向导 |
| `status` | enum | `draft | pending_review | published | paused | archived` |
| `sort_score` | int default 0 | 首页/列表排序 |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

建议约束：

- `type = home` 必须关联 `host_profile_id`。
- `type = route` 或 `experience` 必须关联 `guide_profile_id`。
- `type = service` 可关联运营账号或商家账号。
- `public_id` 建唯一索引。
- 常用索引：`(type, status, sort_score)`、`location`、`rating_avg`。

### listing_media

商品图片表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `listing_id` | FK listings.id | 商品 |
| `url` | text not null | 图片 URL |
| `alt` | varchar | 替代文本 |
| `sort_order` | int | 排序 |
| `is_cover` | boolean | 是否封面 |
| `created_at` | timestamp | 创建时间 |

建议约束：

- 每个 listing 最多一个 `is_cover = true`。
- 图片只存 URL 和排序，不要把图片二进制放数据库。

### home_details

房源详情扩展表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `listing_id` | PK/FK listings.id | 商品 |
| `bedrooms` | int | 卧室数 |
| `beds` | int | 床数 |
| `bathrooms` | numeric | 卫浴数 |
| `max_guests` | int | 最大客人数 |
| `amenities` | jsonb / text[] | 便利设施 |
| `checkin_time` | varchar | 入住时间 |
| `checkout_time` | varchar | 退房时间 |
| `address_text` | text | 地址文本 |
| `map_lat` | numeric nullable | 纬度 |
| `map_lng` | numeric nullable | 经度 |
| `house_rules` | jsonb / text[] | 入住规则 |
| `high_altitude_support` | text | 高原友好说明 |

当前详情页需要展示：

- `summary`：例如 `1 间卧室 · 1 张大床 · 独立卫浴 · 可供氧`
- `features`：位置便利、高原友好、入住说明三块说明
- `location`：房源位置文案
- `host`：房主名称、slug、接待年限、回复时间

### route_details

路线详情扩展表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `listing_id` | PK/FK listings.id | 商品 |
| `duration_days` | int | 天数 |
| `duration_nights` | int | 晚数 |
| `start_location` | varchar | 集合地 |
| `end_location` | varchar | 结束地 |
| `difficulty_level` | varchar | 强度 |
| `altitude_note` | text | 海拔提醒 |
| `included_items` | jsonb / text[] | 包含内容 |
| `excluded_items` | jsonb / text[] | 不含内容 |
| `suitable_for` | text | 适合人群 |
| `pre_departure_note` | text | 出发前提醒 |

当前详情页需要展示：

- `summary`：例如 `4 天 · 3 晚 · 轻徒步 · 拉萨出发`
- `guideIntro` / `pre_departure_note`
- `location`：出发位置文案
- `guide`：向导名称、slug、带队年限、回复时间

### route_itinerary_days

路线每日安排。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `listing_id` | FK listings.id | 路线 |
| `day_number` | int | 第几天 |
| `title` | varchar | 标题 |
| `description` | text | 描述 |
| `location` | varchar nullable | 当天地点 |
| `sort_order` | int | 排序 |

建议约束：

- 唯一索引：`(listing_id, day_number)`。

### service_details

体验和周边的扩展表。也可以后续拆成 `experience_details` 与 `merchandise_details`。为了匹配当前前端，建议名称先用 `service_details` 或保持 API 返回 `serviceDetail`。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `listing_id` | PK/FK listings.id | 商品 |
| `delivery_type` | enum | `onsite | physical_shipping | digital | pickup` |
| `duration_minutes` | int nullable | 体验时长 |
| `sku` | varchar nullable | 周边商品 SKU |
| `inventory_count` | int nullable | 库存 |
| `shipping_note` | text nullable | 发货说明 |
| `service_note` | text nullable | 服务说明 |

### availability

可订库存表。房源按晚，路线和体验按出发场次，周边按库存。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `listing_id` | FK listings.id | 商品 |
| `date` | date | 日期 |
| `start_time` | time nullable | 开始时间 |
| `end_time` | time nullable | 结束时间 |
| `capacity` | int | 总容量 |
| `remaining_capacity` | int | 剩余容量 |
| `price_amount` | int / decimal | 当日/场次价格 |
| `status` | enum | `available | blocked | sold_out` |

建议约束：

- 房源按 `(listing_id, date)` 唯一。
- 路线/体验按 `(listing_id, date, start_time)` 唯一。
- 预订扣库存必须放事务里，避免超卖。

### bookings

订单主表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `booking_no` | varchar unique not null | 用户可见订单号 |
| `traveler_user_id` | FK users.id | 游客 |
| `listing_id` | FK listings.id | 商品 |
| `type` | enum | `home | route | experience | service` |
| `start_date` | date | 入住/出发/开始日期 |
| `end_date` | date nullable | 退房/结束日期 |
| `guest_count` | int | 出行人数 |
| `unit_price_amount` | int / decimal | 单价 |
| `total_amount` | int / decimal | 总价 |
| `currency` | varchar | 币种 |
| `status` | enum | `draft | pending_payment | paid | confirmed | completed | cancelled | refunded` |
| `contact_name` | varchar | 联系人 |
| `contact_phone` | varchar | 联系电话 |
| `notes` | text nullable | 备注 |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

第二阶段再落地订单。第一阶段 `/profile` 可以返回行程占位数据。

### payments

支付记录表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `booking_id` | FK bookings.id | 订单 |
| `provider` | enum | `wechat_pay | alipay | stripe | manual` |
| `provider_trade_no` | varchar nullable | 三方流水 |
| `amount` | int / decimal | 金额 |
| `currency` | varchar | 币种 |
| `status` | enum | `pending | paid | failed | refunded` |
| `paid_at` | timestamp nullable | 支付时间 |
| `created_at` | timestamp | 创建时间 |

注意：

- 支付 webhook 必须验签、幂等、可重放。
- 建议用 `provider + provider_trade_no` 做唯一索引。

### reviews

评价表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `booking_id` | FK bookings.id nullable | 绑定订单 |
| `listing_id` | FK listings.id | 商品 |
| `reviewer_user_id` | FK users.id | 评价人 |
| `target_user_id` | FK users.id nullable | 房主或向导 |
| `target_type` | enum | `listing | host | guide` |
| `rating` | int / numeric | 评分 |
| `content` | text | 内容 |
| `travel_date` | date nullable | 旅行时间 |
| `status` | enum | `visible | hidden | pending` |
| `created_at` | timestamp | 创建时间 |

正式业务中评价必须绑定完成订单。第一阶段如果只是 seed 展示评价，可允许 `booking_id` 为空，但要在数据上标记为 seed/demo。

### favorites

收藏表。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `user_id` | FK users.id | 用户 |
| `listing_id` | FK listings.id | 商品 |
| `created_at` | timestamp | 创建时间 |

建议约束：

- 唯一索引：`(user_id, listing_id)`。

### destinations

目的地和灵感标签。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `name` | varchar | 名称 |
| `kind` | varchar | 类型或副标题 |
| `parent_id` | FK destinations.id nullable | 父级 |
| `description` | text nullable | 描述 |
| `cover_image_url` | text nullable | 封面 |
| `sort_order` | int | 排序 |
| `status` | enum | `active | hidden` |

当前搜索弹窗目的地：

- 拉萨布达拉宫
- 纳木错
- 羊卓雍措
- 林芝桃花沟
- 珠峰大本营
- 冈仁波齐

当前灵感 tab：

- 热门
- 艺术与文化
- 湖泊
- 山区
- 户外
- 在地体验

### referral_programs

邀请奖励规则。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `role_target` | enum | `host | guide` |
| `title` | varchar | 例如 `邀请房东` |
| `description` | text | 描述 |
| `reward_amount` | int / decimal | 奖励金额 |
| `currency` | varchar | 币种 |
| `qualification_rule` | text | 达标规则 |
| `status` | enum | `active | paused | archived` |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

### referral_invites

邀请记录。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `program_id` | FK referral_programs.id | 邀请规则 |
| `inviter_user_id` | FK users.id | 邀请人 |
| `invitee_user_id` | FK users.id nullable | 被邀请人 |
| `invitee_phone` | varchar nullable | 被邀请手机号 |
| `invitee_email` | varchar nullable | 被邀请邮箱 |
| `invite_code` | varchar unique | 邀请码 |
| `invite_url` | text | 邀请链接 |
| `status` | enum | `sent | registered | onboarded | qualified | expired | rejected` |
| `created_at` | timestamp | 创建时间 |
| `updated_at` | timestamp | 更新时间 |

### referral_rewards

奖励发放记录。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | uuid / bigint | 主键 |
| `referral_invite_id` | FK referral_invites.id | 邀请记录 |
| `inviter_user_id` | FK users.id | 邀请人 |
| `amount` | int / decimal | 金额 |
| `currency` | varchar | 币种 |
| `status` | enum | `pending | approved | paid | rejected` |
| `approved_at` | timestamp nullable | 审核时间 |
| `paid_at` | timestamp nullable | 发放时间 |
| `created_at` | timestamp | 创建时间 |

## 7. 第一阶段 seed 数据清单

后端第一阶段要录入现有 mock，保证替换 API 后页面内容不明显倒退。

### 分类 tabs

| id | label | href |
| --- | --- | --- |
| `all` | 全部 | `/` |
| `homes` | 房源 | `/homes` |
| `routes` | 路线 | `/routes` |
| `experiences` | 体验 | `/experiences` |
| `services` | 周边 | `/services` |

### 路线商品

需要 seed `route-0` 到 `route-8`：

- 拉萨 + 纳木错 4 日小环线
- 林芝桃花沟 3 日摄影行
- 日喀则 + 珠峰 5 日
- 山南文化 2 日
- 阿里南线 8 日
- 羊卓雍措半日行
- 拉萨城市漫游
- 鲁朗森林轻徒步
- 波密冰川与然乌湖

### 房源商品

需要 seed `stay-0` 到 `stay-11`：

- 八廓街旁藏式庭院
- 布达拉宫观景客房
- 林芝河谷木屋
- 日喀则安静民宿
- 山南家庭客栈
- 纳木错湖畔营地
- 拉萨供氧酒店
- 鲁朗森林度假屋
- 波密雪山民宿
- 羊湖观景小院
- 色拉寺旁静心客房
- 林芝花谷家庭房

### 体验商品

需要 seed `experience-0` 到 `experience-3`：

- 藏餐手作体验
- 转经路线讲解
- 旅拍向导服务
- 寺院文化导览

### 周边商品

需要 seed `service-0` 到 `service-6`：

- 西藏主题帆布包
- 高原保暖抓绒帽
- 藏式纹样围巾
- 拉萨旅行明信片套装
- 布达拉宫纪念徽章
- 藏地旅行收纳袋
- 雪山插画卫衣

### 房主与向导

当前公开页只有一个 mock 人物：

- `slug`: `yangjin`
- `display_name`: `央金`
- 房主身份：拉萨本地房主，6 年接待经验，评分 4.92，评价 93。
- 向导身份：拉萨在地旅行顾问，6 年带队经验，评分 4.96，评价 128。

注意：当前 `/hosts/yangjin` 和 `/guides/yangjin` 是两个公开身份页，可以对应同一个 `users` 账号，也可以 seed 成两个 profile 记录。

## 8. API 统一返回格式

所有接口建议使用同一层结构，方便前端处理 loading、error、pagination。

成功：

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100
    }
  },
  "error": null
}
```

失败：

```json
{
  "data": null,
  "meta": {
    "requestId": "req_123"
  },
  "error": {
    "code": "LISTING_NOT_FOUND",
    "message": "未找到该内容"
  }
}
```

约定：

- `data` 成功时永远存在。
- 列表接口分页信息放在 `meta.pagination`。
- 错误 HTTP 状态码要和 `error.code` 对应。
- 前端用户展示用中文 `message`，日志排查用稳定英文/大写 `code`。

## 9. 第一阶段 API 合同

第一阶段目标：替换首页、列表页、详情页、房主/向导公开页、收藏初始状态。下面接口优先级最高。

### GET /api/home

用途：替换 `src/components/airbnb-clone-page.tsx` 首页数据。

返回建议：

```json
{
  "data": {
    "tabs": [
      { "id": "all", "label": "全部", "href": "/" },
      { "id": "homes", "label": "房源", "href": "/homes" },
      { "id": "routes", "label": "路线", "href": "/routes" },
      { "id": "experiences", "label": "体验", "href": "/experiences" },
      { "id": "services", "label": "周边", "href": "/services" }
    ],
    "sections": [
      {
        "id": "featured-routes",
        "title": "西藏热门线路",
        "subtitle": "适合首次进藏与深度探索的灵感路线",
        "items": []
      }
    ],
    "inspirationTabs": [
      { "id": "popular", "label": "热门" }
    ],
    "inspirationPlaces": {
      "popular": [
        { "name": "拉萨", "kind": "普通民宅房源" }
      ]
    },
    "destinations": [
      { "label": "拉萨布达拉宫", "sublabel": "经典城市漫游与观景住宿" }
    ],
    "viewer": {
      "authenticated": false,
      "savedListingIds": ["route-0", "stay-1", "stay-3"]
    }
  },
  "meta": { "requestId": "req_123" },
  "error": null
}
```

### GET /api/listings

用途：替换 `/homes`、`/routes`、`/experiences`、`/services`。

Query：

| 参数 | 说明 |
| --- | --- |
| `type` | `home | route | experience | service` |
| `q` | 搜索关键字 |
| `location` | 地点 |
| `startDate` | 开始日期 |
| `endDate` | 结束日期 |
| `guests` | 人数 |
| `page` | 页码 |
| `pageSize` | 每页数量 |
| `sort` | `recommended | price_asc | price_desc | rating_desc` |

列表卡片返回字段：

```json
{
  "publicId": "stay-0",
  "type": "home",
  "title": "八廓街旁藏式庭院",
  "subtitle": "拉萨城关区",
  "meta": "整套客房 · 2室2床",
  "badge": "房客推荐",
  "rating": 4.92,
  "reviewCount": 93,
  "price": {
    "amount": 36800,
    "currency": "CNY",
    "unit": "night",
    "text": "¥368 CNY / 晚"
  },
  "coverImage": {
    "url": "https://...",
    "alt": "八廓街旁藏式庭院"
  },
  "href": "/rooms/stay-0",
  "saved": false
}
```

### GET /api/listings/:publicId

用途：替换 `/rooms/[id]`。

`stay-0` 返回重点：

```json
{
  "data": {
    "listing": {
      "publicId": "stay-0",
      "type": "home",
      "title": "八廓街旁藏式庭院，靠近布达拉宫的独立房间",
      "eyebrow": "房客推荐 · 拉萨城关区",
      "summary": "1 间卧室 · 1 张大床 · 独立卫浴 · 可供氧",
      "location": "拉萨市城关区，步行可到八廓街与大昭寺",
      "rating": 4.92,
      "reviewCount": 93,
      "price": { "amount": 36800, "currency": "CNY", "unit": "night", "text": "¥368 CNY / 晚" },
      "photos": []
    },
    "homeDetail": {
      "bedrooms": 1,
      "beds": 1,
      "bathrooms": 1,
      "maxGuests": 2,
      "amenities": ["供氧设备", "加湿设备"],
      "features": [
        { "title": "位置便利", "body": "步行可到八廓街，清晨适合慢慢进入高原节奏。" }
      ]
    },
    "host": {
      "slug": "yangjin",
      "displayName": "央金",
      "headline": "本地房主",
      "yearsHosting": 6,
      "responseTime": "通常 1 小时内回复"
    },
    "reviews": [],
    "availability": []
  },
  "meta": { "requestId": "req_123" },
  "error": null
}
```

`route-0` 返回重点：

```json
{
  "data": {
    "listing": {
      "publicId": "route-0",
      "type": "route",
      "title": "拉萨 + 纳木错 4 日小环线",
      "eyebrow": "路线推荐 · 初次进藏友好",
      "summary": "4 天 · 3 晚 · 轻徒步 · 拉萨出发",
      "location": "拉萨集合，前往纳木错与念青唐古拉山沿线",
      "rating": 4.96,
      "reviewCount": 128,
      "price": { "amount": 128000, "currency": "CNY", "unit": "person", "text": "¥1,280 / 人起" },
      "photos": []
    },
    "routeDetail": {
      "durationDays": 4,
      "durationNights": 3,
      "startLocation": "拉萨",
      "difficultyLevel": "轻徒步",
      "suitableFor": "第一次进藏、希望节奏稳定的旅行者",
      "preDepartureNote": "央金会在出发前帮你确认高原适应节奏，并根据天气调整湖边停留时间。"
    },
    "itineraryDays": [
      { "dayNumber": 1, "title": "拉萨集合", "description": "入住后轻松适应海拔，和向导确认接下来几天的节奏。" }
    ],
    "guide": {
      "slug": "yangjin",
      "displayName": "央金",
      "headline": "西藏本地向导",
      "yearsGuiding": 6,
      "responseTime": "通常 1 小时内回复"
    },
    "reviews": [],
    "availability": []
  },
  "meta": { "requestId": "req_123" },
  "error": null
}
```

### GET /api/hosts/:slug

用途：替换 `/hosts/[id]`。

返回建议：

```json
{
  "data": {
    "host": {
      "slug": "yangjin",
      "displayName": "央金",
      "headline": "拉萨本地房主",
      "location": "拉萨城关区",
      "rating": 4.92,
      "reviewCount": 93,
      "yearsHosting": 6,
      "facts": ["身份资料已核验", "通常 1 小时内回复"],
      "about": "我在拉萨生活了很多年...",
      "hostingStyle": [
        { "title": "提前说明", "body": "入住前说明位置、海拔、供氧设备和到店方式。" }
      ]
    },
    "listings": [],
    "reviews": []
  },
  "meta": { "requestId": "req_123" },
  "error": null
}
```

### GET /api/guides/:slug

用途：替换 `/guides/[id]`。

返回结构和 host 类似，但字段使用：

- `guide`
- `yearsGuiding`
- `guidingStyle`
- `trips` 或 `listings`

### GET /api/me

用途：替换 `/profile` 顶部用户信息和设置页基础信息。

第一阶段可以先返回 demo 用户：

```json
{
  "data": {
    "user": {
      "displayName": "旅行者",
      "avatarUrl": null,
      "locale": "zh-CN",
      "currency": "CNY"
    },
    "roles": ["traveler"]
  },
  "meta": { "requestId": "req_123" },
  "error": null
}
```

### GET /api/me/bookings

用途：替换 `/profile` 我的行程。

第一阶段可返回行程占位；第二阶段再绑定真实订单。

### GET /api/me/favorites

用途：替换 `/profile` 收藏清单和各列表卡片收藏状态。

返回列表卡片结构即可。

### POST /api/me/favorites

Body：

```json
{
  "listingPublicId": "route-0"
}
```

### DELETE /api/me/favorites/:listingPublicId

删除收藏。重复删除应幂等返回成功。

## 10. 第二阶段 API 清单

第二阶段再做：

### 预订与支付

- `POST /api/bookings`
- `GET /api/bookings/:bookingNo`
- `PATCH /api/bookings/:bookingNo/cancel`
- `POST /api/payments`
- `POST /api/payments/webhook`

需要补充：

- 创建订单请求体。
- 价格计算规则。
- 库存锁定与释放规则。
- 取消和退款规则。
- webhook 验签、幂等键、重试策略。

### 评价

- `GET /api/listings/:publicId/reviews`
- `POST /api/bookings/:bookingNo/reviews`

需要补充：

- 只有完成订单可评价。
- 同一订单同一 target 是否只能评价一次。
- 评价审核规则。

### 邀请奖励

- `GET /api/referral-programs`
- `POST /api/referral-invites`
- `GET /api/me/referral-invites`
- `GET /api/me/referral-rewards`

需要补充：

- 邀请链接格式。
- 奖励达标条件。
- 审核与发放流程。
- 过期时间。

### 房主/向导后台

游客展示页已做，房主/向导自用后台还没做。后续需要：

- `GET /api/host/listings`
- `POST /api/host/listings`
- `PATCH /api/host/listings/:id`
- `GET /api/guide/routes`
- `POST /api/guide/routes`
- `PATCH /api/guide/routes/:id`
- `GET /api/provider/bookings`
- `GET /api/provider/messages`

## 11. 权限

| 角色 | 权限 |
| --- | --- |
| 游客未登录 | 可浏览首页、列表、详情、房主/向导公开页、邀请奖励规则 |
| 游客登录 | 可收藏、预订、查看个人中心、生成邀请链接 |
| 房主 | 可管理自己的房源、库存、订单、消息 |
| 向导 | 可管理自己的路线、体验、出发场次、订单、消息 |
| 管理员 | 可审核房源、路线、向导、房主、评价和邀请奖励 |

第一阶段如果暂不做真实登录：

- 公共浏览接口不要求 token。
- `viewer.savedListingIds` 可在未登录时返回默认 demo 收藏，或返回空数组。
- 收藏写接口可以先要求登录；未登录时前端继续使用本地状态。

## 12. 状态枚举

### listing.status

- `draft`
- `pending_review`
- `published`
- `paused`
- `archived`

### user.status

- `active`
- `pending`
- `disabled`

### booking.status

- `draft`
- `pending_payment`
- `paid`
- `confirmed`
- `completed`
- `cancelled`
- `refunded`

### payment.status

- `pending`
- `paid`
- `failed`
- `refunded`

### review.status

- `visible`
- `hidden`
- `pending`

### referral_invites.status

- `sent`
- `registered`
- `onboarded`
- `qualified`
- `expired`
- `rejected`

### referral_rewards.status

- `pending`
- `approved`
- `paid`
- `rejected`

## 13. 前端替换 mock 顺序

建议按下面顺序替换，风险最低：

1. `/api/home` 替换 `src/components/airbnb-clone-page.tsx` 首页 `homeSections`、`tabs`、`destinations`、`inspirationTabs`、`inspirationPlaces`。
2. `/api/listings?type=...` 替换 `/homes`、`/routes`、`/experiences`、`/services` 的列表数据。
3. `/api/listings/:publicId` 替换 `/rooms/[id]`。
4. `/api/hosts/:slug` 和 `/api/guides/:slug` 替换公开主页。
5. `/api/me`、`/api/me/bookings`、`/api/me/favorites` 替换 `/profile`。
6. `/api/referral-programs`、`/api/referral-invites` 替换 `/referrals`。

## 14. 第一阶段验收标准

后端第一阶段完成时，至少满足：

- 数据库有 seed 数据，覆盖当前首页所有卡片。
- `/api/home` 能返回首页三个横向 section：热门线路、高原舒适住宿、当地体验与周边。
- `/api/listings?type=home` 返回 12 个房源。
- `/api/listings?type=route` 返回 9 个路线。
- `/api/listings?type=experience` 返回 4 个体验。
- `/api/listings?type=service` 返回 7 个周边。
- `/api/listings/stay-0` 返回房源详情、照片、房主和基础 availability。
- `/api/listings/route-0` 返回路线详情、照片、向导、每日安排和基础 availability。
- `/api/hosts/yangjin` 返回房主公开主页所需数据。
- `/api/guides/yangjin` 返回向导公开主页所需数据。
- 收藏状态能通过 `viewer.savedListingIds` 或 `/api/me/favorites` 返回。
- 前端替换 mock 后 `npm run check` 通过。
- 桌面和 390px 移动视口主要页面无明显布局回退。

## 15. 环境变量建议

后端项目应提供 `.env.example`，至少包含：

```text
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
OBJECT_STORAGE_ENDPOINT=
OBJECT_STORAGE_BUCKET=
OBJECT_STORAGE_ACCESS_KEY=
OBJECT_STORAGE_SECRET_KEY=
REDIS_URL=
PAYMENT_WEBHOOK_SECRET=
```

如果后端作为独立服务运行，还需要：

- CORS 允许本地前端地址。
- Cookie domain / sameSite 策略。
- 生产环境 HTTPS。
- 日志 request id。
- 数据库迁移和 seed 命令。

## 16. 后端注意事项

- `public_id` 和 `slug` 要稳定，不能随数据库自增 id 改变。
- 金额用整数分或 decimal，不要用浮点数。
- 图片只存 URL 和排序，不要把图片二进制放数据库。
- 搜索条件要兼容房源和路线：地点、日期、人数、价格、类型。
- 房源、路线、体验、周边可以共用 `listings`，但详情扩展字段要拆表，避免主表越来越乱。
- 评价正式上线时必须绑定完成订单，避免无订单评价。
- 支付 webhook 必须幂等。
- 预订库存扣减要放事务里，避免超卖。
- 列表卡片接口要返回 `href` 或足够字段让前端拼出 `/rooms/{publicId}`。
- 体验和周边的独立详情模板还没做，后端可以先提供 `serviceDetail`，前端后续再接。
- Unsplash 远程图片只是原型占位，正式环境建议替换为项目自己的稳定图片资源或对象存储 URL。

## 17. 维护规则

当前文档是新版后端交接文档。后续只要前端新增以下内容，就同步更新本文档：

- 新页面或路由。
- 新商品类型。
- 新订单、支付、评价、邀请奖励规则。
- 新字段或状态枚举。
- mock 数据结构变化。
- API 返回结构变化。
- seed 数据变化。

## 18. 前端图标更新（2026-10-10）

分类图标已替换为本地岩画 WebP，动画由 PetroglyphTab 前端组件处理；不新增 API、商品字段或路由。移动端新增同样的五个分类导航入口。详情见 PETROGLYPH_ICONS.md。

路线页新增平台推荐司机展示：当前为 8 条前端 mock（name、rating、photo），后续需接入真实司机资料与头像。详情已增加 /drivers/[id]；尚未增加实际 API。

## 司机详情（2026-10-10）

新增 /drivers/[id]，推荐司机卡片链接到各自资料页，支持 8 个稳定 id，未知 id 返回 404。上方司机与旅途、车辆各一张大图和四张可切换缩略图，下方展示常跑路线整车报价、按天包车和电话/微信信息。共享司机数据在 src/lib/drivers.ts；路线、车型、价格与图片为 mock，联系方式留空待提供。当前没有司机与羊的真实合照，照片槽位可替换。后端后续提供司机相册、车辆相册、路线报价、包车日价、电话及微信资料。

后端快速入口与新增司机接口字段见 BACKEND_QUICKSTART.md。
