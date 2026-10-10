import "@/components/tisee-detail-theme.css";
import Image from "next/image";
import Link from "next/link";

const guideStats = [
  { label: "评价", value: "128" },
  { label: "评分", value: "4.96" },
  { label: "带队", value: "6 年" },
];

const guideFacts = [
  "身份资料已核验",
  "通常 1 小时内回复",
  "会说普通话、藏语、英语基础沟通",
  "常驻拉萨城关区",
];

const guideTrips = [
  {
    title: "拉萨城市慢行",
    detail: "八廓街、大昭寺、甜茶馆与老城生活线索",
    price: "¥188 / 人起",
    href: "/rooms/route-6",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "纳木错轻徒步",
    detail: "湖泊、星空与高原节奏适应建议",
    price: "¥1,280 / 人起",
    href: "/rooms/route-0",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "阿里南线深度行",
    detail: "冈仁波齐、玛旁雍措与古格遗址",
    price: "¥5,880 / 人起",
    href: "/rooms/route-4",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  },
];

const reviews = [
  {
    name: "陈同学",
    meta: "2026年8月 · 拉萨城市慢行",
    text: "央金会把节奏放得很稳，第一天没有强行赶景点。她带我们在甜茶馆坐下来讲八廓街的方向感，这比单纯打卡舒服很多。",
  },
  {
    name: "Mina",
    meta: "2026年7月 · 纳木错轻徒步",
    text: "出发前她提醒了保暖、补水和拍摄时间，路上也一直观察大家状态。对第一次进藏的人来说，这种安心感很重要。",
  },
];

export default function GuideProfilePage() {
  return (
    <div className="guide-page">
      <header className="guide-header">
        <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页">
          <span className="brand-mark">T</span>
          <span className="brand-text">Tisee</span>
        </Link>
        <nav aria-label="向导页导航">
          <Link href="/routes">返回路线</Link>
          <Link href="/profile">个人中心</Link>
        </nav>
      </header>

      <main className="guide-main">
        <section className="guide-hero" aria-labelledby="guide-title">
          <aside className="guide-profile-card" aria-label="向导概览">
            <div className="guide-avatar-wrap">
              <span className="guide-avatar">央</span>
              <span className="guide-badge">本地向导</span>
            </div>
            <h1 id="guide-title">央金</h1>
            <p>拉萨在地旅行顾问</p>
            <div className="guide-stat-grid">
              {guideStats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong>
                  <small>{stat.label}</small>
                </span>
              ))}
            </div>
          </aside>

          <div className="guide-intro">
            <p className="guide-eyebrow">游客可见的向导资料</p>
            <h2>你好，我是央金，会用慢一点的节奏带你认识拉萨和西藏。</h2>
            <p>
              我常年在拉萨接待第一次进藏的旅行者，也会为摄影、亲子和深度文化路线做节奏规划。比起把行程塞满，我更在意你能不能舒服地适应海拔、理解当地生活，并把想看的风景留在合适的时间里。
            </p>
            <div className="guide-facts">
              {guideFacts.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="guide-layout">
          <div className="guide-content">
            <section className="guide-section" aria-labelledby="about-guide">
              <h2 id="about-guide">关于央金</h2>
              <div className="guide-two-column">
                <p>
                  我出生在山南，在拉萨生活多年。路线设计时会先问清楚同行人的年龄、抵达时间、睡眠情况和想看的主题，再决定当天是适合进寺院、去湖边，还是只在老城慢慢走。
                </p>
                <p>
                  如果你喜欢人文，我会把寺院礼仪、转经路线和街巷故事讲清楚；如果你喜欢摄影，我会提前沟通光线、机位和车程。遇到高反苗头时，我们会立刻放慢节奏。
                </p>
              </div>
            </section>

            <section className="guide-section" aria-labelledby="host-style">
              <h2 id="host-style">她的带队方式</h2>
              <div className="guide-value-grid">
                {[
                  ["节奏稳定", "行程默认留出适应高原的缓冲时间，不鼓励赶路式打卡。"],
                  ["讲解克制", "重点讲清历史、礼仪和生活背景，给游客留出自己观察的空间。"],
                  ["应急清晰", "出发前说明天气、路况和身体信号，途中根据状态调整停留。"],
                ].map(([title, body]) => (
                  <article key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="guide-section" aria-labelledby="guide-trips">
              <div className="guide-section-heading">
                <h2 id="guide-trips">央金参与设计的路线</h2>
                <Link href="/routes">查看全部路线</Link>
              </div>
              <div className="guide-trip-list">
                {guideTrips.map((trip) => (
                  <Link className="guide-trip-card" href={trip.href} key={trip.title}>
                    <Image src={trip.image} alt="" width={360} height={240} sizes="(max-width: 743px) 100vw, 240px" />
                    <span>
                      <strong>{trip.title}</strong>
                      <small>{trip.detail}</small>
                      <b>{trip.price}</b>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="guide-section" aria-labelledby="guide-reviews">
              <h2 id="guide-reviews">游客评价</h2>
              <div className="guide-review-grid">
                {reviews.map((review) => (
                  <article key={review.name}>
                    <strong>{review.name}</strong>
                    <small>{review.meta}</small>
                    <p>{review.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="guide-contact-card" aria-label="联系向导">
            <strong>想让央金帮你看看路线？</strong>
            <p>当前仅为前端原型，不会发送真实消息。后续可以接入咨询、收藏和向导自用工作台。</p>
            <Link href="/routes">继续挑选路线</Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
