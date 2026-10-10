import "@/components/tisee-detail-theme.css";
import Image from "next/image";
import Link from "next/link";

type RouteDetail = {
  title: string;
  eyebrow: string;
  summary: string;
  price: string;
  rating: string;
  reviews: number;
  location: string;
  guideIntro: string;
};

const routeDetails: Record<string, RouteDetail> = {
  "route-0": {
    title: "拉萨 + 纳木错 4 日小环线",
    eyebrow: "路线推荐 · 初次进藏友好",
    summary: "4 天 · 3 晚 · 轻徒步 · 拉萨出发",
    price: "¥1,280 / 人起",
    rating: "4.96",
    reviews: 128,
    location: "拉萨集合，前往纳木错与念青唐古拉山沿线",
    guideIntro: "央金会在出发前帮你确认高原适应节奏，并根据天气调整湖边停留时间。",
  },
  "route-1": {
    title: "林芝桃花沟 3 日摄影行",
    eyebrow: "路线推荐 · 花季热门",
    summary: "3 天 · 2 晚 · 摄影 · 河谷村落",
    price: "¥980 / 人起",
    rating: "4.91",
    reviews: 86,
    location: "林芝集合，途经桃花沟、尼洋河谷与村落",
    guideIntro: "向导会根据花期和光线安排拍摄，不把一天塞成连续赶路。",
  },
  "route-2": {
    title: "日喀则 + 珠峰 5 日",
    eyebrow: "路线推荐 · 雪山观景",
    summary: "5 天 · 4 晚 · 高海拔 · 羊湖与珠峰",
    price: "¥2,360 / 人起",
    rating: "4.94",
    reviews: 112,
    location: "拉萨出发，经过羊湖、日喀则与珠峰观景点",
    guideIntro: "路线会留出海拔变化的缓冲，不建议第一次进藏直接追求高强度行程。",
  },
  "route-3": {
    title: "山南文化 2 日",
    eyebrow: "路线推荐 · 文化精选",
    summary: "2 天 · 1 晚 · 寺院 · 藏源文化",
    price: "¥760 / 人起",
    rating: "4.89",
    reviews: 57,
    location: "拉萨出发，前往雍布拉康与桑耶寺",
    guideIntro: "这是一条适合慢慢听故事的短线，会把寺院礼仪和参访时间讲清楚。",
  },
  "route-4": {
    title: "阿里南线 8 日",
    eyebrow: "路线推荐 · 向导深度推荐",
    summary: "8 天 · 7 晚 · 深度探索 · 湖泊与古格",
    price: "¥5,880 / 人起",
    rating: "4.98",
    reviews: 42,
    location: "日喀则方向出发，前往冈仁波齐、玛旁雍措与古格王朝",
    guideIntro: "央金会在出发前逐段确认身体状态、车辆节奏和住宿条件，适合有充分时间的旅行者。",
  },
  "route-5": {
    title: "羊卓雍措半日行",
    eyebrow: "路线推荐 · 短途精选",
    summary: "半日 · 私家车 · 蓝湖观景 · 轻松往返",
    price: "¥260 / 人起",
    rating: "4.87",
    reviews: 204,
    location: "拉萨出发，前往羊卓雍措观景点",
    guideIntro: "时间短、节奏稳，适合把它作为拉萨行程中的一天缓冲。",
  },
  "route-6": {
    title: "拉萨城市漫游",
    eyebrow: "路线推荐 · 城市经典",
    summary: "1 天 · 步行 · 八廓街 · 本地茶馆",
    price: "¥188 / 人起",
    rating: "4.93",
    reviews: 176,
    location: "拉萨城关区集合，步行探索八廓街与大昭寺周边",
    guideIntro: "从城市生活开始认识西藏，不急着把所有景点一次走完。",
  },
  "route-7": {
    title: "鲁朗森林轻徒步",
    eyebrow: "路线推荐 · 亲子友好",
    summary: "2 天 · 1 晚 · 轻户外 · 森林牧场",
    price: "¥680 / 人起",
    rating: "4.88",
    reviews: 61,
    location: "林芝出发，前往鲁朗森林与牧场",
    guideIntro: "路程安排更适合家庭同行，途中会保留休息和看风景的时间。",
  },
  "route-8": {
    title: "波密冰川与然乌湖",
    eyebrow: "路线推荐 · 小众摄影",
    summary: "4 天 · 3 晚 · 摄影 · 冰川与湖泊",
    price: "¥1,680 / 人起",
    rating: "4.92",
    reviews: 49,
    location: "波密集合，前往然乌湖与周边冰川观景点",
    guideIntro: "适合想看河谷、冰川和湖泊变化的旅行者，节奏会随天气调整。",
  },
};

