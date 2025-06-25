import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../api/axiosInstance";

// 커스텀 마커 아이콘
const customIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff4b4b'%3E%3Cpath d='M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// 시군별 위경도 매핑 (예시, 실제 데이터 더 추가 가능)
const regionCoords = {
  "서울": { lat: 37.5642135, lng: 127.0016985 },
  "부산": { lat: 35.1379222, lng: 129.05562775 },
  "대구": { lat: 35.798838, lng: 128.583052 },
  "광주": { lat: 35.1, lng: 126.8 },
  "대전": { lat: 36.3504119, lng: 127.3845475 },
  // ...추가 시군
};

export default function BlockMap() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // 오늘 날짜 YYYYMMDD 포맷 생성
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const currentDate = `${yyyy}${mm}${dd}`;
        const res = await axios.get("/api/prices-distribution/shipping-periods", {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: currentDate },
        });
        const markerData = res.data.result
          .filter(item => regionCoords[item.countyname])
          .map(item => {
            const coords = regionCoords[item.countyname];
            return {
              name: item.countyname,
              lat: coords.lat,
              lng: coords.lng,
              price: item.price,
            };
          });
        setMarkers(markerData);
      } catch (e) {
        console.error("시세 데이터 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ width: "100%", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>지도를 불러오는 중...</div>;
  }

  return (
    <MapContainer
      center={[36.5, 127.8]}
      zoom={7}
      style={{ width: "100%", height: "100%", background: "#f8f9fa" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(region => (
        <Marker
          key={region.name}
          position={[region.lat, region.lng]}
          icon={customIcon}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <b>{region.name}</b>
              <br />
              시세: {region.price.toLocaleString()}원
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
