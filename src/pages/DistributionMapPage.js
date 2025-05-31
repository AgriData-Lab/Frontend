import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/map/SideBar";
import RegionMap from "../components/map/RegionMap";
import "./MapPage.css";

const DistributionMapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} currentPage="distribution" />
      <main className="pt-12 flex-1 relative" style={{ height: "100vh" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <RegionMap mapType="distribution" />
        </div>
      </main>
    </div>
  );
};

export default DistributionMapPage; 