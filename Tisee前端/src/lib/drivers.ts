export const drivers = [
  { id: "zhaxi", name: "扎西", rating: "4.98", photo: "photo-1500648767791-00dcc994a43e" },
  { id: "nima", name: "尼玛", rating: "4.96", photo: "photo-1506794778202-cad84cf45f1d" },
  { id: "ciren", name: "次仁", rating: "4.95", photo: "photo-1519085360753-af0119f7cbe7" },
  { id: "pubu", name: "普布", rating: "4.97", photo: "photo-1472099645785-5658abf4ff4e" },
  { id: "dawa", name: "达瓦", rating: "4.94", photo: "photo-1535713875002-d1d0cf377fde" },
  { id: "luosang", name: "洛桑", rating: "4.99", photo: "photo-1506794778202-cad84cf45f1d" },
  { id: "sangzhu", name: "桑珠", rating: "4.96", photo: "photo-1500648767791-00dcc994a43e" },
  { id: "danzeng", name: "旦增", rating: "4.95", photo: "photo-1519085360753-af0119f7cbe7" },
];

export function driverImage(photo: string) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1000&q=85`;
}