const homeData = {
  title: "八廓街旁藏式庭院，靠近布达拉宫的独立房间",
  eyebrow: "房客推荐 · 拉萨城关区",
  summary: "1 间卧室 · 1 张大床 · 独立卫浴 · 可供氧",
  price: "¥368 CNY / 晚",
  rating: "4.92",
  reviews: 93,
  location: "拉萨市城关区，步行可到八廓街与大昭寺",
};

const photos = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=900&q=80",
];

const routePhotos = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
];

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isRoute = id.startsWith("route-");
  const route = routeDetails[id] ?? routeDetails["route-0"];

  return (
    <div className={isRoute ? "room-page route-detail-page" : "room-page"}>
      <DetailHeader isRoute={isRoute} />
      <main className="room-detail">
        <section className="room-title-row">
          <div>
            <p>{isRoute ? route.eyebrow : homeData.eyebrow}</p>
            <h1>{isRoute ? route.title : homeData.title}</h1>
          </div>
          <div className="room-actions">
            <button type="button">⇧ 分享</button>
            <button type="button">♡ 收藏</button>
          </div>
        </section>

        <section className="photo-mosaic" aria-label={isRoute ? "路线照片" : "房源照片"}>
          {(isRoute ? routePhotos : photos).map((photo, index) => (
            <div className={index === 0 ? "photo-main" : ""} key={photo}>
              <Image src={photo} alt={`${isRoute ? "路线" : "房源"}照片 ${index + 1}`} fill sizes={index === 0 ? "50vw" : "25vw"} priority={index === 0} />
            </div>
          ))}
          <button type="button" className="show-photos-button">▦ 显示所有照片</button>
        </section>

        {isRoute ? <RouteDetailBody route={route} /> : <HomeDetailBody />}
      </main>
    </div>
  );
}

function DetailHeader({ isRoute }: { isRoute: boolean }) {
  const label = isRoute ? "路线" : "房源";
  const category = isRoute ? "routes" : "homes";
  return (
    <header className="room-header room-simple-header">
      <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页">
        <span className="brand-mark">T</span>
        <span className="brand-text">Tisee</span>
      </Link>
      <Link className="room-category-link" href={isRoute ? "/routes" : "/homes"} aria-label={`返回${label}列表`}>
        <Image src={`/icons/petroglyph/${category}.webp`} alt="" width={38} height={38} />
        <span>{label}</span>
      </Link>
    </header>
  );
}

function HomeDetailBody() {
  return (
    <>
      <section className="room-body">
        <div className="room-main-copy">
          <section className="room-summary">
            <h2>房源 | 西藏拉萨市城关区</h2>
            <p>{homeData.summary}</p>
            <p className="rating-line">★ {homeData.rating} · {homeData.reviews} 条评价</p>
          </section>
          <section className="host-strip" aria-label="房主信息">
            <Link className="host-strip-link" href="/hosts/yangjin" prefetch={false}>
              <span aria-hidden="true">T</span>
              <div>
                <strong>由央金房主接待</strong>
                <p>本地房主 · 6 年接待经验 · 查看房主资料</p>
              </div>
            </Link>
          </section>
          <section className="room-feature-list">
            <div><strong>位置便利</strong><p>步行可到八廓街，清晨适合慢慢进入高原节奏。</p></div>
            <div><strong>高原友好</strong><p>房间提供基础供氧与加湿设备，适合初次进藏游客。</p></div>
            <div><strong>入住说明</strong><p>适合 1 至 2 位旅行者，入住前可向房主咨询周边生活建议。</p></div>
          </section>
        </div>
        <aside className="reservation-card" aria-label="房源预订卡片">
          <p><strong>{homeData.price}</strong></p>
          <div className="reservation-grid">
            <button type="button"><span>入住</span>2月5日</button>
            <button type="button"><span>退房</span>2月7日</button>
            <button type="button"><span>房客</span>1 位房客</button>
          </div>
          <button className="reserve-button" type="button">预订房源</button>
          <small>当前仅为前端原型，不会产生真实订单。</small>
        </aside>
      </section>
      <DetailAnchors items={["照片", "房源位置", "评价", "便利设施"]} />
      <LocationSection title="房源位置" location={homeData.location} />
    </>
  );
}

