import React, { useState } from "react";
import MapFilterButtons from "../components/map/MapFilterButtons";
import RegionMap from "../components/map/RegionMap";
import Header from "../components/Header";
import Sidebar from "../components/map/SideBar";
import "./MapPage.css";

const MapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 상단바 */}
      <Header toggleSidebar={toggleSidebar} />

      {/* 왼쪽 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 지도 영역 */}
      <main className="pt-12 flex-1 relative" style={{ height: "100vh" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <RegionMap />
        </div>

        {/* 기존 MapFilterButtons는 상단 메뉴에 옮겼으므로 필요시 제거 */}
      </main>
    </div>
  );
};

export default MapPage;
