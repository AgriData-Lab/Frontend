// components/map/RegionMap.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { dummyMarkers } from "../../data/dummyMarkers.ts";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "../../api/axiosInstance";

// 커스텀 마커 아이콘 설정
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2377/2377874.png", // 빨간색 마커 아이콘
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
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
      }
    };

    fetchMapData();
  }, []);

  return (
    <MapContainer 
      center={[35.8, 127.5]} 
      zoom={7} 
      style={{ width: "100%", height: "100%" }}
      zoomControl={false} // 줌 컨트롤 위치 변경
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
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {marker.name}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RegionMap;
