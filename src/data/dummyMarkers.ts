// data/dummyMarkers.ts
export interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  name: string;
}

export const dummyMarkers: MarkerData[] = [
  {
    id: 1,
    lat: 35.8714,
    lng: 128.6014,
    name: "대구광역시"
  },
  {
    id: 2,
    lat: 35.1796,
    lng: 129.0756,
    name: "부산광역시"
  },
  {
    id: 3,
    lat: 35.5384,
    lng: 129.3114,
    name: "울산광역시"
  },
  {
    id: 4,
    lat: 35.1595,
    lng: 126.8526,
    name: "광주광역시"
  },
  {
    id: 5,
    lat: 36.3504,
    lng: 127.3845,
    name: "대전광역시"
  },
  {
    id: 6,
    lat: 37.4563,
    lng: 126.7052,
    name: "인천광역시"
  },
  {
    id: 7,
    lat: 37.5665,
    lng: 126.9780,
    name: "서울특별시"
  },
  {
    id: 8,
    lat: 35.2100,
    lng: 128.5836,
    name: "창원시"
  },
  {
    id: 9,
    lat: 36.6372,
    lng: 127.4897,
    name: "청주시"
  },
  {
    id: 10,
    lat: 34.8121,
    lng: 126.3921,
    name: "목포시"
  }
];
