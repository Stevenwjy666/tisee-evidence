import Image from "next/image";
import Link from "next/link";

const hostStats = [
  { label: "评价", value: "93" },
  { label: "评分", value: "4.92" },
  { label: "接待", value: "6 年" },
];

const hostFacts = [
  "身份资料已核验",
  "通常 1 小时内回复",
  "会说普通话、藏语、英语基础沟通",
  "常住拉萨城关区",
];

const hostHomes = [
  {
    title: "八廓街旁藏式庭院",
    detail: "独立房间 · 可供氧 · 步行到大昭寺",
    price: "¥368 CNY / 晚",
    rating: "4.92",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    href: "/rooms/stay-0",
  },
  {
    title: "拉萨供氧酒店客房",
    detail: "市中心 · 供氧设备 · 适合初次进藏",
    price: "¥498 CNY / 晚",
    rating: "4.91",
    image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80",
    href: "/rooms/stay-6",
  },
  {
    title: "色拉寺旁静心客房",
    detail: "独立房间 · 安静街区 · 适合长住",
    price: "¥318 CNY / 晚",
    rating: "4.85",
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=900&q=80",
    href: "/rooms/stay-10",
  },
];

const reviews = [
  {
    name: "周先生",
    meta: "2026年8月 · 入住 3 晚",
    text: "房间离八廓街很近，央金提前把供氧设备和周边餐馆都说明白了。第一次进藏，沟通起来很安心。",
  },
  {
    name: "林小姐",
    meta: "2026年7月 · 入住 2 晚",
    text: "她不会过度打扰，但需要帮助时回复很快。早上推荐的甜茶馆很适合慢慢开始一天。",
  },
];

export default function HostProfilePage() {
  return (
    <div className="host-page">
      <header className="host-header">
        <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页">
          <span className="brand-mark">T</span>
          <span className="brand-text">Tisee</span>
        </Link>
        <nav aria-label="房主页导航">
          <Link href="/homes">返回房源</Link>
          <Link href="/profile">个人中心</Link>
        </nav>
      </header>

      <main className="host-main">
        <section className="host-hero" aria-labelledby="host-title">
          <aside className="host-profile-card" aria-label="房主概览">
            <div className="host-avatar-wrap">
              <span className="host-avatar">央</span>
              <span className="host-badge">房客推荐</span>
            </div>
            <h1 id="host-title">央金</h1>
            <p>拉萨本地房主</p>
            <div className="host-stat-grid">
              {hostStats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong>
                  <small>{stat.label}</small>
                </span>
              ))}
            </div>
          </aside>

          <div className="host-intro">
            <p className="host-eyebrow">游客可见的房主资料</p>
            <h2>欢迎来到拉萨，希望你在这里住得自在，也慢慢适应高原。</h2>
            <p>
              我在拉萨生活了很多年，平时负责照看房源，也会给第一次进藏的客人一些实际建议。入住前我会说明房间、天气和周边生活，入住后尽量给你安静的空间，需要帮忙时随时可以联系我。
            </p>
            <div className="host-facts">
              {hostFacts.map((fact) => <span key={fact}>{fact}</span>)}
            </div>
          </div>
        </section>

        <section className="host-layout">
          <div className="host-content">
            <section className="host-section" aria-labelledby="about-host">
              <h2 id="about-host">关于央金</h2>
              <div className="host-two-column">
                <p>
                  我出生在山南，后来来到拉萨生活。开始接待游客以后，发现大家最需要的不只是一个睡觉的地方，还需要有人把抵达后的节奏、吃饭地点和高原注意事项讲清楚。
                </p>
                <p>
                  我的房源都尽量保持简单、干净和好找。你可以在房间里好好休息，也可以来问我八廓街怎么走、哪家甜茶馆适合坐久一点。
                </p>
              </div>
            </section>

            <section className="host-section" aria-labelledby="hosting-style">
              <h2 id="hosting-style">她的接待方式</h2>
              <div className="host-value-grid">
                {[
                  ["提前说明", "入住前说明位置、海拔、供氧设备和到店方式，让第一次进藏的客人更有准备。"],
                  ["尊重隐私", "除非你需要帮助，否则不会频繁打扰，让房间真正成为旅途中的休息处。"],
                  ["在地建议", "可以咨询附近的早餐、甜茶馆、寺院礼仪和适合当天状态的慢行路线。"],
                ].map(([title, body]) => (
                  <article key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="host-section" aria-labelledby="host-homes">
              <div className="host-section-heading">
                <h2 id="host-homes">央金的房源</h2>
                <Link href="/homes">查看全部房源</Link>
              </div>
              <div className="host-home-grid">
                {hostHomes.map((home) => (
                  <Link className="host-home-card" href={home.href} key={home.title}>
                    <div className="host-home-image">
                      <Image src={home.image} alt="" fill sizes="(max-width: 743px) 100vw, (max-width: 899px) 50vw, 30vw" />
                      <span>房客推荐</span>
                    </div>
                    <strong>{home.title}</strong>
                    <small>{home.detail}</small>
                    <p>★ {home.rating} · {home.price}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="host-section" aria-labelledby="host-reviews">
              <h2 id="host-reviews">住客评价</h2>
              <div className="host-review-grid">
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

          <aside className="host-contact-card" aria-label="房主提示">
            <strong>准备好看看房源了吗？</strong>
            <p>这里是游客查看的公开资料页。房主自用的房源管理、订单和消息功能后续再做。</p>
            <Link href="/homes">浏览央金的房源</Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
