// components/map/RegionMap.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { dummyMarkers } from "../../data/dummyMarkers.ts";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../api/axiosInstance";

// 커스텀 마커 아이콘 설정
const customIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff4b4b'%3E%3Cpath d='M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const RegionMap = ({ mapType = "default" }) => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        
        // localStorage에서 로그인 토큰 가져오기
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("로그인 토큰이 없습니다.");
          setMarkers(dummyMarkers);
          setLoading(false);
          return;
        }

        // 백엔드 API 호출 - /api/items/filter 엔드포인트 사용
        const response = await axios.get("/api/items/filter", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.length > 0) {
          // 백엔드에서 받은 데이터를 마커 형식으로 변환
          const markerData = response.data.map((item, index) => ({
            id: index,
            name: `${item.city} - ${item.item}`,
            lat: item.latitude,
            lng: item.longitude,
            city: item.city,
            item: item.item
          }));
          setMarkers(markerData);
        } else {
          // 데이터가 없을 경우 더미 데이터 사용
          setMarkers(dummyMarkers);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
        // 에러 발생 시 더미 데이터 사용
        setMarkers(dummyMarkers);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        background: "#f8f9fa"
      }}>
        <div>지도 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[35.8, 127.5]} 
      zoom={7} 
      style={{ width: "100%", height: "100%", background: "#f8f9fa" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={customIcon}
        >
          <Popup>
            <div style={{ 
              padding: "8px", 
              textAlign: "center",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              <div style={{ marginBottom: "4px" }}>
                <strong>{marker.city}</strong>
              </div>
              <div style={{ color: "#666" }}>
                {marker.item}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RegionMap;
