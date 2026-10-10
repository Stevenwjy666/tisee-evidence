"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PetroglyphTab } from "@/components/petroglyph-tab";
import "./stone-header.css";
import { drivers } from "@/lib/drivers";

type PageMode = "all" | "homes" | "routes" | "experiences" | "services";
type PanelId = "destinations" | "dates" | "guests" | "profile" | "locale" | null;
type GuestKey = "adults" | "children" | "infants" | "elders";
type Kind = "home" | "route" | "experience" | "service";
type InspirationTab = "popular" | "culture" | "lakes" | "mountains" | "outdoor" | "local";

type TravelCard = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badge: string;
  rating: string;
  reviews: number;
  price: string;
  image: string;
  kind: Kind;
  href: string;
};

type TravelSection = {
  id: string;
  title: string;
  subtitle: string;
  items: TravelCard[];
};

const tabs: Array<{ id: PageMode; label: string; href: string }> = [
  { id: "all", label: "全部", href: "/" },
  { id: "homes", label: "房源", href: "/homes" },
  { id: "routes", label: "路线", href: "/routes" },
  { id: "experiences", label: "体验", href: "/experiences" },
  { id: "services", label: "周边", href: "/services" },
];

const destinations = [
  { label: "拉萨布达拉宫", sublabel: "经典城市漫游与观景住宿" },
  { label: "纳木错", sublabel: "湖泊、星空与轻徒步" },
  { label: "羊卓雍措", sublabel: "半日到一日摄影路线" },
  { label: "林芝桃花沟", sublabel: "春季花期与河谷木屋" },
  { label: "珠峰大本营", sublabel: "日喀则出发的高海拔路线" },
  { label: "冈仁波齐", sublabel: "阿里南线与朝圣行程" },
];

const dateOptions = ["今天", "明天", "本周末", "9月14日 - 9月18日", "国庆假期", "桃花季"];
const calendarMonths = [
  { label: "2026年9月", days: Array.from({ length: 30 }, (_, index) => index + 1) },
  { label: "2026年10月", days: Array.from({ length: 31 }, (_, index) => index + 1) },
];

const guestRows: Array<{ key: GuestKey; label: string; description: string }> = [
  { key: "adults", label: "成人", description: "13 岁或以上" },
  { key: "children", label: "儿童", description: "2 - 12 岁" },
  { key: "infants", label: "婴儿", description: "2 岁以下" },
  { key: "elders", label: "老人", description: "需要舒缓节奏或高反照护" },
];

const imagePool = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=80",
];

function buildCards(kind: Kind, prefix: string, rows: Array<[string, string, string, string, string, number, string]>, offset = 0) {
  return rows.map((row, index): TravelCard => ({
    id: `${prefix}-${index}`,
    title: row[0],
    subtitle: row[1],
    meta: row[2],
    badge: row[3],
    rating: row[4],
    reviews: row[5],
    price: row[6],
    image: imagePool[(index + offset) % imagePool.length],
    kind,
    href: `/rooms/${prefix}-${index}`,
  }));
}

const routeCards = buildCards("route", "route", [
  ["拉萨 + 纳木错 4 日小环线", "拉萨出发 · 湖泊星空 · 慢节奏", "4天 · 3晚 · 轻徒步", "初次进藏推荐", "4.96", 128, "¥1,280 / 人起"],
  ["林芝桃花沟 3 日摄影行", "林芝 · 春季花期 · 河谷村落", "3天 · 2晚 · 摄影", "花季热门", "4.91", 86, "¥980 / 人起"],
  ["日喀则 + 珠峰 5 日", "羊湖 · 扎什伦布寺 · 珠峰观景", "5天 · 4晚 · 高海拔", "雪山观景", "4.94", 112, "¥2,360 / 人起"],
  ["山南文化 2 日", "雍布拉康 · 桑耶寺 · 藏源文化", "2天 · 1晚 · 人文", "文化精选", "4.89", 57, "¥760 / 人起"],
  ["阿里南线 8 日", "冈仁波齐 · 玛旁雍措 · 古格王朝", "8天 · 7晚 · 深度", "向导推荐", "4.98", 42, "¥5,880 / 人起"],
  ["羊卓雍措半日行", "拉萨周边 · 蓝湖观景 · 轻松往返", "半日 · 私家车", "短途精选", "4.87", 204, "¥260 / 人起"],
  ["拉萨城市漫游", "八廓街 · 大昭寺 · 本地茶馆", "1天 · 步行", "城市经典", "4.93", 176, "¥188 / 人起"],
  ["鲁朗森林轻徒步", "林芝鲁朗 · 森林牧场 · 家庭友好", "2天 · 1晚 · 轻户外", "亲子友好", "4.88", 61, "¥680 / 人起"],
  ["波密冰川与然乌湖", "波密 · 然乌湖 · 冰川观景", "4天 · 3晚 · 摄影", "小众路线", "4.92", 49, "¥1,680 / 人起"],
], 0);

