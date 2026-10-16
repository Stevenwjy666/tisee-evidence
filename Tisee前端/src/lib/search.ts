import { type TravelCard } from "./catalog";

// Demo capacities, to be replaced by provider-confirmed listing data.
const homeCapacity = [4, 2, 2, 2, 4, 2, 2, 4, 2, 4, 2, 6];
const aliases: Record<string, string> = {
  拉萨布达拉宫: "拉萨", 林芝桃花沟: "林芝", 珠峰大本营: "珠峰",
  羊卓雍措: "羊湖", 珠穆朗玛峰: "珠峰",
};
export function filterCatalog(items: TravelCard[], mode: string, search: string) {
  const params = new URLSearchParams(search);
  const raw = (params.get("query") ?? "").trim().toLowerCase();
  const words = (aliases[raw] ?? raw).split(/\s+/).filter(Boolean);
  const people = ["adults", "children", "elders", "infants"].reduce((sum, key) => sum + Math.max(0, Number(params.get(key)) || 0), 0);
  const kind = ({ homes: "home", routes: "route", experiences: "experience", services: "service" } as Record<string, string>)[mode];
  return items.filter(item => {
    const text = `${item.title} ${item.subtitle} ${item.meta}`.toLowerCase().replaceAll("羊卓雍措", "羊湖");
    return (!kind || item.kind === kind) && words.every(word => text.includes(word)) &&
      (item.kind !== "home" || !people || homeCapacity[Number(item.id.split("-")[1])] >= people);
  });
}
