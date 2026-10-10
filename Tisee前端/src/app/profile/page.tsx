"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileTab = "overview" | "trips" | "saved" | "settings";

const tabItems: Array<{ id: ProfileTab; label: string; icon: string }> = [
  { id: "overview", label: "概览", icon: "⌂" },
  { id: "trips", label: "我的行程", icon: "⌁" },
  { id: "saved", label: "收藏清单", icon: "♡" },
  { id: "settings", label: "账户设置", icon: "⚙" },
];

const upcomingTrips = [
  { title: "拉萨 + 纳木错 4 日小环线", detail: "2027年2月5日 - 2月8日 · 2位旅行者", status: "待出发", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" },
  { title: "林芝桃花沟 3 日摄影行", detail: "2027年4月12日 - 4月15日 · 1位旅行者", status: "行程草稿", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80" },
];

const savedPlaces = [
  { title: "八廓街旁藏式庭院", detail: "拉萨 · 房源", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80" },
  { title: "羊卓雍措半日行", detail: "拉萨周边 · 路线", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
  { title: "藏式纹样围巾", detail: "西藏旅行周边", image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页">
          <span className="brand-mark">T</span>
          <span className="brand-text">Tisee</span>
        </Link>
        <div className="profile-header-actions">
          <Link href="/">继续探索</Link>
          <button type="button" aria-label="语言和币种">◎</button>
          <button type="button" aria-label="菜单">☰</button>
        </div>
      </header>

      <main className="profile-main">
        <section className="profile-welcome">
          <div>
            <p className="profile-eyebrow">我的西藏旅程</p>
            <h1>你好，旅行者</h1>
            <p>在这里管理你的个人资料、收藏和下一趟高原行程。</p>
          </div>
          <div className="profile-avatar" aria-hidden="true">旅</div>
        </section>

        <nav className="profile-tabs" aria-label="个人中心导航" role="tablist">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={cn(activeTab === tab.id && "active")}
              onClick={() => setActiveTab(tab.id)}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <div className="profile-content">
            <section className="profile-section">
              <div className="profile-section-heading">
                <div>
                  <h2>你的下一趟行程</h2>
                  <p>把出发前的准备集中在一个地方。</p>
                </div>
                <button type="button">查看全部</button>
              </div>
              <div className="trip-grid">
                {upcomingTrips.map((trip) => (
                  <article className="trip-card" key={trip.title}>
                    <div className="trip-card-image">
                      <Image src={trip.image} alt="" fill sizes="(max-width: 743px) 100vw, 33vw" />
                      <span>{trip.status}</span>
                    </div>
                    <div className="trip-card-copy">
                      <h3>{trip.title}</h3>
                      <p>{trip.detail}</p>
                      <Link href="/routes">打开行程</Link>
                    </div>
                  </article>
                ))}
                <button className="add-trip-card" type="button" onClick={() => setActiveTab("trips")}>
                  <span aria-hidden="true">＋</span>
                  <strong>规划一趟新旅程</strong>
                  <small>从目的地、房源或路线开始</small>
                </button>
              </div>
            </section>

            <section className="profile-section">
              <div className="profile-section-heading">
                <div>
                  <h2>你的收藏清单</h2>
                  <p>保存那些让你想再次回到西藏的地方和物件。</p>
                </div>
                <button type="button" onClick={() => setActiveTab("saved")}>查看全部</button>
              </div>
              <div className="saved-grid">
                {savedPlaces.map((place) => (
                  <Link className="saved-card" href="/rooms/stay-0" key={place.title}>
                    <Image src={place.image} alt="" width={800} height={667} sizes="(max-width: 743px) 100vw, 33vw" />
                    <strong>{place.title}</strong>
                    <span>{place.detail}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="profile-section profile-tools">
              <div className="profile-section-heading">
                <div>
                  <h2>快速入口</h2>
                  <p>常用的个人功能。</p>
                </div>
              </div>
              <div className="tool-grid">
                <button type="button" onClick={() => setActiveTab("settings")}><span>◎</span><strong>个人资料</strong><small>姓名、头像和介绍</small></button>
                <button type="button" onClick={() => setActiveTab("settings")}><span>♧</span><strong>登录与安全</strong><small>密码和账号保护</small></button>
                <button type="button" onClick={() => setActiveTab("settings")}><span>◌</span><strong>通知偏好</strong><small>选择你想收到的消息</small></button>
                <button type="button" onClick={() => setActiveTab("settings")}><span>¥</span><strong>支付方式</strong><small>管理旅行付款信息</small></button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "trips" && (
          <section className="profile-content profile-panel">
            <p className="profile-eyebrow">旅行计划</p>
            <h2>我的行程</h2>
            <p>查看已保存的路线、住宿和出发准备。</p>
            <div className="trip-list">
              {upcomingTrips.map((trip) => <article key={trip.title}><span>{trip.status}</span><div><h3>{trip.title}</h3><p>{trip.detail}</p></div><Link href="/routes">查看</Link></article>)}
            </div>
          </section>
        )}

        {activeTab === "saved" && (
          <section className="profile-content profile-panel">
            <p className="profile-eyebrow">灵感收藏</p>
            <h2>收藏清单</h2>
            <p>你收藏的房源、路线和西藏周边。</p>
            <div className="saved-grid saved-grid-large">
              {savedPlaces.concat(savedPlaces).map((place, index) => <Link className="saved-card" href="/rooms/stay-0" key={`${place.title}-${index}`}><Image src={place.image} alt="" width={800} height={667} sizes="(max-width: 743px) 100vw, 33vw" /><strong>{place.title}</strong><span>{place.detail}</span></Link>)}
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="profile-content profile-panel">
            <p className="profile-eyebrow">账户管理</p>
            <h2>账户设置</h2>
            <p>管理个人资料、隐私、安全和消息偏好。</p>
            <div className="settings-list">
              {["个人资料", "登录与安全", "隐私与分享", "通知偏好", "支付方式", "语言和币种"].map((item) => <button type="button" key={item}><span>{item}</span><b aria-hidden="true">›</b></button>)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