const homeCards = buildCards("home", "stay", [
  ["八廓街旁藏式庭院", "拉萨城关区", "整套客房 · 2室2床", "房客推荐", "4.92", 93, "¥368 CNY / 晚"],
  ["布达拉宫观景客房", "拉萨", "精品酒店房间 · 可供氧", "热门房源", "4.88", 74, "¥520 CNY / 晚"],
  ["林芝河谷木屋", "尼洋河畔", "整套小木屋 · 河谷景观", "超赞景观", "4.95", 51, "¥468 CNY / 晚"],
  ["日喀则安静民宿", "扎什伦布寺附近", "独立房间 · 近老城", "房客推荐", "4.86", 39, "¥298 CNY / 晚"],
  ["山南家庭客栈", "泽当", "家庭客栈 · 适合慢游", "本地接待", "4.90", 45, "¥260 CNY / 晚"],
  ["纳木错湖畔营地", "湖边帐篷", "营地帐篷 · 星空湖景", "稀缺日期", "4.84", 63, "¥420 CNY / 晚"],
  ["拉萨供氧酒店", "市中心", "酒店房间 · 供氧设备", "安心入住", "4.91", 148, "¥498 CNY / 晚"],
  ["鲁朗森林度假屋", "林芝鲁朗", "整套度假屋 · 森林露台", "新上线", "4.89", 31, "¥560 CNY / 晚"],
  ["波密雪山民宿", "波密县", "独立房间 · 雪山窗景", "景观好评", "4.93", 58, "¥388 CNY / 晚"],
  ["羊湖观景小院", "浪卡子", "整套民居 · 湖景露台", "适合摄影", "4.87", 44, "¥430 CNY / 晚"],
  ["色拉寺旁静心客房", "拉萨北郊", "独立房间 · 适合长住", "安静街区", "4.85", 36, "¥318 CNY / 晚"],
  ["林芝花谷家庭房", "桃花沟附近", "家庭房 · 3床", "花季可订", "4.90", 72, "¥458 CNY / 晚"],
], 2);

const experienceCards = buildCards("experience", "experience", [
  ["藏餐手作体验", "甜茶、糌粑与家常藏餐", "2.5小时 · 小团", "小团体验", "4.97", 68, "¥168 / 人"],
  ["转经路线讲解", "八廓街仪式与城市故事", "3小时 · 步行", "文化导览", "4.94", 122, "¥128 / 人"],
  ["旅拍向导服务", "布达拉宫、八廓街与羊湖取景", "半日 · 可定制", "摄影热门", "4.90", 84, "¥699 / 组"],
  ["寺院文化导览", "大昭寺、色拉寺、哲蚌寺", "4小时 · 人文精选", "人文精选", "4.96", 76, "¥188 / 人"],
], 4);

const serviceCards = buildCards("service", "service", [
  ["西藏主题帆布包", "布达拉宫与雪山插画 · 日常通勤也能背", "帆布 · 大容量", "旅行热卖", "4.91", 86, "¥129 / 件"],
  ["高原保暖抓绒帽", "适合旅行途中和日常户外佩戴", "抓绒 · 均码", "高原装备", "4.88", 54, "¥89 / 件"],
  ["藏式纹样围巾", "取自经幡与雪山配色的轻薄围巾", "棉麻 · 多色可选", "设计精选", "4.95", 72, "¥168 / 条"],
  ["拉萨旅行明信片套装", "大昭寺、羊湖与南迦巴瓦主题插画", "8张 · 礼盒装", "伴手礼", "4.97", 118, "¥49 / 套"],
  ["布达拉宫纪念徽章", "适合别在背包、外套或旅行帽上", "珐琅 · 3枚装", "小物收藏", "4.90", 63, "¥39 / 套"],
  ["藏地旅行收纳袋", "印有高原路线图的多功能旅行收纳", "防水 · 3件套", "出行实用", "4.86", 41, "¥79 / 套"],
  ["雪山插画卫衣", "宽松版型 · 适合秋冬旅行与城市穿搭", "棉质 · 多尺码", "新款上架", "4.93", 97, "¥249 / 件"],
], 6);

