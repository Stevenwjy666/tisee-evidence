import Link from "next/link";

const roles = [
  {
    icon: "⌂",
    title: "邀请房东",
    description: "把有舒适房源、愿意分享本地生活的人介绍到 Tisee。",
    reward: "最高 ¥500 现金奖励",
    detail: "对方完成房源发布并产生首笔有效订单后，邀请人可获得对应奖励。",
  },
  {
    icon: "✦",
    title: "邀请向导",
    description: "推荐熟悉西藏路线、文化和高原节奏的本地向导。",
    reward: "最高 ¥800 现金奖励",
    detail: "对方完成向导资料与路线发布，并完成首个有效行程后进入奖励流程。",
  },
];

const steps = [
  ["01", "分享邀请", "选择房东或向导类型，复制邀请链接发给朋友。"],
  ["02", "完成入驻", "朋友通过邀请完成资料、房源或路线发布。"],
  ["03", "获得奖励", "满足首笔有效订单或行程条件后，奖励进入待确认状态。"],
];

export default function ReferralsPage() {
  return (
    <div className="referral-page">
      <header className="referral-header">
        <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页">
          <span className="brand-mark">T</span>
          <span className="brand-text">Tisee</span>
        </Link>
        <nav aria-label="邀请奖励页导航">
          <Link href="/profile">个人中心</Link>
          <Link href="/routes">继续探索</Link>
        </nav>
      </header>

      <main className="referral-main">
        <section className="referral-hero" aria-labelledby="referral-title">
          <div>
            <p className="referral-eyebrow">邀请同行者加入西藏旅行社区</p>
            <h1 id="referral-title">邀请房东或向导，<br />一起分享西藏的好住处与好路线。</h1>
            <p className="referral-hero-copy">
              认识一位适合接待游客的房东，或一位真正懂西藏的向导？邀请他们加入 Tisee，帮助更多旅行者找到安心的落脚点和更有温度的路线。
            </p>
            <div className="referral-hero-actions">
              <a href="#referral-options">开始邀请</a>
              <a href="#referral-steps">了解流程</a>
            </div>
          </div>
          <div className="referral-hero-art" aria-hidden="true">
            <div className="referral-art-sun" />
            <div className="referral-art-mountain mountain-back" />
            <div className="referral-art-mountain mountain-front" />
            <span>一起把西藏<br />分享给更多人</span>
          </div>
        </section>

        <section id="referral-options" className="referral-section" aria-labelledby="options-title">
          <div className="referral-section-heading">
            <div>
              <p className="referral-eyebrow">选择邀请对象</p>
              <h2 id="options-title">你想邀请谁？</h2>
            </div>
            <p>不同角色有不同的入驻条件与奖励额度。</p>
          </div>
          <div className="referral-role-grid">
            {roles.map((role) => (
              <article className="referral-role-card" key={role.title}>
                <span className="referral-role-icon" aria-hidden="true">{role.icon}</span>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <strong>{role.reward}</strong>
                <small>{role.detail}</small>
                <button type="button">生成邀请链接</button>
              </article>
            ))}
          </div>
        </section>

        <section id="referral-steps" className="referral-section referral-steps-section" aria-labelledby="steps-title">
          <div className="referral-section-heading">
            <div>
              <p className="referral-eyebrow">简单三步</p>
              <h2 id="steps-title">邀请流程很清楚</h2>
            </div>
          </div>
          <div className="referral-step-grid">
            {steps.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="referral-note" aria-label="奖励说明">
          <div>
            <strong>现在是前端原型</strong>
            <p>邀请链接、奖励记录、资格审核和现金发放功能将在后续接入，不会产生真实支付。</p>
          </div>
          <Link href="/profile">查看我的账户</Link>
        </section>
      </main>
    </div>
  );
}
