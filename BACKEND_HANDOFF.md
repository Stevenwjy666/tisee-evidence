# 后端交接文档

更新时间：2026-09-23

## 1. 项目定位

这是一个西藏旅行 marketplace 前端原型，展示方式参考 Airbnb 的信息层级，但品牌、文案、图片和业务内容均为原创 Tibetbnb。

当前前端没有真实后端，所有业务数据仍写在 React/TypeScript mock 中。后端目标是把这些 mock 逐步替换为数据库、API、鉴权、预订、支付、评价和邀请奖励系统。

## 2. 当前页面与业务对象

| 前端路由 | 页面 | 后端对象 |
| --- | --- | --- |
| `/` | 首页混合推荐 | 分类、推荐房源、推荐路线、体验、周边、目的地灵感 |
| `/homes` | 房源列表 | 房源商品、筛选、收藏状态 |
| `/routes` | 路线列表 | 路线商品、筛选、收藏状态 |
| `/experiences` | 在地体验列表 | 体验商品，暂未做独立详情页 |
| `/services` | 西藏周边列表 | 实物或服务商品，暂未做独立详情页 |
| `/rooms/[id]` | 详情页 | 按 id 区分房源详情和路线详情 |
| `/hosts/[id]` | 房主公开主页 | 房主资料、名下房源、住客评价 |
| `/guides/[id]` | 向导公开主页 | 向导资料、名下路线、游客评价 |
| `/profile` | 游客个人中心 | 用户资料、行程、收藏、账户设置 |
| `/referrals` | 邀请奖励页 | 邀请规则、邀请码、奖励记录 |

关键前端规则：

- `stay-*` 是房源详情，房源关联房主。
- `route-*` 是路线详情，路线关联向导。
- 体验 `experience-*` 和周边 `service-*` 当前只在列表中展示，后续需要独立详情页。
- 只保留标准房源、路线、体验、周边商品，不新增其他行程类型。
- 顶部客服入口文案是“客服中心”。

## 3. 建议后端栈

优先选择稳定、方便前端逐页替换 mock 的方案：

- API：REST。
- 数据库：PostgreSQL。
- ORM：Prisma 或 Drizzle。
- 鉴权：JWT + refresh token，或 Auth.js/NextAuth。
- 文件：对象存储，保存头像、房源图、路线图、商品图。
- 缓存：Redis 后置，用于热门推荐、会话、验证码、限流。
- 搜索：第一阶段 PostgreSQL full-text + 索引；后续再接 Meilisearch/Elasticsearch。

## 4. 核心数据模型

### users

登录账号表。一个用户可以是游客、房主、向导或管理员。

字段：

- `id`
- `email`
- `phone`
- `password_hash`
- `display_name`
- `avatar_url`
- `bio`
- `locale`
- `currency`
- `status`: `active | pending | disabled`
- `created_at`
- `updated_at`

### user_roles

用户角色表。

字段：

- `id`
- `user_id`
- `role`: `traveler | host | guide | admin`
- `created_at`

### host_profiles

房主公开资料，对应 `/hosts/[id]`。

字段：

- `id`
- `user_id`
- `slug`
- `display_name`
- `headline`
- `location`
- `years_hosting`
- `response_time`
- `languages`
- `verified_identity`
- `about`
- `hosting_style`
- `rating_avg`
- `review_count`
- `created_at`
- `updated_at`

### guide_profiles

向导公开资料，对应 `/guides/[id]`。

字段：

- `id`
- `user_id`
- `slug`
- `display_name`
- `headline`
- `base_location`
- `years_guiding`
- `response_time`
- `languages`
- `verified_identity`
- `about`
- `guiding_style`
- `rating_avg`
- `review_count`
- `created_at`
- `updated_at`

### listings

统一商品主表，房源、路线、体验、周边都放这里。前端列表卡片主要来自此表。

字段：

- `id`
- `public_id`: 前端 URL 用，例如 `stay-0`、`route-4`
- `type`: `home | route | experience | product`
- `title`
- `subtitle`
- `location`
- `summary`
- `badge`
- `price_amount`
- `price_currency`
- `price_unit`: `night | person | group | item`
- `rating_avg`
- `review_count`
- `owner_user_id`
- `host_profile_id`
- `guide_profile_id`
- `status`: `draft | pending_review | published | paused | archived`
- `created_at`
- `updated_at`

约束：

- `type = home` 必须关联 `host_profile_id`。
- `type = route` 或 `experience` 必须关联 `guide_profile_id`。
- `type = product` 可关联运营账号或商家账号。

### listing_media

商品图片表。

字段：

- `id`
- `listing_id`
- `url`
- `alt`
- `sort_order`
- `is_cover`
- `created_at`

### home_details

房源详情扩展表。

字段：

- `listing_id`
- `bedrooms`
- `beds`
- `bathrooms`
- `max_guests`
- `amenities`
- `checkin_time`
- `checkout_time`
- `address_text`
- `map_lat`
- `map_lng`
- `house_rules`
- `high_altitude_support`