const homeSections: TravelSection[] = [
  { id: "featured-routes", title: "西藏热门线路", subtitle: "适合首次进藏与深度探索的灵感路线", items: routeCards.slice(0, 7) },
  { id: "plateau-stays", title: "高原舒适住宿", subtitle: "靠近城市地标、湖泊与河谷的安心落脚点", items: homeCards.slice(0, 7) },
  { id: "local-services", title: "当地体验与周边", subtitle: "从在地体验到西藏主题伴手礼，把旅途记忆带回家", items: [...experienceCards, ...serviceCards].slice(0, 7) },
];

const inspirationTabs: Array<{ id: InspirationTab; label: string }> = [
  { id: "popular", label: "热门" },
  { id: "culture", label: "艺术与文化" },
  { id: "lakes", label: "湖泊" },
  { id: "mountains", label: "山区" },
  { id: "outdoor", label: "户外" },
  { id: "local", label: "在地体验" },
];

const inspirationPlaces: Record<InspirationTab, Array<{ name: string; kind: string }>> = {
  popular: [
    { name: "拉萨", kind: "普通民宅房源" },
    { name: "林芝", kind: "河谷度假屋" },
    { name: "日喀则", kind: "雪山观景房源" },
    { name: "山南", kind: "文化路线民宿" },
    { name: "纳木错", kind: "湖泊营地" },
    { name: "羊卓雍措", kind: "短途度假屋" },
    { name: "珠峰大本营", kind: "观景行程" },
    { name: "阿里", kind: "深度探索路线" },
    { name: "八廓街", kind: "城市漫游房源" },
    { name: "鲁朗", kind: "森林木屋" },
    { name: "波密", kind: "雪山河谷住宿" },
    { name: "显示更多", kind: "" },
  ],
  culture: [
    { name: "大昭寺", kind: "文化导览" },
    { name: "色拉寺", kind: "寺院讲解" },
    { name: "扎什伦布寺", kind: "日喀则体验" },
    { name: "雍布拉康", kind: "藏源文化" },
    { name: "桑耶寺", kind: "建筑与历史" },
    { name: "八廓街", kind: "转经路线" },
  ],
  lakes: [
    { name: "纳木错", kind: "星空与湖景" },
    { name: "羊卓雍措", kind: "摄影路线" },
    { name: "玛旁雍措", kind: "阿里湖泊" },
    { name: "然乌湖", kind: "川藏线停留" },
    { name: "巴松措", kind: "林芝度假" },
    { name: "普莫雍错", kind: "小众蓝湖" },
  ],
  mountains: [
    { name: "珠穆朗玛峰", kind: "雪山观景" },
    { name: "南迦巴瓦", kind: "林芝雪山" },
    { name: "冈仁波齐", kind: "阿里南线" },
    { name: "念青唐古拉", kind: "高原风景" },
    { name: "色季拉山", kind: "森林山口" },
    { name: "米拉山口", kind: "进藏路线" },
  ],
  outdoor: [
    { name: "嘎玛沟", kind: "徒步路线" },
    { name: "库拉岗日", kind: "雪山徒步" },
    { name: "鲁朗林海", kind: "轻户外" },
    { name: "墨脱", kind: "雨林探索" },
    { name: "阿里大北线", kind: "越野线路" },
    { name: "波密冰川", kind: "摄影与徒步" },
  ],
  local: [
    { name: "甜茶馆", kind: "本地生活" },
    { name: "藏餐手作", kind: "小团体验" },
    { name: "经幡工坊", kind: "手作课程" },
    { name: "旅拍向导", kind: "城市取景" },
    { name: "包车司机", kind: "灵活出行" },
    { name: "高反照护", kind: "安心服务" },
  ],
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path d="M13.5 7a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.1 9.7 5.35 5.35-1.4 1.4-5.35-5.35 1.4-1.4Z" fill="currentColor" />
    </svg>
  );
}

