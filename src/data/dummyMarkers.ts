// data/dummyMarkers.ts
export interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  name: string;
}

export const dummyMarkers = [
  {
    id: 1,
    lat: 37.5665,
    lng: 126.9780,
    name: "서울"
  },
  {
    id: 2,
    lat: 35.1796,
    lng: 129.0756,
    name: "부산"
  },
  {
    id: 3,
    lat: 35.8714,
    lng: 128.6014,
    name: "대구"
  },
  {
    id: 4,
    lat: 37.4563,
    lng: 126.7052,
    name: "인천"
  },
  {
    id: 5,
    lat: 35.1595,
    lng: 126.8526,
    name: "광주"
  }
];