function RouteDetailBody({ route }: { route: RouteDetail }) {
  return (
    <>
      <section className="room-body route-body">
        <div className="room-main-copy">
          <section className="room-summary">
            <h2>路线详情</h2>
            <p>{route.summary}</p>
            <p className="rating-line">★ {route.rating} · {route.reviews} 条评价</p>
          </section>
          <section className="host-strip" aria-label="向导信息">
            <Link className="host-strip-link" href="/guides/yangjin" prefetch={false}>
              <span aria-hidden="true">T</span>
              <div>
                <strong>由央金带队</strong>
                <p>西藏本地向导 · 查看向导公开资料</p>
              </div>
            </Link>
          </section>
          <section className="route-itinerary" aria-labelledby="itinerary-title">
            <h2 id="itinerary-title">行程安排</h2>
            {[
              ["第 1 天", "拉萨集合", "入住后轻松适应海拔，和向导确认接下来几天的节奏。"],
              ["第 2 天", "城市与湖泊", "从拉萨出发，沿途看雪山与湖泊，安排充足停留时间。"],
              ["第 3 天", "纳木错慢游", "湖边散步、看星空或根据天气调整为更舒缓的观景安排。"],
              ["第 4 天", "返回拉萨", "早餐后返程，预留自由时间，结束这次小环线。"],
            ].map(([day, title, detail]) => (
              <article key={day}><span>{day}</span><div><strong>{title}</strong><p>{detail}</p></div></article>
            ))}
          </section>
          <section className="room-feature-list">
            <div><strong>适合谁</strong><p>第一次进藏、希望节奏稳定，或者想把湖泊和城市一起体验的旅行者。</p></div>
            <div><strong>路线包含</strong><p>向导服务、路线建议、行程中的基础交通协调与每日节奏提醒。</p></div>
            <div><strong>出发前提醒</strong><p>{route.guideIntro}</p></div>
          </section>
        </div>
        <aside className="reservation-card route-booking-card" aria-label="路线预订卡片">
          <p><strong>{route.price}</strong></p>
          <div className="reservation-grid">
            <button type="button"><span>出发日期</span>选择日期</button>
            <button type="button"><span>行程长度</span>{route.summary.split("·")[0].trim()}</button>
            <button type="button"><span>旅行者</span>2 位旅行者</button>
          </div>
          <button className="reserve-button" type="button">选择路线</button>
          <small>当前仅为前端原型，不会产生真实订单。</small>
        </aside>
      </section>
      <DetailAnchors items={["照片", "行程安排", "评价", "出发位置"]} />
      <LocationSection title="出发位置" location={route.location} />
    </>
  );
}

function DetailAnchors({ items }: { items: string[] }) {
  return <nav className="room-anchor-nav" aria-label="详情页导航">{items.map((item, index) => <a href={`#detail-section-${index}`} key={item}>{item}</a>)}</nav>;
}

function LocationSection({ title, location }: { title: string; location: string }) {
  return (
    <section id="detail-section-3" className="room-location">
      <h2>{title}</h2>
      <p>{location}</p>
      <div className="room-map-placeholder" aria-label="地图占位">
        <div className="map-search-pill">⌕ 探索西藏当地体验</div>
        <div className="home-pin">⌂</div>
        <span>地图功能预留</span>
      </div>
    </section>
  );
}