export function AirbnbClonePage({ initialTab }: { initialTab: PageMode }) {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const searchZoneRef = useRef<HTMLFormElement | null>(null);
  const scrollerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [openPanel, setOpenPanel] = useState<PanelId>(null);
  const [query, setQuery] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [inspirationTab, setInspirationTab] = useState<InspirationTab>("popular");
  const [localeTab, setLocaleTab] = useState<"language" | "currency">("language");
  const [guests, setGuests] = useState<Record<GuestKey, number>>({ adults: 0, children: 0, infants: 0, elders: 0 });
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["route-0", "stay-1", "stay-3"]));

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target;
      const clickedInsideSearch = searchZoneRef.current?.contains(target as Node);
      const clickedInsideOpenMenu = target instanceof Element && Boolean(target.closest(".profile-menu, .locale-menu"));

      if (!clickedInsideSearch && !clickedInsideOpenMenu) setOpenPanel(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPanel(null);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const guestSummary = useMemo(() => {
    const travelers = guests.adults + guests.children + guests.elders;
    if (!travelers && !guests.infants) return "添加人数";
    return [`${travelers || 0} 位旅行者`, guests.infants ? `${guests.infants} 名婴儿` : ""].filter(Boolean).join("，");
  }, [guests]);

  const simpleSections = useMemo(() => {
    if (initialTab === "homes") {
      return [
        { id: "lhasa-popular-homes", title: "拉萨的热门房源", subtitle: "靠近布达拉宫、八廓街与老城生活区", items: homeCards.slice(0, 7) },
        { id: "nyingchi-homes", title: "林芝周边好评民宿", subtitle: "河谷木屋、花季家庭房与森林度假屋", items: [homeCards[2], homeCards[7], homeCards[11], homeCards[8], homeCards[4], homeCards[9], homeCards[5]] },
        { id: "next-trip-homes", title: "适合下一趟行程的优质住宿", subtitle: "供氧、观景和交通便利的高原落脚点", items: [homeCards[1], homeCards[6], homeCards[0], homeCards[10], homeCards[3], homeCards[5], homeCards[9]] },
      ];
    }
    if (initialTab === "routes") {
      return [
        { id: "classic-routes", title: "西藏热门路线", subtitle: "从拉萨出发的经典小环线与雪山行程", items: routeCards.slice(0, 7) },
        { id: "first-tibet-routes", title: "第一次进藏推荐", subtitle: "节奏更稳、海拔更友好的路线组合", items: [routeCards[0], routeCards[6], routeCards[3], routeCards[1], routeCards[5], routeCards[7], routeCards[2]] },
        { id: "photo-routes", title: "摄影和深度探索路线", subtitle: "湖泊、雪山、冰川与阿里南线灵感", items: [routeCards[1], routeCards[2], routeCards[4], routeCards[8], routeCards[5], routeCards[7], routeCards[0]] },
      ];
    }
    if (initialTab === "experiences") {
      return [{ id: "experiences-only", title: "西藏当地体验", subtitle: "藏餐手作、转经讲解、旅拍与寺院文化导览", items: experienceCards }];
    }
    if (initialTab === "services") {
      return [{ id: "services-only", title: "西藏旅行周边", subtitle: "把西藏的雪山、寺院与旅途记忆带回家", items: serviceCards }];
    }
    return homeSections;
  }, [initialTab]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentTab = tabs.find((tab) => tab.id === initialTab) ?? tabs[0];
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (dateLabel) params.set("dates", dateLabel);
    Object.entries(guests).forEach(([key, value]) => {
      if (value > 0) params.set(key, String(value));
    });
    setOpenPanel(null);
    router.push(`${currentTab.href}${params.size ? `?${params.toString()}` : ""}`);
  }

  function toggleSaved(cardId: string) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  function updateGuest(key: GuestKey, direction: 1 | -1) {
    setGuests((current) => ({ ...current, [key]: Math.max(0, current[key] + direction) }));
  }

  function scrollSection(sectionId: string, direction: "prev" | "next") {
    const scroller = scrollerRefs.current[sectionId];
    if (!scroller) return;
    scroller.scrollBy({ left: scroller.clientWidth * (direction === "next" ? 0.85 : -0.85), behavior: "smooth" });
  }

  return (
    <div className="airbnb-page" ref={shellRef}>
      <div className="flash-region" role="alert" aria-live="assertive" />
      <a className="skip-link" href="#site-content">跳至内容</a>

      <header className="site-header">
        <Link className="brand-link" href="/" aria-label="Tisee 西藏旅行首页">
          <span className="brand-mark">T</span>
          <span className="brand-text">Tisee</span>
        </Link>

        <form className="search-zone" ref={searchZoneRef} role="search" onSubmit={submitSearch}>
          <nav className="search-tabs" aria-label="旅行分类">
            {tabs.map((tab) => (
              <PetroglyphTab key={tab.id} category={tab.id} label={tab.label} active={initialTab === tab.id} onSelect={() => router.push(tab.href)} />
            ))}
          </nav>

          <div className="search-pill">
            <label className={cn("search-segment destination-segment", openPanel === "destinations" && "active")}>
              <span className="segment-label">地点</span>
              <input aria-label="地点" type="search" placeholder="搜索目的地" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setOpenPanel("destinations")} />
            </label>
            <button className={cn("search-segment", openPanel === "dates" && "active")} type="button" aria-expanded={openPanel === "dates"} onClick={() => setOpenPanel(openPanel === "dates" ? null : "dates")}>
              <span className="segment-label">时间</span>
              <span className="segment-value">{dateLabel || "添加日期"}</span>
            </button>
            <button className={cn("search-segment guest-segment", openPanel === "guests" && "active")} type="button" aria-expanded={openPanel === "guests"} onClick={() => setOpenPanel(openPanel === "guests" ? null : "guests")}>
              <span className="segment-label">人员</span>
              <span className="segment-value">{guestSummary}</span>
            </button>
            <button className="submit-search" type="submit" aria-label="搜索"><SearchIcon /></button>
          </div>

          {openPanel === "destinations" && (
            <div className="popover destination-popover">
              <div className="popover-heading">
                <h2>推荐目的地</h2>
                <button type="button" className="popover-close" aria-label="关闭目的地搜索" onClick={() => setOpenPanel(null)}>×</button>
              </div>
              <div className="suggestion-list">
                {destinations.filter((item) => !query || item.label.includes(query)).map((item) => (
                  <button key={item.label} type="button" className="suggestion-row" onClick={() => { setQuery(item.label); setOpenPanel(null); }}>
                    <span className="suggestion-icon" aria-hidden="true">⌖</span>
                    <span><strong>{item.label}</strong><small>{item.sublabel}</small></span>
                  </button>
                ))}
              </div>
              <div className="quick-chips" aria-label="快捷日期">
                {["本周末", "国庆假期", "桃花季", "暑期"].map((chip) => <button key={chip} type="button" onClick={() => setDateLabel(chip)}>{chip}</button>)}
              </div>
            </div>
          )}

          {openPanel === "dates" && (
            <div className="popover date-popover">
              <button type="button" className="popover-close" aria-label="关闭日期选择" onClick={() => setOpenPanel(null)}>×</button>
              <div className="date-mode" role="tablist" aria-label="日期模式">
                {["日期", "月份", "灵活"].map((mode, index) => <button key={mode} className={index === 0 ? "active" : ""} type="button" role="tab">{mode}</button>)}
              </div>
              <div className="calendar-shell" aria-label="日期选择">
                {calendarMonths.map((month) => (
                  <section className="calendar-month" key={month.label}>
                    <h3>{month.label}</h3>
                    <div className="calendar-weekdays" aria-hidden="true">{["一", "二", "三", "四", "五", "六", "日"].map((day) => <span key={day}>{day}</span>)}</div>
                    <div className="calendar-grid">
                      {month.days.map((day) => {
                        const value = `${month.label.replace("2026年", "")}${day}日`;
                        return <button key={`${month.label}-${day}`} className={dateLabel === value ? "selected" : ""} type="button" onClick={() => { setDateLabel(value); setOpenPanel(null); }}>{day}</button>;
                      })}
                    </div>
                  </section>
                ))}
              </div>
              <div className="date-quick-row" aria-label="日期快捷选择">
                {dateOptions.map((option) => <button key={option} className={dateLabel === option ? "selected" : ""} type="button" onClick={() => { setDateLabel(option); setOpenPanel(null); }}>{option}</button>)}
              </div>
            </div>
          )}

          {openPanel === "guests" && (
            <div className="popover guest-popover">
              <button type="button" className="popover-close" aria-label="关闭人数选择" onClick={() => setOpenPanel(null)}>×</button>
              {guestRows.map((row) => (
                <div className="guest-row" key={row.key}>
                  <span><strong>{row.label}</strong><small>{row.description}</small></span>
                  <span className="counter">
                    <button type="button" disabled={guests[row.key] === 0} onClick={() => updateGuest(row.key, -1)}>-</button>
                    <b>{guests[row.key]}</b>
                    <button type="button" onClick={() => updateGuest(row.key, 1)}>+</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        <nav className="utility-nav" aria-label="个人资料">
          <a href="#site-content">客服中心</a>
          <button type="button" className="icon-button" aria-label="选择语言和币种" aria-expanded={openPanel === "locale"} onClick={() => setOpenPanel(openPanel === "locale" ? null : "locale")}>◎</button>
          <button type="button" className="menu-button" aria-label="主导航菜单" aria-expanded={openPanel === "profile"} onClick={() => setOpenPanel(openPanel === "profile" ? null : "profile")}><span aria-hidden="true">☰</span><span className="avatar-dot" aria-hidden="true" /></button>
        </nav>

        {openPanel === "profile" && (
          <div className="profile-menu" role="menu">
            <Link href="/profile" role="menuitem" onClick={() => setOpenPanel(null)}>个人中心</Link>
            {["登录或注册", "旅行安全"].map((item) => <button key={item} type="button" role="menuitem">{item}</button>)}
            <Link href="/referrals" role="menuitem" onClick={() => setOpenPanel(null)}>邀请房东或向导</Link>
          </div>
        )}
        {openPanel === "locale" && (
          <div className="locale-menu">
            <div className="locale-tabs" role="tablist" aria-label="语言和币种">
              <button type="button" className={localeTab === "language" ? "active" : ""} onClick={() => setLocaleTab("language")}>语言</button>
              <button type="button" className={localeTab === "currency" ? "active" : ""} onClick={() => setLocaleTab("currency")}>币种</button>
            </div>
            {(localeTab === "language" ? ["简体中文", "English"] : ["CNY 人民币", "USD 美元"]).map((item) => <button key={item} type="button">{item}</button>)}
          </div>
        )}
      </header>

      <button className="mobile-search" type="button" onClick={() => setOpenPanel("destinations")}>
        <span><SearchIcon /></span>
        <strong>{query || "搜索西藏目的地"}</strong>
        <small>{dateLabel || "添加日期"} · {guestSummary}</small>
      </button>

      <nav className="mobile-category-tabs" aria-label="旅行分类">
        {tabs.map((tab) => (
          <PetroglyphTab key={tab.id} category={tab.id} label={tab.label} active={initialTab === tab.id} onSelect={() => router.push(tab.href)} />
        ))}
      </nav>

      <main id="site-content" className="site-content">
        {simpleSections.map((section) => (
          <section className="travel-section" key={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="section-heading">
              <span>
                <h2 id={`${section.id}-title`}>{section.title}<span aria-hidden="true">›</span></h2>
                <p>{section.subtitle}</p>
              </span>
              <span className="scroller-controls">
                <button type="button" aria-label={`向左滚动 ${section.title}`} onClick={() => scrollSection(section.id, "prev")}>‹</button>
                <button type="button" aria-label={`向右滚动 ${section.title}`} onClick={() => scrollSection(section.id, "next")}>›</button>
              </span>
            </div>
            <div className="card-scroller" ref={(node) => { scrollerRefs.current[section.id] = node; }}>
              {section.items.map((item) => <TravelCardView key={item.id} item={item} compact saved={savedIds.has(item.id)} onToggleSaved={toggleSaved} />)}
            </div>
          </section>
        ))}
        {initialTab === "routes" && (
          <section className="travel-section driver-section" aria-labelledby="recommended-drivers-title">
            <div className="section-heading">
              <span>
                <h2 id="recommended-drivers-title">平台推荐司机</h2>
                <p>认识陪你探索西藏的司机</p>
              </span>
              <span className="scroller-controls">
                <button type="button" aria-label="向左滚动 平台推荐司机" onClick={(event) => event.currentTarget.closest("section")?.querySelector(".card-scroller")?.scrollBy({ left: -600, behavior: "instant" })}>‹</button>
                <button type="button" aria-label="向右滚动 平台推荐司机" onClick={(event) => event.currentTarget.closest("section")?.querySelector(".card-scroller")?.scrollBy({ left: 600, behavior: "instant" })}>›</button>
              </span>
            </div>
            <div className="card-scroller" ref={(node) => { scrollerRefs.current["recommended-drivers"] = node; }}>
              {drivers.map((driver) => (
                <Link className="travel-card driver-card" key={driver.id} href={`/drivers/${driver.id}`} prefetch={false} aria-label={`查看司机${driver.name}的资料`}>
                  <div className="card-media">
                    <Image src={`https://images.unsplash.com/${driver.photo}?auto=format&fit=crop&w=480&q=80`} alt={`${driver.name}的示例头像`} loading="eager" fill sizes="(max-width: 743px) 50vw, (max-width: 899px) 25vw, 14vw" />
                  </div>
                  <h3>{driver.name}</h3>
                  <p aria-label={`评分 ${driver.rating}，满分 5 分`}><span aria-hidden="true">★ </span>{driver.rating}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        {(initialTab === "all" || initialTab === "homes") && <InspirationPanel inspirationTab={inspirationTab} setInspirationTab={setInspirationTab} />}
      </main>

      <nav className="bottom-nav" aria-label="移动端导航">
        {["探索", "收藏", "行程", "我的"].map((item) => <button key={item} type="button"><span aria-hidden="true">◇</span>{item}</button>)}
      </nav>
    </div>
  );
}

function TravelCardView({ item, compact = false, saved, onToggleSaved }: { item: TravelCard; compact?: boolean; saved: boolean; onToggleSaved: (id: string) => void }) {
  return (
    <article className={cn("travel-card", !compact && "listing-card")}>
      <div className="card-media">
        <Link className="card-media-link" href={item.href} aria-label={`查看 ${item.title}`}>
          <Image src={item.image} alt={item.title} fill sizes={compact ? "(max-width: 743px) 50vw, (max-width: 899px) 25vw, (max-width: 1199px) 20vw, 14vw" : "(max-width: 899px) 50vw, 25vw"} />
          <span className="card-badge">{item.badge}</span>
        </Link>
        <button type="button" className={cn("favorite-button", saved && "saved")} aria-label={`收藏 ${item.title}`} aria-pressed={saved} onClick={() => onToggleSaved(item.id)}>♥</button>
      </div>
      <Link className="card-copy" href={item.href}>
        <h3>{item.title}</h3>
        <p>{item.subtitle}</p>
        {!compact && <p>{item.meta}</p>}
        <p>★ {item.rating} · {item.reviews} 条评价</p>
        <strong>{item.price}</strong>
      </Link>
    </article>
  );
}

function InspirationPanel({ inspirationTab, setInspirationTab }: { inspirationTab: InspirationTab; setInspirationTab: (tab: InspirationTab) => void }) {
  return (
    <section className="inspiration-panel" aria-labelledby="inspiration-title">
      <h2 id="inspiration-title">为未来的度假行程寻找灵感</h2>
      <div className="inspiration-tabs" role="tablist" aria-label="目的地灵感">
        {inspirationTabs.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={inspirationTab === tab.id} className={cn(inspirationTab === tab.id && "active")} onClick={() => setInspirationTab(tab.id)}>{tab.label}</button>
        ))}
      </div>
      <div className="inspiration-grid">
        {inspirationPlaces[inspirationTab].map((place) => (
          <button key={`${inspirationTab}-${place.name}`} type="button" className="inspiration-link">
            <strong>{place.name}</strong>
            {place.kind ? <span>{place.kind}</span> : <span aria-hidden="true">⌄</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
