// components/map/RegionMap.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { dummyMarkers } from "../../data/dummyMarkers.ts";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../api/axiosInstance";

// Leaflet 기본 아이콘 관련 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 기본 마커 커스터마이징 (스타 마커 이미지 등은 원하면 추가 가능)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", // 별 모양 아이콘 예시
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const RegionMap = () => {
  const [markers, setMarkers] = useState(dummyMarkers);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await axios.get("/api/map");
        if (response.data && response.data.length > 0) {
          setMarkers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
        // API 호출 실패시 dummy data 사용
      }
    };

    fetchMapData();
  }, []);

  return (
    <MapContainer 
      center={[36.5, 127.5]} 
      zoom={7} 
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={customIcon}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RegionMap;
