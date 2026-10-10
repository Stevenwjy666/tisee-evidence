import Link from "next/link";
import { notFound } from "next/navigation";
import { DriverGallery } from "@/components/driver-gallery";
import { drivers, driverImage } from "@/lib/drivers";
import "./driver-detail.css";

const routes = [
  { title: "羊卓雍措一日游", stops: "拉萨 → 岗巴拉山口 → 羊卓雍措 → 拉萨", days: "1 天", price: "800" },
  { title: "拉萨 · 纳木错小环线", stops: "拉萨 → 当雄 → 纳木错 → 拉萨", days: "2 天", price: "1,800" },
  { title: "林芝河谷慢游", stops: "拉萨 → 巴松措 → 林芝 → 鲁朗 → 拉萨", days: "4 天", price: "3,600" },
  { title: "日喀则 · 珠峰之旅", stops: "拉萨 → 羊湖 → 日喀则 → 珠峰沿线 → 拉萨", days: "5 天", price: "4,800" },
];

export default async function DriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = drivers.find((item) => item.id === id);
  if (!driver) notFound();
  const portraits = [
    { src: driverImage(driver.photo), caption: `${driver.name} · 认识你的司机` },
    { src: driverImage("photo-1464822759023-fed622ff2c3b"), caption: "我的旅途 · 雪山沿线" },
    { src: driverImage("photo-1506744038136-46273834b3fb"), caption: "路上的风景 · 高原湖泊" },
    { src: driverImage("photo-1500530855697-b586d89ba3ee"), caption: "旅行日常 · 途中留影" },
  ];
  const vehicles = [
    { src: driverImage("photo-1519641471654-76ce0107ad1b"), caption: "车辆外观" },
    { src: driverImage("photo-1503376780353-7e6692767b70"), caption: "车辆展示 · 侧面" },
    { src: driverImage("photo-1492144534655-ae79c964c9d7"), caption: "车辆展示 · 细节" },
    { src: driverImage("photo-1449965408869-eaa3f722e40d"), caption: "驾驶空间" },
  ];
  return (
    <div className="driver-detail-page">
      <header className="driver-detail-header">
        <Link href="/" className="driver-detail-brand">Tisee</Link>
        <Link href="/routes" prefetch={false}>← 返回路线与司机</Link>
      </header>
      <main className="driver-detail-main">
        <div className="driver-detail-intro">
          <div><p className="driver-eyebrow">一路同行，慢慢看西藏</p><h1>你好，我是{driver.name}</h1><p>从拉萨出发，和你一起把沿途的风景看仔细。</p></div>
          <span className="driver-rating">★ {driver.rating}<small>司机评分 / 5</small></span>
        </div>
        <div className="driver-photo-columns">
          <DriverGallery title="司机与旅途" photos={portraits} />
          <DriverGallery title="我的车" photos={vehicles} />
        </div>
        <p className="driver-demo-note">当前照片、车型与报价为页面展示样例，实际资料待司机提供；旅途照片位置可替换为司机与羊的合照等个人照片。</p>
        <section className="driver-pricing-section" aria-labelledby="driver-routes-heading">
          <div className="driver-section-title"><p className="driver-eyebrow">我常跑的路线</p><h2 id="driver-routes-heading">这些地方，我陪你去</h2><p>以下按整车报价，方便你先规划行程预算。</p></div>
          <div className="driver-pricing-layout">
            <div className="driver-route-list">{routes.map((route) => (
              <article key={route.title} className="driver-route-row">
                <div><span className="driver-duration">{route.days}</span><h3>{route.title}</h3><p>{route.stops}</p></div>
                <p className="driver-route-price">¥{route.price}<small> / 整车起</small></p>
              </article>
            ))}</div>
            <aside className="driver-day-price"><span>按天包车</span><h3>行程由你安排</h3><p className="driver-daily-amount">¥800<small> / 天起</small></p><p>示例车型：5 座 SUV<br />建议乘坐：1–4 位乘客<br />出发地：拉萨</p><p className="driver-price-note">示例报价含司机服务、车辆和燃油；门票、住宿、停车及过路费用需提前确认。跨天路线按总价沟通，不重复叠加日价。</p><a href="#driver-contact">联系司机，聊聊行程 ↗</a></aside>
          </div>
        </section>
        <section id="driver-contact" className="driver-contact-section" aria-labelledby="driver-contact-heading">
          <div><p className="driver-eyebrow">出发之前，先聊一聊</p><h2 id="driver-contact-heading">联系{driver.name}</h2><p>告诉我出发日期、人数和想去的地方，一起确认路线与费用。</p></div>
          <div className="driver-contact-grid"><div><span>联系电话</span><strong>待司机提供</strong><small>填写真实号码后可接入拨号</small></div><div><span>微信</span><strong>待司机提供</strong><small>可展示微信号或联系二维码</small></div></div>
        </section>
      </main>
    </div>
  );
}
