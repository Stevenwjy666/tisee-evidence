import Image from "next/image";
import Link from "next/link";
import type { TravelCard } from "@/lib/catalog";

export function CatalogDetail({ item }: { item: TravelCard }) {
  const experience = item.kind === "experience";
  return <div className="room-page catalog-detail-page">
    <header className="room-header room-simple-header">
      <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页"><Image className="brand-mark" src="/images/logo-white-background.webp" alt="" width={60} height={60} /><span className="brand-text">Tisee</span></Link>
      <Link href={experience ? "/experiences" : "/services"}>返回{experience ? "体验" : "周边"}列表</Link>
    </header>
    <main className="room-detail">
      <p>{experience ? "在地体验" : "旅行周边"} · {item.badge}</p><h1>{item.title}</h1><p>{item.subtitle}</p>
      <div className="catalog-detail-grid">
        <div className="catalog-detail-image"><Image src={item.image} alt={`${item.title}的风景占位图，非实物或活动现场照片`} fill priority sizes="(max-width: 743px) 100vw, 65vw" /></div>
        <aside className="reservation-card"><p>{experience ? "体验参考价" : "商品参考价"}</p><h2>{item.price}</h2><p>{item.meta}</p><p>★ {item.rating} · {item.reviews} 条示例评价</p><details><summary>{experience ? "了解预约方式" : "了解购买方式"}</summary><p>当前为展示原型，暂未开放{experience ? "预约" : "购买"}与支付。{experience ? "出发日期及名额" : "库存及配送"}需在正式上线后确认。</p></details></aside>
      </div>
      <p className="catalog-demo-note">当前图片为风景占位图，价格和评价为演示数据。正式图片与服务方资料待补充。</p>
      <div className="catalog-info-grid">
        <section><h2>{experience ? "体验介绍" : "商品介绍"}</h2><p>{item.subtitle}。{experience ? "通过当地人的讲解与参与，慢慢认识西藏的日常与文化。" : "把旅行中的色彩与记忆融入日常。"}</p></section>
        <section><h2>{experience ? "时长与集合地点" : "规格与材质"}</h2><p>{item.meta}</p><p>{experience ? "具体集合地点、开始时间和包含项目待服务方确认。" : "具体尺寸、颜色、材质比例与保养说明待补充。"}</p></section>
        <section><h2>{experience ? "参与要求" : "配送与售后"}</h2><p>{experience ? "年龄限制、语言、无障碍条件及所需装备待确认。涉及步行的体验，请提前沟通身体状况与活动强度。" : "发货地、配送范围、运费、发货时间及退换规则待确认，当前不接受下单。"}</p></section>
      </div>
    </main>
  </div>;
}
