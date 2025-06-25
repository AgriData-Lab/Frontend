import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../api/axiosInstance";

// 시군별 위경도 매핑 (예시, 실제 데이터 더 추가 가능)
const regionCoords = {
  "서울": { lat: 37.5642135, lng: 127.0016985 },
  "부산": { lat: 35.1379222, lng: 129.05562775 },
  "대구": { lat: 35.798838, lng: 128.583052 },
  "광주": { lat: 35.1, lng: 126.8 },
  "대전": { lat: 36.3504119, lng: 127.3845475 },
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
              price: Number(String(item.price).replace(/[^\d]/g, "")),
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
    return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>지도를 불러오는 중...</div>;
  }

  // 가격 그라데이션: minPrice~maxPrice → 연분홍~진분홍
  const minPrice = Math.min(...markers.map(m => m.price));
  const maxPrice = Math.max(...markers.map(m => m.price));

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
      {markers.map(region => {
        const ratio = (region.price - minPrice) / (maxPrice - minPrice || 1); // 0~1
        // 연분홍(255,220,235) ~ 진분홍(229,115,181)로 보간
        const r = Math.round(255 + (229 - 255) * ratio);
        const g = Math.round(220 + (115 - 220) * ratio);
        const b = Math.round(235 + (181 - 235) * ratio);
        const bg = `rgb(${r},${g},${b})`;
        const border = "2px solid #fff";
        const color = "#fff";
        const fontSize = ratio > 0.95 ? "1.35rem" : "1.1rem";
        const icon = L.divIcon({
          className: "custom-label",
          html: `
            <div style="
              font-weight:bold;
              color:${color};
              font-size:${fontSize};
              background:${bg};
              padding:6px 16px 4px 16px;
              border-radius:14px;
              border:${border};
              box-shadow:0 2px 8px rgba(229,115,181,0.15);
              text-align:center;
              line-height:1.3;
              letter-spacing:-0.5px;
              font-family:inherit;
              ">
              <div style="font-size:1.05em;font-weight:bold;">${region.name}</div>
              <div style="font-size:0.98em;">${region.price.toLocaleString()}원</div>
            </div>
          `,
          iconSize: [110, 54],
          iconAnchor: [55, 27],
        });
        return (
          <Marker
            key={region.name}
            position={[region.lat, region.lng]}
            icon={icon}
            interactive={false}
          />
        );
      })}
    </MapContainer>
  );
}