### route_details

路线详情扩展表。

字段：

- `listing_id`
- `duration_days`
- `duration_nights`
- `start_location`
- `end_location`
- `difficulty_level`
- `altitude_note`
- `included_items`
- `excluded_items`
- `suitable_for`
- `pre_departure_note`

### route_itinerary_days

路线每日安排。

字段：

- `id`
- `listing_id`
- `day_number`
- `title`
- `description`
- `location`
- `sort_order`

### product_details

体验和周边扩展表。后续也可以拆成 `experience_details` 与 `merchandise_details`。

字段：

- `listing_id`
- `delivery_type`: `onsite | physical_shipping | digital | pickup`
- `duration_minutes`
- `sku`
- `inventory_count`
- `shipping_note`
- `service_note`

### availability

可订库存表。房源按晚，路线和体验按出发场次，周边按库存。

字段：

- `id`
- `listing_id`
- `date`
- `start_time`
- `end_time`
- `capacity`
- `remaining_capacity`
- `price_amount`
- `status`: `available | blocked | sold_out`

### bookings

订单主表。

字段：

- `id`
- `booking_no`
- `traveler_user_id`
- `listing_id`
- `type`: `home | route | experience | product`
- `start_date`
- `end_date`
- `guest_count`
- `unit_price_amount`
- `total_amount`
- `currency`
- `status`: `draft | pending_payment | paid | confirmed | completed | cancelled | refunded`
- `contact_name`
- `contact_phone`
- `notes`
- `created_at`
- `updated_at`

### payments

支付记录表。

字段：

- `id`
- `booking_id`
- `provider`: `wechat_pay | alipay | stripe | manual`
- `provider_trade_no`
- `amount`
- `currency`
- `status`: `pending | paid | failed | refunded`
- `paid_at`
- `created_at`

### reviews

评价表。

字段：

- `id`
- `booking_id`
- `listing_id`
- `reviewer_user_id`
- `target_user_id`
- `target_type`: `listing | host | guide`
- `rating`
- `content`
- `travel_date`
- `status`: `visible | hidden | pending`
- `created_at`

### favorites

收藏表。

字段：

- `id`
- `user_id`
- `listing_id`
- `created_at`

当前前端默认收藏 mock：`route-0`、`stay-1`、`stay-3`。

### destinations

目的地和灵感标签。

字段：

- `id`
- `name`
- `kind`
- `parent_id`
- `description`
- `cover_image_url`
- `sort_order`
- `status`

### referral_programs

邀请奖励规则。

字段：

- `id`
- `role_target`: `host | guide`
- `title`
- `reward_amount`
- `currency`
- `qualification_rule`
- `status`: `active | paused | archived`
- `created_at`
- `updated_at`

### referral_invites

邀请记录。

字段：

- `id`
- `program_id`
- `inviter_user_id`
- `invitee_user_id`
- `invitee_phone`
- `invitee_email`
- `invite_code`
- `invite_url`
- `status`: `sent | registered | onboarded | qualified | expired | rejected`
- `created_at`
- `updated_at`

### referral_rewards

奖励发放记录。

字段：

- `id`
- `referral_invite_id`
- `inviter_user_id`
- `amount`
- `currency`
- `status`: `pending | approved | paid | rejected`
- `approved_at`
- `paid_at`
- `created_at`

## 5. 当前前端 mock 来源

| 文件 | 现有 mock 内容 |
| --- | --- |
| `src/components/airbnb-clone-page.tsx` | 首页、分类页、搜索栏、目的地、列表卡片、收藏初始状态、菜单入口 |
| `src/app/rooms/[id]/page.tsx` | 房源详情、路线详情、路线每日安排、预订卡片 |
| `src/app/hosts/[id]/page.tsx` | 房主公开资料、房源列表、住客评价 |
| `src/app/guides/[id]/page.tsx` | 向导公开资料、路线列表、游客评价 |
| `src/app/profile/page.tsx` | 游客资料中心、行程、收藏、账户设置 |
| `src/app/referrals/page.tsx` | 邀请房东/向导奖励规则、流程、生成邀请入口 |

## 6. API 建议

### 公共浏览

- `GET /api/home`
- `GET /api/listings?type=home|route|experience|product`
- `GET /api/listings/:publicId`
- `GET /api/hosts/:slug`
- `GET /api/guides/:slug`
- `GET /api/destinations`
- `GET /api/search?q=&type=&startDate=&endDate=&guests=`

### 登录用户

- `GET /api/me`
- `PATCH /api/me`
- `GET /api/me/bookings`
- `GET /api/me/favorites`
- `POST /api/me/favorites`
- `DELETE /api/me/favorites/:listingId`

### 预订与支付

- `POST /api/bookings`
- `GET /api/bookings/:bookingNo`
- `PATCH /api/bookings/:bookingNo/cancel`
- `POST /api/payments`
- `POST /api/payments/webhook`

### 评价

- `GET /api/listings/:publicId/reviews`
- `POST /api/bookings/:bookingNo/reviews`

