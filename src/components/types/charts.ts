
export interface RawPriceItem {
  itemname: string;
  kindname: string;
  countyname: string;
  marketname: string;
  yyyy: string;
  regday: string;
  price: string;
}

export interface ChartData {
  year: string;
  [regionOrMarket: string]: number; // 지역명 or 시장명 기준으로 그룹핑
}
