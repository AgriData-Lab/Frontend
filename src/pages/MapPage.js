// pages/MapPage.tsx
import React from "react";
import MapFilterButtons from "../components/map/MapFilterButtons";
import RegionMap from "../components/map/RegionMap";
import './MapPage.css';

const MapPage = () => {
  return (
    <div className="flex w-full h-screen">
      {/* 사이드 메뉴 */}
      <aside className="w-20 bg-pink-200 flex flex-col items-center pt-6 space-y-4 z-10">
        <div className="space-y-1">
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
        </div>
        <MapFilterButtons />
      </aside>

      {/* 지도 영역 */}
      <main className="flex-1 relative" style={{ height: '100vh' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <RegionMap />
        </div>
      </main>
    </div>
  );
};

export default MapPage;