### 邀请奖励

- `GET /api/referral-programs`
- `POST /api/referral-invites`
- `GET /api/me/referral-invites`
- `GET /api/me/referral-rewards`

### 后续房主/向导后台

游客展示页已做，房主/向导自用后台还没做。后续需要：

- `GET /api/host/listings`
- `POST /api/host/listings`
- `PATCH /api/host/listings/:id`
- `GET /api/guide/routes`
- `POST /api/guide/routes`
- `PATCH /api/guide/routes/:id`
- `GET /api/provider/bookings`
- `GET /api/provider/messages`

## 7. 统一返回格式

建议所有接口使用同一层结构，方便前端处理 loading、error、pagination。

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

错误格式：

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

## 8. 详情接口返回重点

`GET /api/listings/stay-0` 应返回：

- `listing.type = "home"`
- 基础卡片字段：标题、副标题、位置、价格、评分、封面图、相册。
- `homeDetail`：卧室、床、卫浴、人数、便利设施、入住规则、地图位置。
- `host`：房主 slug、名称、头像、接待年限、回复时间。
- `reviews`：首屏评价。
- `availability`：可选日期和价格。

`GET /api/listings/route-0` 应返回：

- `listing.type = "route"`
- 基础卡片字段：标题、副标题、位置、价格、评分、封面图、相册。
- `routeDetail`：天数、晚数、集合地、路线强度、适合人群、出发提醒。
- `itineraryDays`：每日安排。
- `guide`：向导 slug、名称、头像、带队年限、回复时间。
- `reviews`：首屏评价。
- `availability`：出发日期、名额、价格。

## 9. 首页接口返回重点

`GET /api/home` 建议返回：

- `tabs`：全部、房源、路线、体验、周边。
- `sections`：每个首页横向滚动区域。
- `inspirationTabs`：热门、艺术与文化、湖泊、山区、户外、在地体验。
- `destinations`：搜索弹窗中的目的地建议。
- `viewer`：当前用户登录状态和收藏 id 列表。

## 10. 权限

- 游客未登录：可浏览首页、列表、详情、房主/向导公开页、邀请奖励规则。
- 游客登录：可收藏、预订、查看个人中心、生成邀请链接。
- 房主：可管理自己的房源、库存、订单、消息。
- 向导：可管理自己的路线、出发场次、订单、消息。
- 管理员：可审核房源、路线、向导、房主、评价和邀请奖励。

## 11. 状态枚举

### listing.status

- `draft`
- `pending_review`
- `published`
- `paused`
- `archived`

### booking.status

- `draft`
- `pending_payment`
- `paid`
- `confirmed`
- `completed`
- `cancelled`
- `refunded`

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

## 12. 第一阶段后端范围

建议先做这些，能最快替换前端 mock：

1. 建表：`users`、`user_roles`、`host_profiles`、`guide_profiles`、`listings`、`listing_media`、`home_details`、`route_details`、`route_itinerary_days`、`favorites`。
2. 种子数据：录入现有首页、房源、路线、房主、向导 mock。
3. 接口：`/api/home`、`/api/listings`、`/api/listings/:publicId`、`/api/hosts/:slug`、`/api/guides/:slug`。
4. 收藏：登录后真实收藏；未登录时前端可继续本地状态。
5. 个人中心：先返回用户资料、收藏、行程占位。

第二阶段再做：

1. `availability`、`bookings`、`payments`。
2. `reviews`。
3. `/referrals` 邀请奖励链路。
4. 房主/向导自用后台。
5. 搜索服务和推荐排序。

## 13. 前端替换 mock 顺序

1. `/api/home` 替换 `src/components/airbnb-clone-page.tsx` 首页 sections。
2. `/api/listings?type=...` 替换 `/homes`、`/routes`、`/experiences`、`/services`。
3. `/api/listings/:publicId` 替换 `/rooms/[id]`。
4. `/api/hosts/:slug` 和 `/api/guides/:slug` 替换公开主页。
5. `/api/me`、`/api/me/bookings`、`/api/me/favorites` 替换 `/profile`。
6. `/api/referral-programs`、`/api/referral-invites` 替换 `/referrals`。

## 14. 后端注意事项

- `public_id` 和 `slug` 要稳定，不能随数据库自增 id 改变。
- 金额用整数分或 decimal，不要用浮点数。
- 图片只存 URL 和排序，不要把图片二进制放数据库。
- 搜索条件要兼容房源和路线：地点、日期、人数、价格、类型。
- 房源、路线、体验、周边可以共用 `listings`，但详情扩展字段要拆表，避免主表越来越乱。
- 评价必须绑定完成订单，避免无订单评价。
- 支付 webhook 必须幂等。
- 预订库存扣减要放事务里，避免超卖。

## 15. 维护规则

当前文档是后端交接主文档。后续只要前端新增以下内容，就同步更新本文档：

- 新页面或路由。
- 新商品类型。
- 新订单、支付、评价、邀请奖励规则。
- 新字段或状态枚举。
- mock 数据结构变化。
