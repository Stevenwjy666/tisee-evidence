type Kind = "home" | "route" | "experience" | "service";

export type TravelCard = {
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

export const routeCards = buildCards("route", "route", [
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

export const homeCards = buildCards("home", "stay", [
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

export const experienceCards = buildCards("experience", "experience", [
  ["藏餐手作体验", "甜茶、糌粑与家常藏餐", "2.5小时 · 小团", "小团体验", "4.97", 68, "¥168 / 人"],
  ["转经路线讲解", "八廓街仪式与城市故事", "3小时 · 步行", "文化导览", "4.94", 122, "¥128 / 人"],
  ["旅拍向导服务", "布达拉宫、八廓街与羊湖取景", "半日 · 可定制", "摄影热门", "4.90", 84, "¥699 / 组"],
  ["寺院文化导览", "大昭寺、色拉寺、哲蚌寺", "4小时 · 人文精选", "人文精选", "4.96", 76, "¥188 / 人"],
], 4);

export const serviceCards = buildCards("service", "service", [
  ["西藏主题帆布包", "布达拉宫与雪山插画 · 日常通勤也能背", "帆布 · 大容量", "旅行热卖", "4.91", 86, "¥129 / 件"],
  ["高原保暖抓绒帽", "适合旅行途中和日常户外佩戴", "抓绒 · 均码", "高原装备", "4.88", 54, "¥89 / 件"],
  ["藏式纹样围巾", "取自经幡与雪山配色的轻薄围巾", "棉麻 · 多色可选", "设计精选", "4.95", 72, "¥168 / 条"],
  ["拉萨旅行明信片套装", "大昭寺、羊湖与南迦巴瓦主题插画", "8张 · 礼盒装", "伴手礼", "4.97", 118, "¥49 / 套"],
  ["布达拉宫纪念徽章", "适合别在背包、外套或旅行帽上", "珐琅 · 3枚装", "小物收藏", "4.90", 63, "¥39 / 套"],
  ["藏地旅行收纳袋", "印有高原路线图的多功能旅行收纳", "防水 · 3件套", "出行实用", "4.86", 41, "¥79 / 套"],
  ["雪山插画卫衣", "宽松版型 · 适合秋冬旅行与城市穿搭", "棉质 · 多尺码", "新款上架", "4.93", 97, "¥249 / 件"],
], 6);

